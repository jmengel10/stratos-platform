/**
 * Projects API Endpoints
 * Manages project CRUD operations
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ProjectService } from '../services/project.service';
import { verifyToken } from '../utils/auth';

const projectService = new ProjectService();

/**
 * Create a new project
 * POST /api/projects
 */
async function createProject(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const body = await request.json() as any;
    
    const project = await projectService.createProject(
      body,
      auth.userId,
      auth.tenantId
    );

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    };
  } catch (error: any) {
    context.error('Error creating project:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Get all projects
 * GET /api/projects?clientId=...&type=...&status=...&search=...
 */
async function getProjects(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const url = new URL(request.url);
    const filters = {
      clientId: url.searchParams.get('clientId') || undefined,
      type: url.searchParams.get('type') || undefined,
      status: url.searchParams.get('status') || undefined,
      search: url.searchParams.get('search') || undefined,
    };

    const projects = await projectService.getProjects(auth.tenantId, filters);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects),
    };
  } catch (error: any) {
    context.error('Error getting projects:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Get a single project
 * GET /api/projects/:id
 */
async function getProject(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const projectId = request.params.id;
    if (!projectId) {
      return { status: 400, body: JSON.stringify({ error: 'Project ID required' }) };
    }

    const project = await projectService.getProject(projectId, auth.tenantId);

    // Get project stats
    const stats = await projectService.getProjectStats(projectId, auth.tenantId);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, stats }),
    };
  } catch (error: any) {
    context.error('Error getting project:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Update a project
 * PUT /api/projects/:id
 */
async function updateProject(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const projectId = request.params.id;
    if (!projectId) {
      return { status: 400, body: JSON.stringify({ error: 'Project ID required' }) };
    }

    const updates = await request.json() as any;
    
    const project = await projectService.updateProject(projectId, updates, auth.tenantId);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    };
  } catch (error: any) {
    context.error('Error updating project:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Delete a project (soft delete)
 * DELETE /api/projects/:id
 */
async function deleteProject(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const projectId = request.params.id;
    if (!projectId) {
      return { status: 400, body: JSON.stringify({ error: 'Project ID required' }) };
    }

    await projectService.deleteProject(projectId, auth.tenantId);

    return {
      status: 204,
      body: '',
    };
  } catch (error: any) {
    context.error('Error deleting project:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

// Register endpoints
app.http('createProject', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: createProject,
});

app.http('getProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: getProjects,
});

app.http('getProject', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: getProject,
});

app.http('updateProject', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: updateProject,
});

app.http('deleteProject', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: deleteProject,
});

