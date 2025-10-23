/**
 * Project Service
 * Manages project CRUD operations
 */

import { v4 as uuidv4 } from 'uuid';
import { CosmosService } from './cosmos.service';
import { Project, CreateProjectInput, UpdateProjectInput, ProjectFilters } from '../models/project.model';
import { NotFoundError, ValidationError } from '../models';

export class ProjectService {
  private cosmos: CosmosService;

  constructor() {
    this.cosmos = new CosmosService();
  }

  /**
   * Create a new project
   */
  async createProject(
    data: CreateProjectInput,
    userId: string,
    tenantId: string
  ): Promise<Project> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Project name is required');
    }

    if (!data.clientId) {
      throw new ValidationError('Client ID is required');
    }

    if (!data.type) {
      throw new ValidationError('Project type is required');
    }

    // Verify client exists
    const client = await this.cosmos.getDocument('clients', {
      id: data.clientId,
      tenantId,
    });

    if (!client) {
      throw new NotFoundError(`Client not found: ${data.clientId}`);
    }

    const project: Project = {
      id: uuidv4(),
      clientId: data.clientId,
      tenantId,
      name: data.name.trim(),
      description: data.description || '',
      type: data.type,
      status: 'active',
      startDate: data.startDate || new Date().toISOString(),
      dueDate: data.dueDate,
      tags: data.tags || [],
      metadata: data.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    };

    await this.cosmos.createDocument('projects', project);
    return project;
  }

  /**
   * Get all projects for a tenant, optionally filtered by client
   */
  async getProjects(
    tenantId: string,
    filters?: ProjectFilters
  ): Promise<Project[]> {
    const query = {
      query: 'SELECT * FROM c WHERE c.tenantId = @tenantId AND c.status != @archived',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@archived', value: 'archived' },
      ],
    };

    // Add filters
    if (filters?.clientId) {
      query.query += ' AND c.clientId = @clientId';
      query.parameters.push({ name: '@clientId', value: filters.clientId });
    }

    if (filters?.type) {
      query.query += ' AND c.type = @type';
      query.parameters.push({ name: '@type', value: filters.type });
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

    const result = await this.cosmos.queryDocuments('projects', query);
    return result.resources as Project[];
  }

  /**
   * Get projects by client
   */
  async getProjectsByClient(clientId: string, tenantId: string): Promise<Project[]> {
    return this.getProjects(tenantId, { clientId });
  }

  /**
   * Get a single project
   */
  async getProject(id: string, tenantId: string): Promise<Project> {
    const project = await this.cosmos.getDocument<Project>('projects', { id, tenantId });
    
    if (!project) {
      throw new NotFoundError(`Project not found: ${id}`);
    }

    return project;
  }

  /**
   * Update a project
   */
  async updateProject(
    id: string,
    updates: UpdateProjectInput,
    tenantId: string
  ): Promise<Project> {
    const existingProject = await this.getProject(id, tenantId);

    const updatedProject: Project = {
      ...existingProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If status changed to completed, set completed date
    if (updates.status === 'completed' && existingProject.status !== 'completed') {
      updatedProject.completedDate = new Date().toISOString();
    }

    await this.cosmos.updateDocument('projects', { id, tenantId }, updatedProject);
    return updatedProject;
  }

  /**
   * Delete a project (soft delete - set status to archived)
   */
  async deleteProject(id: string, tenantId: string): Promise<void> {
    await this.updateProject(id, { status: 'archived' }, tenantId);
  }

  /**
   * Get project statistics
   */
  async getProjectStats(projectId: string, tenantId: string): Promise<{
    conversationCount: number;
    messageCount: number;
    artifactCount: number;
    lastActivity: string;
  }> {
    // Get conversation count and details
    const convQuery = {
      query: 'SELECT c.id, c.messages, c.lastMessageAt FROM c WHERE c.tenantId = @tenantId AND c.projectId = @projectId',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@projectId', value: projectId },
      ],
    };

    const convResult = await this.cosmos.queryDocuments('conversations', convQuery);
    const conversations = convResult.resources;

    const conversationCount = conversations.length;
    const messageCount = conversations.reduce((sum: number, conv: any) => sum + (conv.messages?.length || 0), 0);
    
    // Get artifact count from outputs
    const artifactQuery = {
      query: 'SELECT VALUE COUNT(1) FROM c WHERE c.tenantId = @tenantId AND c.projectId = @projectId',
      parameters: [
        { name: '@tenantId', value: tenantId },
        { name: '@projectId', value: projectId },
      ],
    };

    const artifactResult = await this.cosmos.queryDocuments('outputs', artifactQuery);
    const artifactCount = artifactResult.resources[0] || 0;

    // Get last activity
    const lastActivity = conversations.length > 0
      ? conversations.reduce((latest: string, conv: any) => 
          conv.lastMessageAt > latest ? conv.lastMessageAt : latest, conversations[0].lastMessageAt)
      : new Date().toISOString();

    return {
      conversationCount,
      messageCount,
      artifactCount,
      lastActivity,
    };
  }
}

