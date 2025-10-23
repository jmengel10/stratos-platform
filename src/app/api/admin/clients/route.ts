import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

// Initialize CosmosDB client with error handling
let cosmosClient: CosmosClient | null = null;
let database: any = null;
let container: any = null;

try {
  if (process.env.COSMOS_ENDPOINT && process.env.COSMOS_KEY) {
    cosmosClient = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });
    database = cosmosClient.database(process.env.COSMOS_DATABASE_ID || 'stratos');
    container = database.container('clients');
  }
} catch (error) {
  console.warn('CosmosDB not configured:', error);
}

export async function GET(request: NextRequest) {
  try {
    if (!container) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tier = searchParams.get('tier');
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM c';
    const parameters = [];
    const conditions = [];
    
    if (search) {
      conditions.push('CONTAINS(LOWER(c.name), LOWER(@search))');
      parameters.push({ name: '@search', value: search });
    }
    
    if (tier) {
      conditions.push('c.tier = @tier');
      parameters.push({ name: '@tier', value: tier });
    }
    
    if (status) {
      conditions.push('c.subscription.status = @status');
      parameters.push({ name: '@status', value: status });
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY c.name';
    
    const { resources } = await container.items.query({
      query,
      parameters
    }).fetchAll();
    
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
