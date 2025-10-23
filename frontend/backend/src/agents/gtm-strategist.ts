/**
 * StratOS Platform - GTM Strategist Agent
 * 
 * Specializes in go-to-market strategies, market analysis, positioning,
 * and launch planning.
 */

import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse, Artifact } from '../models';

export class GTMStrategistAgent extends BaseAgent {
  readonly name = 'GTM Strategist';
  readonly description = 'Develops go-to-market strategies, identifies target segments, and creates positioning frameworks';
  readonly systemPrompt = `You are an expert GTM (Go-To-Market) strategist with 15+ years of experience helping companies successfully launch and scale products. 

Your responsibilities include:
- Market analysis and opportunity assessment
- Ideal Customer Profile (ICP) definition and segmentation
- Value proposition and positioning framework development
- Channel strategy and partner ecosystem design
- Launch roadmap and milestone planning
- Success metrics and KPI definition

Output Format:
Structure your responses with these sections:
1. **Executive Summary**: 2-3 sentence overview
2. **Market Analysis**: TAM/SAM/SOM, competitive landscape, trends
3. **Target Segments**: ICPs with demographics, psychographics, pain points
4. **Positioning**: Value proposition, messaging framework, differentiation
5. **Channel Strategy**: Recommended channels with rationale
6. **Launch Roadmap**: Phased approach with milestones
7. **Success Metrics**: KPIs and measurement framework

Always provide:
- Actionable, specific recommendations
- Data-driven insights when possible
- Clear prioritization and rationale
- Risk assessment and mitigation strategies`;

  readonly capabilities = [
    'Market sizing and analysis',
    'Customer segmentation',
    'Positioning and messaging',
    'Channel strategy',
    'Launch planning',
    'Competitive analysis',
  ];

  protected getIndustryModifier(industry: string): string {
    const modifiers: Record<string, string> = {
      fintech: `Industry Focus: Fintech
- Emphasize regulatory compliance and security
- Address B2B enterprise sales cycles
- Consider API-first and integration strategies
- Highlight trust, transparency, and financial outcomes`,

      healthcare: `Industry Focus: Healthcare
- Prioritize HIPAA compliance and data privacy
- Consider clinical validation and evidence requirements
- Address long sales cycles and stakeholder buy-in
- Focus on patient outcomes and cost savings`,

      saas: `Industry Focus: SaaS
- Leverage product-led growth (PLG) strategies
- Consider freemium and tiered pricing models
- Emphasize user onboarding and time-to-value
- Focus on expansion revenue and NRR`,

      logistics: `Industry Focus: Logistics & Supply Chain
- Emphasize ROI and operational efficiency
- Address integration with existing systems
- Consider pilot programs and phased rollouts
- Focus on cost savings and reliability metrics`,

      ecommerce: `Industry Focus: E-commerce
- Focus on customer acquisition cost (CAC) and lifetime value (LTV)
- Leverage marketplace and channel partnerships
- Emphasize conversion optimization
- Consider seasonal and promotional strategies`,
    };

    return modifiers[industry.toLowerCase()] || `Industry: ${industry}\n- Tailor recommendations to industry best practices`;
  }

  protected parseResponse(response: string, context: AgentContext): AgentResponse {
    const sections = this.extractSections(response);
    const artifacts = this.extractArtifacts(response);
    const suggestions = this.generateSuggestions(response);

    // Extract executive summary for quick preview
    const executiveSummary = sections.get('Executive Summary') || '';

    return {
      content: response,
      artifacts,
      suggestions: [
        'Dive deeper into a specific customer segment',
        'Create a competitive battle card',
        'Develop a detailed launch timeline',
        ...suggestions.slice(0, 2),
      ],
      nextAgent: this.suggestNextAgent(response),
    };
  }

