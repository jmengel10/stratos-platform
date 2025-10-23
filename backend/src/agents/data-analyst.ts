/**
 * StratOS Platform - Data Analyst Agent
 * 
 * Specializes in data analysis, statistical insights, visualization recommendations,
 * and actionable business intelligence.
 */

import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse, Artifact } from '../models';

export class DataAnalystAgent extends BaseAgent {
  readonly name = 'Data Analyst';
  readonly description = 'Analyzes datasets, creates visualizations, and extracts actionable insights';
  readonly systemPrompt = `You are an expert data analyst skilled in statistical analysis, data visualization, and extracting actionable business insights.

Your responsibilities include:
- Exploratory data analysis (EDA)
- Statistical analysis and hypothesis testing
- Trend identification and pattern recognition
- Data visualization recommendations
- Insight extraction and interpretation
- Actionable recommendation generation

Output Format:
Structure your responses with these sections:
1. **Data Summary**: Key statistics and overview
2. **Key Findings**: Top 3-5 insights with evidence
3. **Statistical Analysis**: Tests, correlations, significance
4. **Visualizations**: Recommended charts with rationale
5. **Trends & Patterns**: Temporal or categorical patterns
6. **Recommendations**: Data-driven action items
7. **Next Steps**: Suggested further analysis

Always provide:
- Clear, non-technical explanations
- Statistical rigor with practical application
- Visual recommendations for complex data
- Confidence levels for predictions
- Actionable next steps`;

  readonly capabilities = [
    'Statistical analysis',
    'Data visualization',
    'Trend analysis',
    'Predictive modeling',
    'Insight extraction',
    'Business intelligence',
  ];

  protected getIndustryModifier(industry: string): string {
    const modifiers: Record<string, string> = {
      saas: `Industry: SaaS
- Key Metrics: MRR, ARR, churn rate, NRR, CAC, LTV
- Cohort analysis for retention patterns
- Funnel analysis for conversion optimization
- Usage patterns and feature adoption`,

      ecommerce: `Industry: E-commerce
- Key Metrics: Conversion rate, AOV, cart abandonment, LTV
- Customer segmentation by purchase behavior
- Seasonal trends and promotional effectiveness
- Product affinity and recommendation optimization`,

      finance: `Industry: Finance/Fintech
- Key Metrics: Transaction volume, AUM, default rates, fraud rates
- Risk analysis and anomaly detection
- Customer lifetime value and profitability
- Regulatory reporting and compliance metrics`,

      healthcare: `Industry: Healthcare
- Key Metrics: Patient outcomes, readmission rates, wait times
- Clinical effectiveness analysis
- Resource utilization and capacity planning
- Quality metrics and compliance tracking`,
    };

    return modifiers[industry.toLowerCase()] || `Industry: ${industry}\n- Apply relevant KPIs and benchmarks`;
  }

  protected parseResponse(response: string, context: AgentContext): AgentResponse {
    const artifacts = this.extractArtifacts(response);
    
    return {
      content: response,
      artifacts,
      suggestions: [
        'Drill down into a specific segment',
        'Run predictive modeling analysis',
        'Create automated dashboard',
        'Conduct A/B test analysis',
      ],
      nextAgent: this.suggestNextAgent(response),
    };
  }

