/**
 * StratOS Platform - Cosmos DB Service
 * 
 * Enterprise-grade NoSQL database operations with automatic partitioning,
 * pagination, and comprehensive error handling.
 */

import { CosmosClient, Container, Database, SqlQuerySpec } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';

export interface QueryOptions {
  limit?: number;
  continuationToken?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface QueryResult<T> {
  items: T[];
  continuationToken?: string;
  hasMore: boolean;
  count: number;
}

export class CosmosService {
  private client: CosmosClient;
  private database: Database;
  private databaseName: string;

  constructor() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    this.databaseName = process.env.COSMOS_DB_DATABASE_NAME || 'stratos';

    if (!endpoint || !key) {
      throw new Error('Cosmos DB credentials not configured');
    }

    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(this.databaseName);
  }

  /**
   * Get container reference
   * 
   * @param containerName - Name of the container
   * @returns Container reference
   */
  getContainer(containerName: string): Container {
    return this.database.container(containerName);
  }

  /**
   * Create a new document
   * 
   * @param containerName - Container to create document in
   * @param document - Document to create
   * @returns Created document
   */
  async createDocument<T extends { id?: string; tenantId: string }>(
    containerName: string,
    document: T
  ): Promise<T> {
    try {
      const container = this.getContainer(containerName);

      // Auto-generate ID if not provided
      if (!document.id) {
        document.id = uuidv4();
      }

      // Add timestamps
      const now = new Date().toISOString();
      const docWithMetadata = {
        ...document,
        createdAt: now,
        updatedAt: now,
      };

      // Ensure tenantId is present for partition key
      if (!docWithMetadata.tenantId) {
        throw new Error('tenantId is required for all documents');
      }

      const { resource } = await container.items.create(docWithMetadata);
      return resource as T;
    } catch (error: any) {
      console.error(`Cosmos create error (${containerName}):`, error);
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  /**
   * Get a document by ID
   * 
   * @param containerName - Container name
   * @param id - Document ID
   * @param tenantId - Partition key value
   * @returns Document or null if not found
   */
  async getDocument<T>(
    containerName: string,
    id: string,
    tenantId: string
  ): Promise<T | null> {
    try {
      const container = this.getContainer(containerName);

      const { resource } = await container.item(id, tenantId).read<T>();
      return resource || null;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      console.error(`Cosmos read error (${containerName}):`, error);
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  /**
   * Query documents with pagination
   * 
   * @param containerName - Container name
   * @param querySpec - SQL query specification
   * @param tenantId - Optional tenant filter
   * @param options - Query options
   * @returns Query results with pagination
   */
  async queryDocuments<T>(
    containerName: string,
    querySpec: SqlQuerySpec | string,
    tenantId?: string,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    try {
      const container = this.getContainer(containerName);

      // Convert string queries to QuerySpec
      let query: SqlQuerySpec;
      if (typeof querySpec === 'string') {
        query = { query: querySpec };
      } else {
        query = querySpec;
      }

      // Auto-add tenantId filter if provided
      if (tenantId && !query.query.toLowerCase().includes('tenantid')) {
        const hasWhere = query.query.toLowerCase().includes('where');
        const connector = hasWhere ? ' AND' : ' WHERE';
        query.query += `${connector} c.tenantId = @tenantId`;
        query.parameters = [
          ...(query.parameters || []),
          { name: '@tenantId', value: tenantId },
        ];
      }

      // Build query iterator
      const queryIterator = container.items.query<T>(query, {
        maxItemCount: options.limit || 50,
        continuationToken: options.continuationToken,
      });

      const response = await queryIterator.fetchNext();

      return {
        items: response.resources,
        continuationToken: response.continuationToken,
        hasMore: !!response.continuationToken,
        count: response.resources.length,
      };
    } catch (error: any) {
      console.error(`Cosmos query error (${containerName}):`, error);
      throw new Error(`Failed to query documents: ${error.message}`);
    }
  }

  /**
   * Update a document
   * 
   * @param containerName - Container name
   * @param document - Document to update (must include id and tenantId)
   * @returns Updated document
   */
  async updateDocument<T extends { id: string; tenantId: string }>(
    containerName: string,
    document: T
  ): Promise<T> {
    try {
      const container = this.getContainer(containerName);

      // Update timestamp
      const docWithMetadata = {
        ...document,
        updatedAt: new Date().toISOString(),
      };

      const { resource } = await container
        .item(document.id, document.tenantId)
        .replace(docWithMetadata);

      return resource as T;
    } catch (error: any) {
      console.error(`Cosmos update error (${containerName}):`, error);
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  /**
   * Delete a document
   * 
   * @param containerName - Container name
   * @param id - Document ID
   * @param tenantId - Partition key value
   * @returns Success boolean
   */
  async deleteDocument(
    containerName: string,
    id: string,
    tenantId: string
  ): Promise<boolean> {
    try {
      const container = this.getContainer(containerName);

      await container.item(id, tenantId).delete();
      return true;
    } catch (error: any) {
      if (error.code === 404) {
        return false;
      }
      console.error(`Cosmos delete error (${containerName}):`, error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Upsert a document (create or update)
   * 
   * @param containerName - Container name
   * @param document - Document to upsert
   * @returns Upserted document
   */
  async upsertDocument<T extends { id?: string; tenantId: string }>(
    containerName: string,
    document: T
  ): Promise<T> {
    try {
      const container = this.getContainer(containerName);

      // Auto-generate ID if not provided
      if (!document.id) {
        document.id = uuidv4();
      }

      const now = new Date().toISOString();
      const existingDoc = document.id
        ? await this.getDocument(containerName, document.id, document.tenantId)
        : null;

      const docWithMetadata = {
        ...document,
        createdAt: existingDoc ? (existingDoc as any).createdAt : now,
        updatedAt: now,
      };

      const { resource } = await container.items.upsert(docWithMetadata);
      return resource as T;
    } catch (error: any) {
      console.error(`Cosmos upsert error (${containerName}):`, error);
      throw new Error(`Failed to upsert document: ${error.message}`);
    }
  }

  /**
   * Batch query all documents (handles pagination automatically)
   * 
   * @param containerName - Container name
   * @param querySpec - SQL query
   * @param tenantId - Optional tenant filter
   * @returns All matching documents
   */
  async queryAll<T>(
    containerName: string,
    querySpec: SqlQuerySpec | string,
    tenantId?: string
  ): Promise<T[]> {
    const allItems: T[] = [];
    let continuationToken: string | undefined;

    do {
      const result = await this.queryDocuments<T>(
        containerName,
        querySpec,
        tenantId,
        { continuationToken }
      );

      allItems.push(...result.items);
      continuationToken = result.continuationToken;
    } while (continuationToken);

    return allItems;
  }

  /**
   * Count documents matching a query
   * 
   * @param containerName - Container name
   * @param querySpec - SQL query
   * @param tenantId - Optional tenant filter
   * @returns Count of matching documents
   */
  async countDocuments(
    containerName: string,
    querySpec: SqlQuerySpec | string,
    tenantId?: string
  ): Promise<number> {
    try {
      const container = this.getContainer(containerName);

      let query: SqlQuerySpec;
      if (typeof querySpec === 'string') {
        // Convert to count query
        const countQuery = querySpec.replace(/SELECT.*FROM/i, 'SELECT VALUE COUNT(1) FROM');
        query = { query: countQuery };
      } else {
        const countQuery = querySpec.query.replace(/SELECT.*FROM/i, 'SELECT VALUE COUNT(1) FROM');
        query = { ...querySpec, query: countQuery };
      }

      // Add tenantId filter
      if (tenantId && !query.query.toLowerCase().includes('tenantid')) {
        const hasWhere = query.query.toLowerCase().includes('where');
        const connector = hasWhere ? ' AND' : ' WHERE';
        query.query += `${connector} c.tenantId = @tenantId`;
        query.parameters = [
          ...(query.parameters || []),
          { name: '@tenantId', value: tenantId },
        ];
      }

      const { resources } = await container.items.query(query).fetchAll();
      return resources[0] || 0;
    } catch (error: any) {
      console.error(`Cosmos count error (${containerName}):`, error);
      throw new Error(`Failed to count documents: ${error.message}`);
    }
  }

  /**
   * Get documents by IDs (batch read)
   * 
   * @param containerName - Container name
   * @param ids - Array of document IDs
   * @param tenantId - Partition key value
   * @returns Array of documents (nulls for not found)
   */
  async getDocumentsByIds<T>(
    containerName: string,
    ids: string[],
    tenantId: string
  ): Promise<(T | null)[]> {
    const promises = ids.map(id => this.getDocument<T>(containerName, id, tenantId));
    return Promise.all(promises);
  }

  /**
   * Patch a document (partial update)
   * 
   * @param containerName - Container name
   * @param id - Document ID
   * @param tenantId - Partition key value
   * @param patch - Fields to update
   * @returns Updated document
   */
  async patchDocument<T>(
    containerName: string,
    id: string,
    tenantId: string,
    patch: Partial<T>
  ): Promise<T> {
    try {
      const existing = await this.getDocument<T>(containerName, id, tenantId);
      if (!existing) {
        throw new Error(`Document not found: ${id}`);
      }

      const updated = {
        ...existing,
        ...patch,
        id, // Ensure ID doesn't change
        tenantId, // Ensure tenantId doesn't change
        updatedAt: new Date().toISOString(),
      };

      return await this.updateDocument(containerName, updated as any);
    } catch (error: any) {
      console.error(`Cosmos patch error (${containerName}):`, error);
      throw new Error(`Failed to patch document: ${error.message}`);
    }
  }
}

