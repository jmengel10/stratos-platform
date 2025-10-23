/**
 * StratOS Platform - Azure Cognitive Search Service
 * 
 * Provides hybrid search capabilities combining vector similarity
 * and keyword search for intelligent document retrieval.
 */

import {
  SearchClient,
  SearchIndexClient,
  AzureKeyCredential,
  SearchOptions,
} from '@azure/search-documents';
import { OpenAIService } from './openai.service';
import { SearchResult } from '../models';

export interface SearchFilters {
  tenantId?: string;
  industry?: string;
  documentType?: string;
  tags?: string[];
}

export interface HybridSearchOptions {
  query: string;
  filters?: SearchFilters;
  top?: number;
  useVector?: boolean;
  skip?: number;
}

export class SearchService {
  private searchClient: SearchClient<any>;
  private indexClient: SearchIndexClient;
  private openaiService: OpenAIService;
  private indexName: string;

  constructor(indexName: string = 'documents') {
    const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
    const apiKey = process.env.AZURE_SEARCH_KEY;

    if (!endpoint || !apiKey) {
      throw new Error('Azure Search credentials not configured');
    }

    const credential = new AzureKeyCredential(apiKey);
    this.searchClient = new SearchClient(endpoint, indexName, credential);
    this.indexClient = new SearchIndexClient(endpoint, credential);
    this.openaiService = new OpenAIService();
    this.indexName = indexName;
  }

