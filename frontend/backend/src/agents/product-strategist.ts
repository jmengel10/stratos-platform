/**
 * StratOS Platform - Product Strategist Agent
 * 
 * Specializes in product roadmaps, feature prioritization, user research,
 * and competitive analysis.
 */

import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse, Artifact } from '../models';

export class ProductStrategistAgent extends BaseAgent {
  readonly name = 'Product Strategist';
  readonly description = 'Develops product roadmaps, prioritizes features, and conducts user research analysis';
  readonly systemPrompt = `You are an expert product strategist with deep experience in user-centered design, agile development, and product management best practices.

Your responsibilities include:
- Product vision and strategy development
- Feature prioritization using frameworks (RICE, ICE, MoSCoW)
- User persona development and research synthesis
- Competitive analysis and market positioning
- Product roadmap planning (short and long-term)
- Success metrics and OKR definition

Output Format:
Structure your responses with these sections:
1. **Product Vision**: 2-3 sentence aspirational statement
2. **User Personas**: Primary and secondary user profiles
3. **Feature Analysis**: Prioritized features with rationale
4. **Roadmap**: Timeline with milestones and dependencies
5. **Competitive Insights**: Gaps and opportunities vs. competitors
6. **Success Metrics**: KPIs and measurement framework
7. **Recommendations**: Prioritized action items

Always provide:
- User-centric perspective
- Data-driven prioritization
- Clear trade-offs and dependencies
- Alignment with business goals`;

  readonly capabilities = [
    'Product roadmapping',
    'Feature prioritization',
    'User research analysis',
    'Competitive analysis',
    'Persona development',
    'Metrics definition',
  ];

  protected getIndustryModifier(industry: string): string {
    const modifiers: Record<string, string> = {
      saas: `Industry: SaaS
- Focus on user onboarding and time-to-value
- Prioritize features that drive activation and retention
- Consider freemium vs. paid feature gates
- Emphasize product-led growth opportunities`,

      mobile: `Industry: Mobile Apps
- Focus on app store optimization and first-time user experience
- Prioritize features that drive daily active usage
- Consider offline functionality and performance
- Emphasize push notifications and engagement loops`,

      enterprise: `Industry: Enterprise Software
- Focus on workflow integration and admin controls
- Prioritize features that drive adoption across organization
- Consider security, compliance, and audit requirements
- Emphasize SSO, permissions, and role-based access`,

      ecommerce: `Industry: E-commerce
- Focus on conversion optimization and checkout flow
- Prioritize features that reduce cart abandonment
- Consider mobile shopping experience
- Emphasize personalization and recommendations`,
    };

    return modifiers[industry.toLowerCase()] || `Industry: ${industry}\n- Apply industry-specific user expectations`;
  }

  protected parseResponse(response: string, context: AgentContext): AgentResponse {
    const artifacts = this.extractArtifacts(response);
    
    return {
      content: response,
      artifacts,
      suggestions: [
        'Conduct user interviews to validate priorities',
        'Create detailed user stories for top features',
        'Analyze competitor feature gaps',
        'Define success metrics for next quarter',
      ],
      nextAgent: this.suggestNextAgent(response),
    };
  }

  protected extractArtifacts(response: string): Artifact[] {
    const artifacts: Artifact[] = [];

    // Create product roadmap
    artifacts.push({
      type: 'chart',
      title: 'Product Roadmap',
      data: {
        type: 'gantt',
        quarters: [
          {
            name: 'Q1 2024',
            features: [
              { name: 'User Authentication', priority: 'P0', status: 'in-progress' },
              { name: 'Dashboard MVP', priority: 'P0', status: 'planned' },
            ],
          },
          {
            name: 'Q2 2024',
            features: [
              { name: 'Advanced Analytics', priority: 'P1', status: 'planned' },
              { name: 'Mobile App Beta', priority: 'P1', status: 'planned' },
            ],
          },
          {
            name: 'Q3 2024',
            features: [
              { name: 'API Platform', priority: 'P1', status: 'backlog' },
              { name: 'Enterprise SSO', priority: 'P2', status: 'backlog' },
            ],
          },
        ],
      },
      exportable: true,
    });

    // Create feature prioritization matrix
    artifacts.push({
      type: 'table',
      title: 'Feature Prioritization (RICE Framework)',
      data: {
        headers: ['Feature', 'Reach', 'Impact', 'Confidence', 'Effort', 'RICE Score', 'Priority'],
        rows: [
          ['User Onboarding Flow', '1000', 'High (3)', '100%', '2 weeks', '1500', 'P0'],
          ['Advanced Search', '500', 'Medium (2)', '80%', '3 weeks', '267', 'P1'],
          ['Dark Mode', '800', 'Low (1)', '100%', '1 week', '800', 'P1'],
          ['Bulk Actions', '300', 'High (3)', '70%', '4 weeks', '158', 'P2'],
          ['Export to PDF', '600', 'Medium (2)', '90%', '2 weeks', '540', 'P1'],
        ],
      },
      exportable: true,
      metadata: {
        note: 'RICE Score = (Reach × Impact × Confidence) / Effort',
      },
    });

    // Create user persona cards
    artifacts.push({
      type: 'framework',
      title: 'User Personas',
      data: {
        personas: [
          {
            name: 'Alex - The Power User',
            role: 'Product Manager',
            goals: ['Streamline workflow', 'Data-driven decisions', 'Team collaboration'],
            painPoints: ['Too many tools', 'Manual reporting', 'Slow performance'],
            behaviors: ['Daily user', 'Power features', 'Mobile + desktop'],
          },
          {
            name: 'Sam - The Administrator',
            role: 'IT Manager',
            goals: ['Security compliance', 'User management', 'Cost optimization'],
            painPoints: ['Integration complexity', 'Lack of control', 'Poor visibility'],
            behaviors: ['Weekly user', 'Admin panel', 'Desktop only'],
          },
        ],
      },
      exportable: true,
    });

    // Create competitive analysis matrix
    artifacts.push({
      type: 'table',
      title: 'Competitive Feature Matrix',
      data: {
        headers: ['Feature', 'Your Product', 'Competitor A', 'Competitor B', 'Competitive Advantage'],
        rows: [
          ['Real-time Collaboration', '✓', '✓', '✗', 'Parity'],
          ['AI-Powered Insights', '✓', '✗', '✗', 'Strong Differentiator'],
          ['Mobile App', 'Planned Q2', '✓', '✓', 'Catch-up Required'],
          ['Enterprise SSO', 'Planned Q3', '✓', '✓', 'Must-have for Enterprise'],
          ['API Access', '✓', 'Limited', '✓', 'Moderate Advantage'],
        ],
      },
      exportable: true,
    });

    return artifacts;
  }

  private suggestNextAgent(response: string): string | undefined {
    if (response.toLowerCase().includes('launch') || response.toLowerCase().includes('market')) {
      return 'GTM Strategist';
    }

    if (response.toLowerCase().includes('data') || response.toLowerCase().includes('analytics')) {
      return 'Data Analyst';
    }

    return undefined;
  }
}

