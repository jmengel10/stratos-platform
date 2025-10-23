/**
 * StratOS Platform - Azure OpenAI Service
 * 
 * Provides intelligent completions, embeddings, and streaming capabilities
 * using Azure OpenAI Service.
 */

import { OpenAIClient, AzureKeyCredential, ChatCompletions, ChatRequestMessage } from '@azure/openai';
import { Message } from '../models';

export interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  user?: string;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: any;
}

export interface ChatWithFunctionsResult {
  content?: string;
  functionCall?: {
    name: string;
    arguments: any;
  };
  tokensUsed: number;
}

export class OpenAIService {
  private client: OpenAIClient;
  private deploymentName: string;
  private embeddingDeployment: string;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    
    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI credentials not configured');
    }

    this.client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    this.embeddingDeployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-ada-002';
  }

  /**
   * Generate a chat completion
   * 
   * @param messages - Array of chat messages
   * @param options - Optional parameters for the completion
   * @returns The generated response content and metadata
   */
  async chat(messages: Message[], options: ChatOptions = {}): Promise<{ content: string; tokensUsed: number; model: string }> {
    try {
      const startTime = Date.now();

      // Convert messages to OpenAI format
      const chatMessages: ChatRequestMessage[] = messages.map(msg => ({
        role: msg.role as any,
        content: msg.content,
        name: msg.name,
      }));

      const response = await this.client.getChatCompletions(
        this.deploymentName,
        chatMessages,
        {
          maxTokens: options.maxTokens ?? parseInt(process.env.OPENAI_DEFAULT_MAX_TOKENS || '2000'),
          temperature: options.temperature ?? parseFloat(process.env.OPENAI_DEFAULT_TEMPERATURE || '0.7'),
          topP: options.topP ?? parseFloat(process.env.OPENAI_DEFAULT_TOP_P || '0.95'),
          frequencyPenalty: options.frequencyPenalty ?? parseFloat(process.env.OPENAI_DEFAULT_FREQUENCY_PENALTY || '0.0'),
          presencePenalty: options.presencePenalty ?? parseFloat(process.env.OPENAI_DEFAULT_PRESENCE_PENALTY || '0.0'),
          stop: options.stop,
          user: options.user,
        }
      );

      const duration = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.totalTokens || 0;

      console.log(`OpenAI completion: ${tokensUsed} tokens, ${duration}ms`);

      return {
        content,
        tokensUsed,
        model: response.model || this.deploymentName,
      };
    } catch (error: any) {
      console.error('OpenAI chat error:', error);
      
      // Handle rate limiting with specific error
      if (error.statusCode === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for text
   * 
   * @param text - Text to embed
   * @returns Embedding vector
   */
  async embed(text: string): Promise<number[]> {
    try {
      const response = await this.client.getEmbeddings(
        this.embeddingDeployment,
        [text]
      );

      return response.data[0].embedding;
    } catch (error: any) {
      console.error('OpenAI embedding error:', error);
      throw new Error(`OpenAI embedding error: ${error.message}`);
    }
  }

  /**
   * Stream a chat completion
   * 
   * @param messages - Array of chat messages
   * @param onChunk - Callback for each content chunk
   * @param options - Optional parameters
   */
  async streamChat(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options: ChatOptions = {}
  ): Promise<{ tokensUsed: number }> {
    try {
      const chatMessages: ChatRequestMessage[] = messages.map(msg => ({
        role: msg.role as any,
        content: msg.content,
        name: msg.name,
      }));

      const events = await this.client.streamChatCompletions(
        this.deploymentName,
        chatMessages,
        {
          maxTokens: options.maxTokens ?? parseInt(process.env.OPENAI_DEFAULT_MAX_TOKENS || '2000'),
          temperature: options.temperature ?? parseFloat(process.env.OPENAI_DEFAULT_TEMPERATURE || '0.7'),
          topP: options.topP ?? parseFloat(process.env.OPENAI_DEFAULT_TOP_P || '0.95'),
        }
      );

      let totalTokens = 0;

      for await (const event of events) {
        for (const choice of event.choices) {
          const delta = choice.delta?.content;
          if (delta) {
            onChunk(delta);
          }
        }

        if (event.usage) {
          totalTokens = event.usage.totalTokens || 0;
        }
      }

      return { tokensUsed: totalTokens };
    } catch (error: any) {
      console.error('OpenAI stream error:', error);
      throw new Error(`OpenAI streaming error: ${error.message}`);
    }
  }

  /**
   * Chat completion with function calling
   * 
   * @param messages - Array of chat messages
   * @param functions - Available functions
   * @param options - Optional parameters
   * @returns Content and/or function call
   */
  async chatWithFunctions(
    messages: Message[],
    functions: FunctionDefinition[],
    options: ChatOptions = {}
  ): Promise<ChatWithFunctionsResult> {
    try {
      const chatMessages: ChatRequestMessage[] = messages.map(msg => ({
        role: msg.role as any,
        content: msg.content,
        name: msg.name,
      }));

      const response = await this.client.getChatCompletions(
        this.deploymentName,
        chatMessages,
        {
          maxTokens: options.maxTokens ?? parseInt(process.env.OPENAI_DEFAULT_MAX_TOKENS || '2000'),
          temperature: options.temperature ?? parseFloat(process.env.OPENAI_DEFAULT_TEMPERATURE || '0.7'),
          functions: functions as any,
          functionCall: 'auto',
        }
      );

      const choice = response.choices[0];
      const message = choice?.message;

      const result: ChatWithFunctionsResult = {
        tokensUsed: response.usage?.totalTokens || 0,
      };

      if (message?.content) {
        result.content = message.content;
      }

      if (message?.functionCall) {
        result.functionCall = {
          name: message.functionCall.name,
          arguments: JSON.parse(message.functionCall.arguments || '{}'),
        };
      }

      return result;
    } catch (error: any) {
      console.error('OpenAI function calling error:', error);
      throw new Error(`OpenAI function calling error: ${error.message}`);
    }
  }

  /**
   * Batch embeddings generation
   * 
   * @param texts - Array of texts to embed
   * @returns Array of embedding vectors
   */
  async batchEmbed(texts: string[]): Promise<number[][]> {
    try {
      // OpenAI allows up to 16 texts per request
      const batchSize = 16;
      const results: number[][] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const response = await this.client.getEmbeddings(
          this.embeddingDeployment,
          batch
        );

        results.push(...response.data.map(d => d.embedding));
      }

      return results;
    } catch (error: any) {
      console.error('OpenAI batch embedding error:', error);
      throw new Error(`OpenAI batch embedding error: ${error.message}`);
    }
  }

  /**
   * Retry with exponential backoff
   * 
   * @param fn - Function to retry
   * @param maxRetries - Maximum number of retries
   * @returns Result of the function
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Only retry on rate limit or server errors
        if (error.statusCode === 429 || error.statusCode >= 500) {
          const delay = Math.min(1000 * Math.pow(2, i), 10000);
          console.log(`Retrying after ${delay}ms (attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }
}

