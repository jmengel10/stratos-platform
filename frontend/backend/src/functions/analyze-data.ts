/**
 * StratOS Platform - Analyze Data Function
 * 
 * AI-powered data analysis with statistical profiling and visualization suggestions
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../utils/auth';
import { CosmosService } from '../services/cosmos.service';
import { StorageService } from '../services/storage.service';
import { OpenAIService } from '../services/openai.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';

const cosmosService = new CosmosService();
const storageService = new StorageService();
const openaiService = new OpenAIService();

interface AnalysisRequest {
  fileId?: string;
  data?: any[];
  analysisType: 'exploratory' | 'statistical' | 'visualization' | 'insights';
  customQuestions?: string[];
}

async function analyzeDataHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const startTime = Date.now();

  try {
    // Validate authentication
    const user = validateToken(request);

    // Parse request body
    const body = await request.json() as AnalysisRequest;
    
    if (!body.analysisType) {
      throw new ValidationError('Analysis type is required');
    }

    context.log(`Analyzing data for user: ${user.userId}, type: ${body.analysisType}`);

    let data: any[] = [];
    let fileInfo: any = null;

    // Get data from file or direct input
    if (body.fileId) {
      // Retrieve file metadata from Cosmos
      const document = await cosmosService.getDocument('documents', body.fileId, user.tenantId);
      
      if (!document) {
        throw new ValidationError('File not found');
      }

      // Verify ownership
      if (document.tenantId !== user.tenantId) {
        throw new ValidationError('Access denied');
      }

      fileInfo = {
        id: document.id,
        name: document.fileName,
        type: document.fileType,
      };

      // Download file from blob storage
      const fileName = `${user.tenantId}/${user.userId}/${body.fileId}-${document.fileName}`;
      const fileContent = await storageService.downloadFile('documents', fileName);

      // Parse file content based on type
      data = await parseFileContent(fileContent.content, document.fileType);

    } else if (body.data && Array.isArray(body.data)) {
      // Use provided data directly
      data = body.data;
    } else {
      throw new ValidationError('Either fileId or data is required');
    }

    // Validate data
    if (!data || data.length === 0) {
      throw new ValidationError('No data to analyze');
    }

    context.log(`Analyzing ${data.length} rows of data`);

    // Profile the data
    const profile = profileData(data);

    // Build analysis prompt based on type
    const prompt = buildAnalysisPrompt(body.analysisType, profile, data, body.customQuestions);

    // Call OpenAI for analysis
    const analysisResponse = await openaiService.chat(
      [{ role: 'user', content: prompt }],
      {
        temperature: 0.3,
        maxTokens: 3000,
      }
    );

    // Parse response based on analysis type
    let parsedResult: any = {};

    if (body.analysisType === 'visualization') {
      // Try to parse as JSON for chart configurations
      try {
        const jsonMatch = analysisResponse.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResult.visualizations = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // If parsing fails, return raw content
        parsedResult.content = analysisResponse.content;
      }
    } else {
      parsedResult.content = analysisResponse.content;
    }

    // Save analysis to Cosmos
    const analysisId = await cosmosService.createDocument('outputs', {
      tenantId: user.tenantId,
      userId: user.userId,
      conversationId: 'data-analysis',
      agentName: 'Data Analyst',
      content: analysisResponse.content,
      artifacts: [],
      metadata: {
        fileId: body.fileId,
        analysisType: body.analysisType,
        rowCount: data.length,
        columnCount: profile.columnCount,
        tokensUsed: analysisResponse.tokensUsed,
      },
    });

    // Track metrics
    const duration = Date.now() - startTime;
    insights.trackUserActivity('analyze-data', user.userId, user.tenantId, {
      analysisType: body.analysisType,
      rowCount: data.length,
      duration,
    });

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        analysisId: analysisId.id,
        fileInfo,
        profile,
        analysis: parsedResult,
        metadata: {
          tokensUsed: analysisResponse.tokensUsed,
          duration,
          model: analysisResponse.model,
        },
      },
    };

  } catch (error: any) {
    context.error('Analyze data error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/analyze-data',
    });

    return {
      status: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: error.message || 'Analysis failed',
        code: error.code || 'ANALYSIS_ERROR',
      },
    };
  }
}

/**
 * Parse file content based on type
 */
async function parseFileContent(buffer: Buffer, fileType: string): Promise<any[]> {
  const content = buffer.toString('utf-8');

  // CSV
  if (fileType === 'text/csv' || content.startsWith(',') || content.includes('\t')) {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      return row;
    });
  }

  // JSON
  if (fileType === 'application/json') {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      throw new Error('Invalid JSON format');
    }
  }

  // For Excel and other types, return placeholder
  // In production, use libraries like 'xlsx' to parse
  return [{ note: 'File parsing for this type requires additional libraries' }];
}

/**
 * Profile dataset - calculate statistics and metadata
 */
