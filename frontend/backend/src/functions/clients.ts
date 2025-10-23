/**
 * Clients API Endpoints
 * Manages client CRUD operations
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ClientService } from '../services/client.service';
import { verifyToken } from '../utils/auth';

const clientService = new ClientService();

/**
 * Create a new client
 * POST /api/clients
 */
async function createClient(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Verify authentication
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const body = await request.json() as any;
    
    const client = await clientService.createClient(
      body,
      auth.userId,
      auth.tenantId
    );

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    };
  } catch (error: any) {
    context.error('Error creating client:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Get all clients
 * GET /api/clients?industry=...&status=...&search=...
 */
async function getClients(
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
      industry: url.searchParams.get('industry') || undefined,
      status: url.searchParams.get('status') || undefined,
      search: url.searchParams.get('search') || undefined,
    };

    const clients = await clientService.getClients(auth.tenantId, filters);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clients),
    };
  } catch (error: any) {
    context.error('Error getting clients:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Get a single client
 * GET /api/clients/:id
 */
async function getClient(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const clientId = request.params.id;
    if (!clientId) {
      return { status: 400, body: JSON.stringify({ error: 'Client ID required' }) };
    }

    const client = await clientService.getClient(clientId, auth.tenantId);

    // Get client stats
    const stats = await clientService.getClientStats(clientId, auth.tenantId);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...client, stats }),
    };
  } catch (error: any) {
    context.error('Error getting client:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Update a client
 * PUT /api/clients/:id
 */
async function updateClient(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const clientId = request.params.id;
    if (!clientId) {
      return { status: 400, body: JSON.stringify({ error: 'Client ID required' }) };
    }

    const updates = await request.json() as any;
    
    const client = await clientService.updateClient(clientId, updates, auth.tenantId);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    };
  } catch (error: any) {
    context.error('Error updating client:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

/**
 * Delete a client (soft delete)
 * DELETE /api/clients/:id
 */
async function deleteClient(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const clientId = request.params.id;
    if (!clientId) {
      return { status: 400, body: JSON.stringify({ error: 'Client ID required' }) };
    }

    await clientService.deleteClient(clientId, auth.tenantId);

    return {
      status: 204,
      body: '',
    };
  } catch (error: any) {
    context.error('Error deleting client:', error);
    return {
      status: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

// Register endpoints
app.http('createClient', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'clients',
  handler: createClient,
});

app.http('getClients', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'clients',
  handler: getClients,
});

app.http('getClient', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'clients/{id}',
  handler: getClient,
});

app.http('updateClient', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'clients/{id}',
  handler: updateClient,
});

app.http('deleteClient', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'clients/{id}',
  handler: deleteClient,
});

