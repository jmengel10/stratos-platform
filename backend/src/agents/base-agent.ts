/**
 * StratOS Platform - Base Agent Architecture
 * 
 * Abstract base class for all AI agents with standardized execution flow,
 * RAG integration, conversation management, and telemetry.
 */

import { OpenAIService } from '../services/openai.service';
import { CosmosService } from '../services/cosmos.service';
import { SearchService } from '../services/search.service';
import { insights } from '../services/insights.service';
import { AgentContext, AgentResponse, Artifact, Message, Conversation } from '../models';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseAgent {
  // Agent identification
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly systemPrompt: string;
  abstract readonly capabilities: string[];

  // Services
  protected openai: OpenAIService;
  protected cosmos: CosmosService;
  protected search: SearchService;

  constructor() {
    this.openai = new OpenAIService();
    this.cosmos = new CosmosService();
    this.search = new SearchService();
  }

  /**
   * Main execution method - orchestrates the entire agent workflow
   * 
   * @param userMessage - User's input message
   * @param context - Agent execution context
   * @returns Agent response with content and artifacts
   */
  async execute(userMessage: string, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    const operation = insights.startOperation(`Agent.${this.name}.Execute`, {
      agentName: this.name,
      tenantId: context.tenantId,
      userId: context.userId,
    });

    try {
      // Step 1: Retrieve relevant context via RAG
      const ragDocuments = await this.retrieveRAGContext(userMessage, context);

      // Step 2: Build the complete system prompt
      const systemPrompt = this.buildSystemPrompt(context);

      // Step 3: Augment user message with RAG context
      const augmentedMessage = this.augmentUserMessage(userMessage, ragDocuments, context);

      // Step 4: Format conversation history
      const messages = this.formatConversationHistory(
        systemPrompt,
        augmentedMessage,
        context.conversationHistory
      );

      // Step 5: Call OpenAI for completion
      const completion = await this.openai.chat(messages, {
        temperature: 0.7,
        maxTokens: 2000,
      });

      // Step 6: Parse the response and extract artifacts
      const response = this.parseResponse(completion.content, context);

      // Step 7: Save conversation to database
      await this.saveConversation(context, userMessage, response, completion);

      // Step 8: Track metrics
      const duration = Date.now() - startTime;
      insights.trackAgentExecution(
        this.name,
        duration,
        completion.tokensUsed,
        true,
        {
          industry: context.industry || 'none',
          hasArtifacts: (response.artifacts?.length || 0) > 0,
        }
      );

      operation.end(true);

      return {
        ...response,
        metadata: {
          tokensUsed: completion.tokensUsed,
          duration,
          model: completion.model,
        },
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      insights.trackException(error, {
        agentName: this.name,
        tenantId: context.tenantId,
        userId: context.userId,
      });

      insights.trackAgentExecution(this.name, duration, 0, false);
      operation.end(false);

      throw error;
    }
  }

  /**
   * Retrieve relevant documents via RAG
   * 
   * @param query - User query
   * @param context - Agent context
   * @returns Array of relevant documents
   */
  protected async retrieveRAGContext(
    query: string,
    context: AgentContext
  ): Promise<any[]> {
    try {
      const searchResults = await this.search.search({
        query,
        filters: {
          tenantId: context.tenantId,
          industry: context.industry,
        },
        top: 5,
        useVector: true,
      });

      return searchResults.map(r => r.document);
    } catch (error) {
      console.error('RAG retrieval error:', error);
      return []; // Continue without RAG if it fails
    }
  }

  /**
   * Build the complete system prompt
   * 
   * @param context - Agent context
   * @returns System prompt string
   */
  protected buildSystemPrompt(context: AgentContext): string {
    let prompt = this.systemPrompt;

    // Add industry-specific modifier
    if (context.industry) {
      const industryModifier = this.getIndustryModifier(context.industry);
      prompt += `\n\n${industryModifier}`;
    }

    // Add custom prompts if provided
    if (context.customPrompts?.[this.name]) {
      prompt += `\n\n${context.customPrompts[this.name]}`;
    }

    // Add previous context for chaining
    if (context.previousContext) {
      prompt += `\n\nPrevious conversation context:\n${JSON.stringify(context.previousContext, null, 2)}`;
    }

    return prompt;
  }

  /**
   * Augment user message with RAG documents
   * 
   * @param message - Original user message
   * @param ragDocs - Retrieved documents
   * @param context - Agent context
   * @returns Augmented message
   */
  protected augmentUserMessage(
    message: string,
    ragDocs: any[],
    context: AgentContext
  ): string {
    if (ragDocs.length === 0) {
      return message;
    }

    const contextDocs = ragDocs
      .map((doc, idx) => {
        return `[Document ${idx + 1}]\nTitle: ${doc.title || 'Untitled'}\nContent: ${doc.content?.substring(0, 500)}...\n`;
      })
      .join('\n');

    return `Context from your knowledge base:\n${contextDocs}\n\nUser Question:\n${message}`;
  }

  /**
   * Format conversation history for API
   * 
   * @param systemPrompt - System prompt
   * @param userMessage - Current user message
   * @param history - Previous messages
   * @returns Formatted messages array
   */
  protected formatConversationHistory(
    systemPrompt: string,
    userMessage: string,
    history?: Message[]
  ): Message[] {
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history (last 10 messages to stay within token limits)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-10);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    return messages;
  }

  /**
   * Save conversation to database
   * 
   * @param context - Agent context
   * @param userMessage - User message
   * @param response - Agent response
   * @param completion - OpenAI completion metadata
   */
  protected async saveConversation(
    context: AgentContext,
    userMessage: string,
    response: AgentResponse,
    completion: { tokensUsed: number; model: string }
  ): Promise<void> {
    try {
      const conversationId = uuidv4();

      // Save to conversations container
      const conversation: Partial<Conversation> = {
        id: conversationId,
        tenantId: context.tenantId,
        userId: context.userId,
        agentName: this.name,
        title: userMessage.substring(0, 100),
        messages: [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: response.content },
        ],
        context: {
          industry: context.industry,
          previousAgents: context.previousContext?.previousAgents,
        },
        lastMessageAt: new Date().toISOString(),
      };

      await this.cosmos.createDocument('conversations', conversation);

      // Save output artifact
      const output = {
        id: uuidv4(),
        tenantId: context.tenantId,
        userId: context.userId,
        conversationId,
        agentName: this.name,
        content: response.content,
        artifacts: response.artifacts || [],
        suggestions: response.suggestions,
        nextAgent: response.nextAgent,
        metadata: {
          tokensUsed: completion.tokensUsed,
          model: completion.model,
        },
      };

      await this.cosmos.createDocument('outputs', output);
    } catch (error) {
      console.error('Failed to save conversation:', error);
      // Don't throw - this shouldn't break the user experience
    }
  }

  // ============================================
  // Abstract methods to be implemented by subclasses
  // ============================================

  /**
   * Get industry-specific prompt modifier
   * 
   * @param industry - Industry name
   * @returns Industry-specific guidance
   */
  protected abstract getIndustryModifier(industry: string): string;

  /**
   * Parse the AI response and structure it
   * 
   * @param response - Raw AI response
   * @param context - Agent context
   * @returns Structured agent response
   */
  protected abstract parseResponse(response: string, context: AgentContext): AgentResponse;

  /**
   * Extract artifacts from the response
   * 
   * @param response - Raw AI response
   * @returns Array of artifacts
   */
  protected abstract extractArtifacts(response: string): Artifact[];

  // ============================================
  // Helper methods
  // ============================================

  /**
   * Extract sections from markdown-like response
   * 
   * @param response - Response text
   * @returns Map of section titles to content
   */
  protected extractSections(response: string): Map<string, string> {
    const sections = new Map<string, string>();
    const lines = response.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      // Check for section header (##, ###, or **Section:**)
      const headerMatch = line.match(/^#{2,3}\s+(.+)|^\*\*(.+):\*\*/);
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections.set(currentSection, currentContent.join('\n').trim());
        }

        // Start new section
        currentSection = (headerMatch[1] || headerMatch[2]).trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      sections.set(currentSection, currentContent.join('\n').trim());
    }

    return sections;
  }

  /**
   * Extract tables from response
   * 
   * @param response - Response text
   * @returns Array of table data
   */
  protected extractTables(response: string): any[] {
    const tables: any[] = [];
    const lines = response.split('\n');
    let inTable = false;
    let currentTable: string[] = [];

    for (const line of lines) {
      if (line.trim().startsWith('|')) {
        inTable = true;
        currentTable.push(line);
      } else if (inTable) {
        // End of table
        if (currentTable.length > 0) {
          tables.push(this.parseMarkdownTable(currentTable));
          currentTable = [];
        }
        inTable = false;
      }
    }

    // Save last table
    if (currentTable.length > 0) {
      tables.push(this.parseMarkdownTable(currentTable));
    }

    return tables;
  }

  /**
   * Parse markdown table to structured data
   * 
   * @param tableLines - Array of table row strings
   * @returns Parsed table object
   */
  private parseMarkdownTable(tableLines: string[]): any {
    if (tableLines.length < 2) return null;

    // Parse header
    const headers = tableLines[0]
      .split('|')
      .map(h => h.trim())
      .filter(h => h);

    // Skip separator line (---|----|----)
    const dataLines = tableLines.slice(2);

    // Parse rows
    const rows = dataLines.map(line => {
      const cells = line
        .split('|')
        .map(c => c.trim())
        .filter(c => c);

      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = cells[idx] || '';
      });

      return row;
    });

    return {
      headers,
      rows,
    };
  }

  /**
   * Create suggestions for next steps
   * 
   * @param response - Agent response
   * @returns Array of suggestion strings
   */
  protected generateSuggestions(response: string): string[] {
    const suggestions: string[] = [
      'Refine this analysis with more specific data',
      'Export this as a document',
      'Schedule a follow-up discussion',
    ];

    // Add agent-specific suggestions based on content
    if (response.toLowerCase().includes('framework')) {
      suggestions.push('Customize this framework for your use case');
    }

    if (response.toLowerCase().includes('cost') || response.toLowerCase().includes('budget')) {
      suggestions.push('Create a detailed budget breakdown');
    }

    return suggestions.slice(0, 3);
  }
}