function profileData(data: any[]): any {
  if (data.length === 0) {
    return { rowCount: 0, columnCount: 0, columns: [] };
  }

  const columns = Object.keys(data[0]);
  
  const columnProfiles = columns.map(col => {
    const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
    const numericValues = values.map(v => parseFloat(String(v))).filter(n => !isNaN(n));
    
    const isNumeric = numericValues.length > values.length * 0.8;
    const nullCount = data.length - values.length;
    const uniqueValues = new Set(values);

    const stats: any = {
      name: col,
      type: isNumeric ? 'numeric' : 'text',
      nullCount,
      nullPercentage: (nullCount / data.length * 100).toFixed(2),
      uniqueCount: uniqueValues.size,
      sampleValues: Array.from(uniqueValues).slice(0, 5),
    };

    if (isNumeric && numericValues.length > 0) {
      const sorted = numericValues.sort((a, b) => a - b);
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const mean = sum / numericValues.length;
      
      stats.statistics = {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean: parseFloat(mean.toFixed(2)),
        median: sorted[Math.floor(sorted.length / 2)],
        sum: parseFloat(sum.toFixed(2)),
      };
    }

    return stats;
  });

  return {
    rowCount: data.length,
    columnCount: columns.length,
    columns: columnProfiles,
    missingDataPercentage: calculateMissingPercentage(data),
  };
}

/**
 * Calculate overall missing data percentage
 */
function calculateMissingPercentage(data: any[]): number {
  if (data.length === 0) return 0;

  let totalCells = 0;
  let missingCells = 0;

  data.forEach(row => {
    Object.values(row).forEach(value => {
      totalCells++;
      if (value === null || value === undefined || value === '') {
        missingCells++;
      }
    });
  });

  return parseFloat(((missingCells / totalCells) * 100).toFixed(2));
}

/**
 * Build AI analysis prompt based on type
 */
function buildAnalysisPrompt(
  analysisType: string,
  profile: any,
  data: any[],
  customQuestions?: string[]
): string {
  const sampleData = JSON.stringify(data.slice(0, 20), null, 2);
  const profileStr = JSON.stringify(profile, null, 2);

  const baseContext = `Dataset Profile:
${profileStr}

Sample Data (first 20 rows):
${sampleData}

${customQuestions ? `\nAdditional Questions:\n${customQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}` : ''}`;

  switch (analysisType) {
    case 'exploratory':
      return `You are an expert data analyst. Analyze this dataset and provide:

1. **DATASET OVERVIEW**
   - Summary of what this data represents
   - Number of records and variables
   - Time period covered (if applicable)

2. **DATA QUALITY ASSESSMENT**
   - Missing values and their impact
   - Data type consistency
   - Potential data quality issues
   - Outliers and anomalies

3. **KEY STATISTICS**
   - Central tendencies (mean, median)
   - Distributions and spread
   - Notable patterns

4. **PATTERNS & CORRELATIONS**
   - Relationships between variables
   - Trends over time (if time-series)
   - Segmentation opportunities

5. **INSIGHTS & RECOMMENDATIONS**
   - Key findings (top 5)
   - Actionable recommendations
   - Suggested next steps for analysis

${baseContext}

Provide response in clear, structured markdown format with bullet points and sections.`;

    case 'statistical':
      return `You are an expert statistician. Provide detailed statistical analysis of this dataset:

1. **DESCRIPTIVE STATISTICS**
   - For each numeric column: mean, median, mode, std dev, range
   - Distribution characteristics (normal, skewed, etc.)

2. **CORRELATION ANALYSIS**
   - Identify significant correlations between variables
   - Strength and direction of relationships

3. **OUTLIER DETECTION**
   - Identify outliers using IQR method
   - Assess impact of outliers

4. **HYPOTHESIS TESTING** (if applicable)
   - Suggest relevant statistical tests
   - Confidence intervals

5. **STATISTICAL INSIGHTS**
   - What do the statistics tell us?
   - Are there statistically significant findings?

${baseContext}

Provide detailed statistical analysis in markdown format.`;

    case 'visualization':
      return `Based on this dataset, suggest the 5 most insightful visualizations to create.

For each visualization, provide:
1. Chart type (bar, line, scatter, pie, heatmap, area)
2. Variables to plot (x-axis, y-axis, grouping, size)
3. Why this visualization is valuable
4. What insight it reveals
5. Priority (1-5, where 1 is highest)

${baseContext}

Return as JSON array in this format:
[
  {
    "type": "bar",
    "title": "Revenue by Category",
    "xAxis": "category",
    "yAxis": "revenue",
    "insight": "Shows which categories generate most revenue",
    "priority": 1,
    "config": {
      "colors": ["#3b82f6"],
      "stacked": false
    }
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text.`;

    case 'insights':
      return `You are a business analyst. Extract actionable business insights from this dataset:

1. **KEY BUSINESS METRICS**
   - Most important metrics identified
   - Current performance levels

2. **TRENDS & PATTERNS**
   - What trends are emerging?
   - Seasonal patterns?
   - Growth/decline indicators

3. **OPPORTUNITIES**
   - Where are the biggest opportunities?
   - Quick wins identified
   - Long-term opportunities

4. **RISKS & CONCERNS**
   - What are the red flags?
   - Areas requiring attention

5. **ACTIONABLE RECOMMENDATIONS**
   - Top 5 specific, actionable recommendations
   - Expected impact of each
   - Implementation priority

${baseContext}

Focus on business value and actionable insights. Use clear, non-technical language.`;

    default:
      return `Analyze this dataset and provide insights:\n\n${baseContext}`;
  }
}

app.http('analyze-data', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'analyze-data',
  handler: analyzeDataHandler,
});

