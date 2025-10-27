/**
 * StratOS Platform - Ops & Cost Analyst Agent
 * 
 * Specializes in operational efficiency, cost modeling, process optimization,
 * and vendor analysis.
 */

import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse, Artifact } from '../models';

export class OpsAnalystAgent extends BaseAgent {
  readonly name = 'Ops & Cost Analyst';
  readonly description = 'Analyzes operational efficiency, builds cost models, and optimizes processes';
  readonly systemPrompt = `You are an expert operations and cost analyst with deep experience in process optimization, cost modeling, and efficiency improvement.

Your responsibilities include:
- Comprehensive cost modeling and breakdown analysis
- Operational efficiency assessment and optimization
- Process mapping and bottleneck identification
- Vendor evaluation and comparison
- ROI calculation and financial impact analysis
- Implementation roadmap and change management

Output Format:
Structure your responses with these sections:
1. **Executive Summary**: Key findings and recommendations
2. **Cost Breakdown**: Detailed cost analysis by category
3. **Efficiency Metrics**: Current state vs. target state
4. **Process Analysis**: Workflows, bottlenecks, opportunities
5. **Optimization Recommendations**: Prioritized improvements with impact
6. **ROI Analysis**: Expected savings and payback period
7. **Implementation Plan**: Phased approach with quick wins

Always provide:
- Quantitative analysis with specific numbers
- Benchmark data when available
- Risk-adjusted projections
- Clear action items with ownership`;

  readonly capabilities = [
    'Cost modeling',
    'Process optimization',
    'Efficiency analysis',
    'Vendor comparison',
    'ROI calculation',
    'Resource planning',
  ];

  protected getIndustryModifier(industry: string): string {
    const modifiers: Record<string, string> = {
      fintech: `Industry: Fintech
- Focus on compliance and security costs
- Consider fraud prevention and risk management overhead
- Address scalability and transaction processing efficiency
- Include regulatory reporting and audit costs`,

      healthcare: `Industry: Healthcare
- Prioritize patient safety and quality metrics
- Address staffing costs and shift optimization
- Consider equipment utilization and maintenance
- Include compliance and accreditation costs`,

      saas: `Industry: SaaS
- Focus on infrastructure and cloud costs
- Address customer acquisition and support costs
- Consider churn and expansion revenue efficiency
- Include development and engineering productivity`,

      logistics: `Industry: Logistics
- Emphasize fuel costs and route optimization
- Address warehouse efficiency and inventory turnover
- Consider fleet maintenance and utilization
- Include labor costs and scheduling optimization`,

      manufacturing: `Industry: Manufacturing
- Focus on production efficiency and throughput
- Address material costs and supply chain optimization
- Consider equipment downtime and maintenance
- Include quality costs and defect rates`,
    };

    return modifiers[industry.toLowerCase()] || `Industry: ${industry}\n- Apply industry-standard benchmarks and metrics`;
  }

  protected parseResponse(response: string, context: AgentContext): AgentResponse {
    const artifacts = this.extractArtifacts(response);
    
    return {
      content: response,
      artifacts,
      suggestions: [
        'Deep dive into a specific cost category',
        'Conduct vendor comparison analysis',
        'Model different optimization scenarios',
        'Create implementation timeline',
      ],
      nextAgent: this.suggestNextAgent(response),
    };
  }

  protected extractArtifacts(response: string): Artifact[] {
    const artifacts: Artifact[] = [];
    const sections = this.extractSections(response);

    // Create cost breakdown artifact
    if (sections.has('Cost Breakdown') || sections.has('Cost Analysis')) {
      artifacts.push({
        type: 'chart',
        title: 'Cost Breakdown Analysis',
        data: {
          type: 'pie',
          data: [
            { category: 'Labor', value: 45, color: '#4CAF50' },
            { category: 'Infrastructure', value: 25, color: '#2196F3' },
            { category: 'Software/Tools', value: 15, color: '#FFC107' },
            { category: 'Marketing', value: 10, color: '#FF5722' },
            { category: 'Other', value: 5, color: '#9E9E9E' },
          ],
        },
        exportable: true,
      });

      artifacts.push({
        type: 'table',
        title: 'Detailed Cost Breakdown',
        data: {
          headers: ['Category', 'Current Annual Cost', 'Optimized Cost', 'Savings', 'Savings %'],
          rows: [
            ['Labor', '$500,000', '$475,000', '$25,000', '5%'],
            ['Infrastructure', '$280,000', '$210,000', '$70,000', '25%'],
            ['Software/Tools', '$150,000', '$135,000', '$15,000', '10%'],
            ['Marketing', '$120,000', '$110,000', '$10,000', '8%'],
            ['Total', '$1,050,000', '$930,000', '$120,000', '11%'],
          ],
        },
        exportable: true,
      });
    }

    // Create efficiency metrics artifact
    if (sections.has('Efficiency Metrics')) {
      artifacts.push({
        type: 'chart',
        title: 'Efficiency Improvement Opportunities',
        data: {
          type: 'bar',
          data: [
            { metric: 'Response Time', current: 85, target: 95, unit: 'score' },
            { metric: 'Resource Utilization', current: 70, target: 85, unit: '%' },
            { metric: 'Process Automation', current: 40, target: 75, unit: '%' },
            { metric: 'Error Rate', current: 5, target: 2, unit: '%' },
          ],
        },
        exportable: true,
      });
    }

    // Create ROI calculator
    artifacts.push({
      type: 'excel',
      title: 'ROI Calculator',
      data: {
        type: 'spreadsheet',
        sheets: [
          {
            name: 'ROI Analysis',
            data: [
              ['Metric', 'Year 1', 'Year 2', 'Year 3'],
              ['Investment', '$100,000', '$50,000', '$25,000'],
              ['Annual Savings', '$120,000', '$150,000', '$180,000'],
              ['Net Benefit', '$20,000', '$100,000', '$155,000'],
              ['ROI %', '20%', '100%', '155%'],
              ['Payback Period', '10 months', '-', '-'],
            ],
          },
        ],
      },
      exportable: true,
    });

    return artifacts;
  }

  private suggestNextAgent(response: string): string | undefined {
    if (response.toLowerCase().includes('funding') || response.toLowerCase().includes('capital')) {
      return 'Fundraising Advisor';
    }

    if (response.toLowerCase().includes('launch') || response.toLowerCase().includes('market')) {
      return 'GTM Strategist';
    }

    return undefined;
  }
}

