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
    container = database.container('stratos_config');
  }
} catch (error) {
  console.warn('CosmosDB not configured:', error);
}

export async function GET() {
  try {
    if (!container) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { resource } = await container.item('stratos', 'stratos').read();
    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!container) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const body = await request.json();
    const { resource } = await container.item('stratos', 'stratos').replace(body);
    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
  }
}
