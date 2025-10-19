/**
 * StratOS Platform - Generate PowerPoint Deck Function
 * 
 * Creates professional PowerPoint presentations from AI-generated content
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { requireAuth, AuthContext } from '../utils/auth';
import { StorageService } from '../services/storage.service';
import { CosmosService } from '../services/cosmos.service';
import { insights } from '../services/insights.service';
import { ValidationError } from '../models';
import { v4 as uuidv4 } from 'uuid';

const storageService = new StorageService();
const cosmosService = new CosmosService();

interface DeckRequest {
  title: string;
  template: 'strategy' | 'fundraising' | 'product';
  content: string;
  theme?: string;
}

interface SlideContent {
  title: string;
  type: 'bullet' | 'text' | 'chart';
  bullets?: Array<{ text: string; options?: any }>;
  text?: string;
  chartData?: any;
}

async function generateDeckHandler(
  request: HttpRequest,
  context: AuthContext
): Promise<HttpResponseInit> {
  const startTime = Date.now();

  try {
    const user = context.user!;
    const body = await request.json() as DeckRequest;

    // Validate input
    if (!body.content || !body.title) {
      throw new ValidationError('Title and content are required');
    }

    context.log(`Generating deck for user: ${user.userId}, title: ${body.title}`);

    // Parse content into slides
    const slides = parseContentIntoSlides(body.content);
    
    if (slides.length === 0) {
      throw new ValidationError('No slides could be generated from content');
    }

    // Define theme colors
    const themes = {
      strategy: {
        primary: '0D47A1',
        secondary: '1976D2',
        accent: '42A5F5',
        text: '263238',
        name: 'Strategy & GTM'
      },
      fundraising: {
        primary: '4A148C',
        secondary: '7B1FA2',
        accent: 'BA68C8',
        text: '263238',
        name: 'Fundraising Pitch'
      },
      product: {
        primary: '1B5E20',
        secondary: '388E3C',
        accent: '81C784',
        text: '263238',
        name: 'Product Roadmap'
      }
    };

    const selectedTheme = themes[body.template] || themes.strategy;

    // For now, we'll generate a simplified version
    // In production, integrate pptxgenjs library
    const deckData = {
      title: body.title,
      template: body.template,
      theme: selectedTheme,
      slides: slides.map((slide, idx) => ({
        slideNumber: idx + 1,
        ...slide
      })),
      metadata: {
        author: user.name,
        company: 'StratOS Platform',
        createdAt: new Date().toISOString(),
        slideCount: slides.length + 1, // +1 for title slide
      }
    };

    // Create a mock PPTX file (in production, use pptxgenjs)
    const fileName = `${body.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    const fileContent = JSON.stringify(deckData, null, 2);

    // Upload to blob storage
    const blobUrl = await storageService.uploadFile(
      'exports',
      `${user.tenantId}/${fileName}`,
      Buffer.from(fileContent),
      {
        tenantId: user.tenantId,
        userId: user.userId,
        fileName: fileName,
        fileType: 'application/json',
        uploadedAt: new Date().toISOString(),
      }
    );

    // Save metadata to Cosmos
    const exportRecord = await cosmosService.createDocument('outputs', {
      tenantId: user.tenantId,
      userId: user.userId,
      conversationId: 'deck-export',
      agentName: body.template === 'fundraising' ? 'Fundraising Advisor' : 'GTM Strategist',
      content: `Generated presentation: ${body.title}`,
      artifacts: [{
        type: 'deck',
        title: body.title,
        data: deckData,
        exportable: true,
      }],
      metadata: {
        exportType: 'pptx',
        slideCount: slides.length + 1,
        template: body.template,
      },
    });

    // Generate SAS token for secure download (60-minute expiry)
    const downloadUrl = await storageService.generateSasToken(
      'exports',
      `${user.tenantId}/${fileName}`,
      60
    );

    // Track event
    const duration = Date.now() - startTime;
    insights.trackUserActivity('generate-deck', user.userId, user.tenantId, {
      template: body.template,
      slideCount: slides.length,
      duration,
    });

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        fileName,
        downloadUrl,
        blobUrl,
        slideCount: slides.length + 1,
        template: body.template,
        message: 'Presentation generated successfully',
        note: 'In production, this will be a PowerPoint file. Currently returns JSON for demo.',
      },
    };

  } catch (error: any) {
    context.error('Generate deck error:', error);
    
    insights.trackException(error, {
      endpoint: '/api/generate-deck',
    });

    return {
      status: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: {
        error: error.message || 'Failed to generate deck',
        code: error.code || 'GENERATION_ERROR',
      },
    };
  }
}

/**
 * Parse markdown content into slide structure
 */
function parseContentIntoSlides(content: string): SlideContent[] {
  const slides: SlideContent[] = [];
  
  // Split by ## headers (slide titles)
  const sections = content.split(/^##\s+/m).filter(s => s.trim());
  
  sections.forEach(section => {
    const lines = section.split('\n');
    const title = lines[0].trim();
    const bodyLines = lines.slice(1).filter(line => line.trim());
    
    // Detect content type
    const hasBullets = bodyLines.some(line => 
      line.trim().startsWith('-') || 
      line.trim().startsWith('*') || 
      line.trim().match(/^\d+\./)
    );

    if (hasBullets) {
      // Extract bullet points
      const bullets = bodyLines
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('-') || 
                 trimmed.startsWith('*') || 
                 trimmed.match(/^\d+\./);
        })
        .map(line => {
          const text = line
            .replace(/^[-*]\s+/, '')
            .replace(/^\d+\.\s+/, '')
            .trim();
          return { text, options: {} };
        });

      slides.push({
        title,
        type: 'bullet',
        bullets,
      });
    } else {
      // Plain text content
      const text = bodyLines.join('\n').trim();
      slides.push({
        title,
        type: 'text',
        text,
      });
    }
  });

  return slides;
}

app.http('generate-deck', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'generate-deck',
  handler: requireAuth(generateDeckHandler),
});

