/**
 * Client Service
 * Manages client CRUD operations
 */

import { v4 as uuidv4 } from 'uuid';
import { CosmosService } from './cosmos.service';
import { Client, CreateClientInput, UpdateClientInput, ClientFilters } from '../models/client.model';
import { NotFoundError, ValidationError } from '../models';

export class ClientService {
  private cosmos: CosmosService;

  constructor() {
    this.cosmos = new CosmosService();
  }

  /**
   * Create a new client
   */
  async createClient(
    data: CreateClientInput,
    userId: string,
    tenantId: string
  ): Promise<Client> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Client name is required');
    }

    if (!data.industry) {
      throw new ValidationError('Client industry is required');
    }

    const client: Client = {
      id: uuidv4(),
      tenantId,
      name: data.name.trim(),
      industry: data.industry,
      description: data.description || '',
      logoUrl: data.logoUrl,
      status: 'active',
      metadata: data.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    };

    await this.cosmos.createDocument('clients', client);
    return client;
  }

  /**
   * Get all clients for a tenant
   */
  async getClients(
    tenantId: string,
    filters?: ClientFilters
  ): Promise<Client[]> {
    const query = {
      query: 'SELECT * FROM c WHERE c.tenantId = @tenantId AND c.status != @archived',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@archived', value: 'archived' },
      ],
    };

    // Add filters
    if (filters?.industry) {
      query.query += ' AND c.industry = @industry';
      query.parameters.push({ name: '@industry', value: filters.industry });
    }

    if (filters?.status) {
      query.query += ' AND c.status = @status';
      query.parameters.push({ name: '@status', value: filters.status });
    }

    if (filters?.search) {
      query.query += ' AND CONTAINS(LOWER(c.name), LOWER(@search))';
      query.parameters.push({ name: '@search', value: filters.search });
    }

    query.query += ' ORDER BY c.updatedAt DESC';

    const result = await this.cosmos.queryDocuments('clients', query);
    return result.resources as Client[];
  }

  /**
   * Get a single client
   */
  async getClient(id: string, tenantId: string): Promise<Client> {
    const client = await this.cosmos.getDocument<Client>('clients', { id, tenantId });
    
    if (!client) {
      throw new NotFoundError(`Client not found: ${id}`);
    }

    return client;
  }

  /**
   * Update a client
   */
  async updateClient(
    id: string,
    updates: UpdateClientInput,
    tenantId: string
  ): Promise<Client> {
    const existingClient = await this.getClient(id, tenantId);

    const updatedClient: Client = {
      ...existingClient,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.cosmos.updateDocument('clients', { id, tenantId }, updatedClient);
    return updatedClient;
  }

  /**
   * Delete a client (soft delete - set status to archived)
   */
  async deleteClient(id: string, tenantId: string): Promise<void> {
    await this.updateClient(id, { status: 'archived' }, tenantId);
  }

  /**
   * Get client statistics
   */
  async getClientStats(clientId: string, tenantId: string): Promise<{
    projectCount: number;
    conversationCount: number;
    lastActivity: string;
  }> {
    // Get project count
    const projectQuery = {
      query: 'SELECT VALUE COUNT(1) FROM c WHERE c.tenantId = @tenantId AND c.clientId = @clientId AND c.status != @archived',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@clientId', value: clientId },
        { name: '@archived', value: 'archived' },
      ],
    };

    const projectResult = await this.cosmos.queryDocuments('projects', projectQuery);
    const projectCount = projectResult.resources[0] || 0;

    // Get conversation count
    const convQuery = {
      query: 'SELECT VALUE COUNT(1) FROM c WHERE c.tenantId = @tenantId AND c.clientId = @clientId',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@clientId', value: clientId },
      ],
    };

    const convResult = await this.cosmos.queryDocuments('conversations', convQuery);
    const conversationCount = convResult.resources[0] || 0;

    // Get last activity
    const activityQuery = {
      query: 'SELECT TOP 1 c.lastMessageAt FROM c WHERE c.tenantId = @tenantId AND c.clientId = @clientId ORDER BY c.lastMessageAt DESC',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@clientId', value: clientId },
      ],
    };

    const activityResult = await this.cosmos.queryDocuments('conversations', activityQuery);
    const lastActivity = activityResult.resources[0]?.lastMessageAt || new Date().toISOString();

    return {
      projectCount,
      conversationCount,
      lastActivity,
    };
  }
}

