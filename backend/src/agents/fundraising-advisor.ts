/**
 * StratOS Platform - Fundraising Advisor Agent
 * 
 * Specializes in pitch decks, financial projections, investor targeting,
 * and fundraising strategy.
 */

import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse, Artifact } from '../models';

export class FundraisingAdvisorAgent extends BaseAgent {
  readonly name = 'Fundraising Advisor';
  readonly description = 'Creates pitch decks, financial projections, and investor targeting strategies';
  readonly systemPrompt = `You are an expert fundraising advisor with extensive experience helping startups raise capital from seed to Series C and beyond.

Your responsibilities include:
- Pitch deck structure and narrative development
- Financial modeling and projections (3-5 year outlook)
- Investor targeting and prioritization
- Valuation guidance and cap table strategy
- Due diligence preparation
- Fundraising timeline and milestone planning

Output Format:
Structure your responses with these sections:
1. **Executive Summary**: Investment opportunity overview
2. **Pitch Narrative**: Compelling story and key messages
3. **Financial Projections**: Revenue, costs, and key metrics
4. **Investor Targeting**: Types, stages, and specific firms
5. **Valuation Framework**: Comparable analysis and rationale
6. **Timeline & Milestones**: Fundraising process roadmap
7. **Due Diligence Prep**: Key documents and data room checklist

Always provide:
- Investor-ready, professional language
- Realistic yet ambitious projections
- Specific, actionable recommendations
- Market data and comparable examples`;

  readonly capabilities = [
    'Pitch deck development',
    'Financial modeling',
    'Investor targeting',
    'Valuation analysis',
    'Due diligence preparation',
    'Fundraising strategy',
  ];

  protected getIndustryModifier(industry: string): string {
    const modifiers: Record<string, string> = {
      fintech: `Industry: Fintech
- Target investors: Fintech-focused VCs, strategic corporate investors
- Key metrics: Transaction volume, AUM, NRR, CAC payback
- Regulatory considerations: Licensing, compliance costs
- Highlight: Unit economics, fraud prevention, security`,

      healthcare: `Industry: Healthcare
- Target investors: Healthcare VCs, life science funds
- Key metrics: Patient outcomes, clinical validation, user engagement
- Regulatory considerations: FDA approval, HIPAA compliance, reimbursement
- Highlight: Clinical evidence, provider/payer relationships`,

      saas: `Industry: SaaS
- Target investors: SaaS-focused VCs, growth equity funds
- Key metrics: ARR, NRR, CAC, LTV, Rule of 40
- Growth drivers: Product-led growth, expansion revenue
- Highlight: Scalability, retention, unit economics`,

      deeptech: `Industry: Deep Tech
- Target investors: Deep tech VCs, corporate venture, government grants
- Key metrics: IP portfolio, technical milestones, validation
- Development timeline: Extended R&D cycles
- Highlight: Technical moat, patents, team credentials`,

      consumer: `Industry: Consumer
- Target investors: Consumer VCs, strategic brands
- Key metrics: DAU/MAU, retention, virality, LTV/CAC
- Growth drivers: Network effects, brand loyalty
- Highlight: User growth, engagement, community`,
    };

    return modifiers[industry.toLowerCase()] || `Industry: ${industry}\n- Customize approach for industry investor preferences`;
  }

  protected parseResponse(response: string, context: AgentContext): AgentResponse {
    const artifacts = this.extractArtifacts(response);
    
    return {
      content: response,
      artifacts,
      suggestions: [
        'Refine pitch deck narrative',
        'Model different growth scenarios',
        'Identify specific investors to target',
        'Prepare due diligence materials',
      ],
      nextAgent: this.suggestNextAgent(response),
    };
  }