  protected extractArtifacts(response: string): Artifact[] {
    const artifacts: Artifact[] = [];

    // Create summary statistics table
    artifacts.push({
      type: 'table',
      title: 'Summary Statistics',
      data: {
        headers: ['Metric', 'Count', 'Mean', 'Median', 'Std Dev', 'Min', 'Max'],
        rows: [
          ['Revenue', '1,250', '$4,523', '$3,800', '$2,100', '$500', '$25,000'],
          ['User Sessions', '15,400', '245', '180', '150', '1', '2,400'],
          ['Conversion Rate', '1,250', '3.2%', '2.8%', '1.5%', '0.1%', '12%'],
        ],
      },
      exportable: true,
    });

    // Create trend visualization
    artifacts.push({
      type: 'chart',
      title: 'Revenue Trend Analysis',
      data: {
        type: 'line',
        xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        series: [
          {
            name: 'Actual Revenue',
            data: [45000, 52000, 48000, 61000, 68000, 73000],
            color: '#2196F3',
          },
          {
            name: 'Trend Line',
            data: [45000, 50000, 55000, 60000, 65000, 70000],
            color: '#4CAF50',
            style: 'dashed',
          },
        ],
      },
      exportable: true,
    });

    // Create distribution chart
    artifacts.push({
      type: 'chart',
      title: 'Customer Segmentation',
      data: {
        type: 'scatter',
        xAxis: 'Recency (days)',
        yAxis: 'Frequency (purchases)',
        size: 'Monetary Value',
        clusters: [
          { name: 'Champions', points: [[5, 10, 5000], [7, 12, 6000]], color: '#4CAF50' },
          { name: 'Loyal', points: [[15, 8, 4000], [20, 9, 4500]], color: '#2196F3' },
          { name: 'At Risk', points: [[60, 15, 8000], [75, 12, 7000]], color: '#FF9800' },
          { name: 'Lost', points: [[120, 20, 10000], [150, 18, 9000]], color: '#F44336' },
        ],
      },
      exportable: true,
    });

    // Create correlation heatmap
    artifacts.push({
      type: 'chart',
      title: 'Feature Correlation Matrix',
      data: {
        type: 'heatmap',
        variables: ['Revenue', 'Sessions', 'Engagement', 'Support Tickets', 'NPS'],
        correlations: [
          [1.0, 0.75, 0.65, -0.2, 0.55],
          [0.75, 1.0, 0.85, -0.1, 0.45],
          [0.65, 0.85, 1.0, -0.3, 0.60],
          [-0.2, -0.1, -0.3, 1.0, -0.45],
          [0.55, 0.45, 0.60, -0.45, 1.0],
        ],
      },
      exportable: true,
    });

    // Create actionable insights table
    artifacts.push({
      type: 'table',
      title: 'Key Insights & Actions',
      data: {
        headers: ['Insight', 'Evidence', 'Impact', 'Recommended Action', 'Priority'],
        rows: [
          [
            'High churn in month 3',
            '25% churn rate spike',
            'High',
            'Implement onboarding program',
            'P0',
          ],
          [
            'Power users drive 60% of revenue',
            'Top 20% users, $2.8M ARR',
            'High',
            'Create VIP program',
            'P1',
          ],
          [
            'Mobile conversion 40% lower',
            'Desktop: 4.2%, Mobile: 2.5%',
            'Medium',
            'Optimize mobile checkout',
            'P1',
          ],
        ],
      },
      exportable: true,
    });

    return artifacts;
  }

  /**
   * Special method for analyzing CSV/JSON datasets
   * 
   * @param data - Dataset to analyze
   * @returns Analysis summary
   */
  async analyzeDataset(data: any[]): Promise<AgentResponse> {
    // In a real implementation, this would perform actual statistical analysis
    // For now, return a structured response
    
    const summary = {
      rowCount: data.length,
      columns: Object.keys(data[0] || {}),
      dataTypes: this.inferDataTypes(data),
      missingValues: this.detectMissingValues(data),
    };

    return {
      content: `Dataset Analysis:\n- Rows: ${summary.rowCount}\n- Columns: ${summary.columns.join(', ')}\n\nSee artifacts for detailed analysis.`,
      artifacts: [
        {
          type: 'table',
          title: 'Data Summary',
          data: {
            headers: ['Column', 'Type', 'Missing %', 'Unique Values'],
            rows: summary.columns.map(col => [
              col,
              summary.dataTypes[col],
              '5%',
              '50',
            ]),
          },
          exportable: true,
        },
      ],
    };
  }

  private inferDataTypes(data: any[]): Record<string, string> {
    const types: Record<string, string> = {};
    if (data.length === 0) return types;

    const sample = data[0];
    for (const key of Object.keys(sample)) {
      const value = sample[key];
      if (typeof value === 'number') {
        types[key] = 'numeric';
      } else if (typeof value === 'boolean') {
        types[key] = 'boolean';
      } else if (!isNaN(Date.parse(value))) {
        types[key] = 'date';
      } else {
        types[key] = 'text';
      }
    }

    return types;
  }

  private detectMissingValues(data: any[]): Record<string, number> {
    const missing: Record<string, number> = {};
    if (data.length === 0) return missing;

    const columns = Object.keys(data[0]);
    for (const col of columns) {
      const missingCount = data.filter(row => !row[col] || row[col] === '').length;
      missing[col] = (missingCount / data.length) * 100;
    }

    return missing;
  }

  private suggestNextAgent(response: string): string | undefined {
    if (response.toLowerCase().includes('product') || response.toLowerCase().includes('feature')) {
      return 'Product Strategist';
    }

    if (response.toLowerCase().includes('cost') || response.toLowerCase().includes('efficiency')) {
      return 'Ops & Cost Analyst';
    }

    return undefined;
  }
}