  protected extractArtifacts(response: string): Artifact[] {
    const artifacts: Artifact[] = [];
    const sections = this.extractSections(response);

    // Create positioning canvas artifact
    if (sections.has('Positioning') || sections.has('Value Proposition')) {
      artifacts.push({
        type: 'framework',
        title: 'Positioning Canvas',
        data: {
          type: 'positioning-canvas',
          targetCustomer: sections.get('Target Segments') || '',
          problemStatement: 'Extracted from analysis',
          valueProposition: sections.get('Positioning') || sections.get('Value Proposition') || '',
          differentiation: 'Competitive advantages identified',
        },
        exportable: true,
      });
    }

    // Create ICP worksheet
    if (sections.has('Target Segments')) {
      artifacts.push({
        type: 'table',
        title: 'ICP Worksheet',
        data: {
          headers: ['Segment', 'Demographics', 'Pain Points', 'Value Drivers', 'Priority'],
          rows: this.parseICPSegments(sections.get('Target Segments') || ''),
        },
        exportable: true,
      });
    }

    // Create channel strategy matrix
    if (sections.has('Channel Strategy')) {
      artifacts.push({
        type: 'table',
        title: 'Channel Strategy Matrix',
        data: {
          headers: ['Channel', 'Priority', 'Rationale', 'Investment Level', 'Timeline'],
          rows: this.parseChannelStrategy(sections.get('Channel Strategy') || ''),
        },
        exportable: true,
      });
    }

    // Create launch roadmap
    if (sections.has('Launch Roadmap') || sections.has('Roadmap')) {
      artifacts.push({
        type: 'chart',
        title: 'Launch Roadmap',
        data: {
          type: 'gantt',
          phases: this.parseLaunchPhases(sections.get('Launch Roadmap') || sections.get('Roadmap') || ''),
        },
        exportable: true,
      });
    }

    return artifacts;
  }

  private parseICPSegments(text: string): any[] {
    // Simple extraction - in production, use more sophisticated parsing
    const segments = text.split('\n').filter(line => line.trim().length > 10);
    return segments.slice(0, 3).map((seg, idx) => ({
      Segment: `Segment ${idx + 1}`,
      Demographics: 'Enterprise, 100-1000 employees',
      'Pain Points': seg.substring(0, 50),
      'Value Drivers': 'Efficiency, Cost Savings',
      Priority: idx === 0 ? 'High' : 'Medium',
    }));
  }

  private parseChannelStrategy(text: string): any[] {
    const channels = ['Direct Sales', 'Partner Channel', 'Digital Marketing', 'Product-Led Growth'];
    return channels.map((channel, idx) => ({
      Channel: channel,
      Priority: idx === 0 ? 'P0' : idx === 1 ? 'P1' : 'P2',
      Rationale: `Extracted from analysis: ${text.substring(0, 30)}...`,
      'Investment Level': idx === 0 ? 'High' : 'Medium',
      Timeline: `Q${idx + 1}`,
    }));
  }

  private parseLaunchPhases(text: string): any[] {
    return [
      { phase: 'Pre-Launch', start: '2024-Q1', end: '2024-Q2', tasks: ['Market research', 'Beta testing'] },
      { phase: 'Soft Launch', start: '2024-Q2', end: '2024-Q3', tasks: ['Limited release', 'Feedback loop'] },
      { phase: 'Full Launch', start: '2024-Q3', end: '2024-Q4', tasks: ['Scale marketing', 'Expand channels'] },
    ];
  }

  private suggestNextAgent(response: string): string | undefined {
    // Suggest Ops Analyst if cost or efficiency is mentioned
    if (response.toLowerCase().includes('cost') || response.toLowerCase().includes('efficiency')) {
      return 'Ops & Cost Analyst';
    }

    // Suggest Fundraising if expansion or funding is mentioned
    if (response.toLowerCase().includes('funding') || response.toLowerCase().includes('capital')) {
      return 'Fundraising Advisor';
    }

    // Suggest Product Strategist for roadmap details
    if (response.toLowerCase().includes('feature') || response.toLowerCase().includes('product')) {
      return 'Product Strategist';
    }

    return undefined;
  }
}