  protected extractArtifacts(response: string): Artifact[] {
    const artifacts: Artifact[] = [];

    // Create pitch deck outline
    artifacts.push({
      type: 'deck',
      title: 'Pitch Deck Outline',
      data: {
        slides: [
          { title: 'Cover', content: 'Company name, tagline, contact' },
          { title: 'Problem', content: 'The pain point you're solving' },
          { title: 'Solution', content: 'Your product/service' },
          { title: 'Market Opportunity', content: 'TAM/SAM/SOM analysis' },
          { title: 'Product', content: 'Demo or product walkthrough' },
          { title: 'Traction', content: 'Key metrics and milestones' },
          { title: 'Business Model', content: 'How you make money' },
          { title: 'Competitive Landscape', content: 'Positioning and differentiation' },
          { title: 'Team', content: 'Founder/leadership backgrounds' },
          { title: 'Financials', content: 'Projections and unit economics' },
          { title: 'Ask', content: 'Funding amount and use of funds' },
        ],
      },
      exportable: true,
    });

    // Create financial model
    artifacts.push({
      type: 'excel',
      title: '3-Year Financial Projections',
      data: {
        type: 'financial-model',
        sheets: [
          {
            name: 'P&L',
            data: [
              ['', 'Year 1', 'Year 2', 'Year 3'],
              ['Revenue', '$500K', '$2.5M', '$8M'],
              ['COGS', '($150K)', '($750K)', '($2.4M)'],
              ['Gross Profit', '$350K', '$1.75M', '$5.6M'],
              ['Gross Margin', '70%', '70%', '70%'],
              ['Operating Expenses', '($1.2M)', '($2.5M)', '($5M)'],
              ['EBITDA', '($850K)', '($750K)', '$600K'],
              ['EBITDA Margin', '-170%', '-30%', '7.5%'],
            ],
          },
          {
            name: 'Key Metrics',
            data: [
              ['Metric', 'Year 1', 'Year 2', 'Year 3'],
              ['Customers', '50', '250', '800'],
              ['ARR', '$500K', '$2.5M', '$8M'],
              ['CAC', '$10K', '$8K', '$6K'],
              ['LTV', '$35K', '$40K', '$45K'],
              ['LTV/CAC', '3.5x', '5.0x', '7.5x'],
              ['NRR', '105%', '115%', '120%'],
            ],
          },
        ],
      },
      exportable: true,
    });

    // Create investor CRM
    artifacts.push({
      type: 'table',
      title: 'Target Investor List',
      data: {
        headers: ['Firm Name', 'Stage Focus', 'Sector Focus', 'Check Size', 'Priority', 'Contact'],
        rows: [
          ['Andreessen Horowitz', 'Series A-B', 'Enterprise SaaS', '$10-25M', 'High', 'Partner name'],
          ['Sequoia Capital', 'Series A-B', 'Multi-sector', '$15-50M', 'High', 'Partner name'],
          ['Accel', 'Series A', 'SaaS, Infrastructure', '$10-20M', 'High', 'Partner name'],
          ['Insight Partners', 'Growth', 'SaaS, Tech', '$25-100M', 'Medium', 'Partner name'],
          ['Tiger Global', 'Series B+', 'Multi-sector', '$50M+', 'Medium', 'Partner name'],
        ],
      },
      exportable: true,
    });

    // Create due diligence checklist
    artifacts.push({
      type: 'markdown',
      title: 'Due Diligence Checklist',
      data: `# Due Diligence Preparation Checklist

## Legal Documents
- [ ] Certificate of Incorporation
- [ ] Cap table (fully diluted)
- [ ] Stock option plan documents
- [ ] Material contracts (customers, partners, vendors)
- [ ] IP assignment agreements
- [ ] Employment agreements (executives)

## Financial Documents
- [ ] Financial statements (3 years)
- [ ] Monthly management accounts
- [ ] Revenue by customer/cohort
- [ ] Budget vs. actuals
- [ ] Cash flow projections

## Business Documents
- [ ] Business plan / strategy deck
- [ ] Product roadmap
- [ ] Sales pipeline and forecasts
- [ ] Customer references
- [ ] Market research and analysis

## Technology
- [ ] Technical architecture documentation
- [ ] Security and compliance certifications
- [ ] IP portfolio (patents, trademarks)
- [ ] Product demo environment
- [ ] Technical debt assessment

## HR & Operations
- [ ] Organization chart
- [ ] Employee roster with titles and salaries
- [ ] Employee retention metrics
- [ ] Insurance policies
- [ ] Compliance and regulatory filings`,
      exportable: true,
    });

    return artifacts;
  }

  private suggestNextAgent(response: string): string | undefined {
    if (response.toLowerCase().includes('launch') || response.toLowerCase().includes('market')) {
      return 'GTM Strategist';
    }

    if (response.toLowerCase().includes('cost') || response.toLowerCase().includes('operations')) {
      return 'Ops & Cost Analyst';
    }

    return undefined;
  }
}