  /**
   * Perform hybrid search (keyword + vector)
   * 
   * @param options - Search options
   * @returns Search results with scores
   */
  async search(options: HybridSearchOptions): Promise<SearchResult[]> {
    try {
      const { query, filters, top = 10, useVector = true, skip = 0 } = options;

      // Build filter expression
      const filterExpression = this.buildFilterExpression(filters);

      // Perform keyword search
      const searchOptions: SearchOptions<any> = {
        top,
        skip,
        filter: filterExpression,
        includeTotalCount: true,
        highlightFields: ['content', 'title'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        queryType: 'semantic',
        semanticSearchOptions: {
          configurationName: 'default',
          answers: {
            answerType: 'extractive',
            count: 3,
          },
        },
      };

      const searchResults = await this.searchClient.search(query, searchOptions);

      const results: SearchResult[] = [];

      for await (const result of searchResults.results) {
        results.push({
          document: result.document,
          score: result.score || 0,
          highlights: this.extractHighlights(result),
        });
      }

      // If vector search is enabled, perform it and merge results
      if (useVector && query) {
        const vectorResults = await this.vectorSearch(query, {
          filters,
          top,
        });

        // Merge and re-rank results (simple weighted combination)
        const mergedResults = this.mergeSearchResults(results, vectorResults);
        return mergedResults.slice(0, top);
      }

      return results;
    } catch (error: any) {
      console.error('Search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Perform pure vector similarity search
   * 
   * @param query - Search query
   * @param options - Search options
   * @returns Search results with similarity scores
   */
  async vectorSearch(
    query: string,
    options: { filters?: SearchFilters; top?: number } = {}
  ): Promise<SearchResult[]> {
    try {
      const { filters, top = 10 } = options;

      // Generate query embedding
      const queryVector = await this.openaiService.embed(query);

      // Build filter expression
      const filterExpression = this.buildFilterExpression(filters);

      // Perform vector search
      const searchOptions: SearchOptions<any> = {
        vectorSearchOptions: {
          queries: [
            {
              kind: 'vector',
              vector: queryVector,
              fields: ['embedding'],
              kNearestNeighborsCount: top,
            },
          ],
        },
        filter: filterExpression,
        top,
      };

      const searchResults = await this.searchClient.search('*', searchOptions);

      const results: SearchResult[] = [];

      for await (const result of searchResults.results) {
        results.push({
          document: result.document,
          score: result.score || 0,
          highlights: [],
        });
      }

      return results;
    } catch (error: any) {
      console.error('Vector search error:', error);
      throw new Error(`Vector search failed: ${error.message}`);
    }
  }

  /**
   * Index a document
   * 
   * @param document - Document to index
   * @returns Indexed document ID
   */
  async indexDocument(document: {
    id?: string;
    tenantId: string;
    title?: string;
    content: string;
    embedding?: number[];
    tags?: string[];
    industry?: string;
    documentType?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    try {
      // Generate ID if not provided
      const id = document.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Generate embedding if not provided
      let embedding = document.embedding;
      if (!embedding && document.content) {
        // Use first 8000 characters for embedding (token limit)
        const contentForEmbedding = document.content.substring(0, 8000);
        embedding = await this.openaiService.embed(contentForEmbedding);
      }

      // Prepare document for indexing
      const indexDoc = {
        ...document,
        id,
        embedding,
        searchContent: document.content,
        lastIndexedAt: new Date().toISOString(),
      };

      // Upload to search index
      await this.searchClient.uploadDocuments([indexDoc]);

      console.log(`Indexed document: ${id}`);
      return id;
    } catch (error: any) {
      console.error('Index document error:', error);
      throw new Error(`Failed to index document: ${error.message}`);
    }
  }

  /**
   * Delete a document from the index
   * 
   * @param documentId - ID of document to delete
   * @returns Success boolean
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      await this.searchClient.deleteDocuments([{ id: documentId }]);
      console.log(`Deleted document from index: ${documentId}`);
      return true;
    } catch (error: any) {
      console.error('Delete document error:', error);
      return false;
    }
  }

  /**
   * Batch index multiple documents
   * 
   * @param documents - Array of documents to index
   * @returns Array of indexed document IDs
   */
  async batchIndexDocuments(
    documents: Array<{
      id?: string;
      tenantId: string;
      title?: string;
      content: string;
      embedding?: number[];
      tags?: string[];
      industry?: string;
      documentType?: string;
    }>
  ): Promise<string[]> {
    try {
      // Generate embeddings for documents that don't have them
      const documentsWithEmbeddings = await Promise.all(
        documents.map(async (doc) => {
          let embedding = doc.embedding;
          if (!embedding && doc.content) {
            const contentForEmbedding = doc.content.substring(0, 8000);
            embedding = await this.openaiService.embed(contentForEmbedding);
          }

          const id = doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          return {
            ...doc,
            id,
            embedding,
            searchContent: doc.content,
            lastIndexedAt: new Date().toISOString(),
          };
        })
      );

      // Batch upload (Search supports up to 1000 docs per batch)
      const batchSize = 100;
      const ids: string[] = [];

      for (let i = 0; i < documentsWithEmbeddings.length; i += batchSize) {
        const batch = documentsWithEmbeddings.slice(i, i + batchSize);
        await this.searchClient.uploadDocuments(batch);
        ids.push(...batch.map(d => d.id));
      }

      console.log(`Batch indexed ${ids.length} documents`);
      return ids;
    } catch (error: any) {
      console.error('Batch index error:', error);
      throw new Error(`Failed to batch index documents: ${error.message}`);
    }
  }

  /**
   * Get document count in index
   * 
   * @param filters - Optional filters
   * @returns Document count
   */
  async getDocumentsCount(filters?: SearchFilters): Promise<number> {
    try {
      const filterExpression = this.buildFilterExpression(filters);

      const searchResults = await this.searchClient.search('*', {
        top: 0,
        filter: filterExpression,
        includeTotalCount: true,
      });

      return searchResults.count || 0;
    } catch (error: any) {
      console.error('Get count error:', error);
      return 0;
    }
  }

  /**
   * Build OData filter expression from filters
   * 
   * @param filters - Search filters
   * @returns OData filter string
   */
  private buildFilterExpression(filters?: SearchFilters): string | undefined {
    if (!filters) return undefined;

    const conditions: string[] = [];

    if (filters.tenantId) {
      conditions.push(`tenantId eq '${filters.tenantId}'`);
    }

    if (filters.industry) {
      conditions.push(`industry eq '${filters.industry}'`);
    }

    if (filters.documentType) {
      conditions.push(`documentType eq '${filters.documentType}'`);
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map(tag => `tags/any(t: t eq '${tag}')`);
      conditions.push(`(${tagConditions.join(' or ')})`);
    }

    return conditions.length > 0 ? conditions.join(' and ') : undefined;
  }

  /**
   * Extract highlights from search result
   * 
   * @param result - Search result
   * @returns Array of highlight strings
   */
  private extractHighlights(result: any): string[] {
    const highlights: string[] = [];

    if (result.highlights) {
      Object.values(result.highlights).forEach((fieldHighlights: any) => {
        if (Array.isArray(fieldHighlights)) {
          highlights.push(...fieldHighlights);
        }
      });
    }

    return highlights;
  }

  /**
   * Merge keyword and vector search results
   * 
   * @param keywordResults - Results from keyword search
   * @param vectorResults - Results from vector search
   * @returns Merged and re-ranked results
   */
  private mergeSearchResults(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    // Create a map to combine scores
    const scoreMap = new Map<string, SearchResult>();

    // Weight: 60% keyword, 40% vector
    const keywordWeight = 0.6;
    const vectorWeight = 0.4;

    // Add keyword results
    keywordResults.forEach(result => {
      const id = result.document.id;
      scoreMap.set(id, {
        ...result,
        score: result.score * keywordWeight,
      });
    });

    // Add/merge vector results
    vectorResults.forEach(result => {
      const id = result.document.id;
      const existing = scoreMap.get(id);

      if (existing) {
        // Document found in both - combine scores
        existing.score += result.score * vectorWeight;
      } else {
        // New document from vector search
        scoreMap.set(id, {
          ...result,
          score: result.score * vectorWeight,
        });
      }
    });

    // Convert to array and sort by combined score
    return Array.from(scoreMap.values()).sort((a, b) => b.score - a.score);
  }
}

