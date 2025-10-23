import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

// Initialize CosmosDB client with error handling
let cosmosClient: CosmosClient | null = null;
let database: any = null;
let clientsContainer: any = null;
let configContainer: any = null;

try {
  if (process.env.COSMOS_ENDPOINT && process.env.COSMOS_KEY) {
    cosmosClient = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });
    database = cosmosClient.database(process.env.COSMOS_DATABASE_ID || 'stratos');
    clientsContainer = database.container('clients');
    configContainer = database.container('stratos_config');
  }
} catch (error) {
  console.warn('CosmosDB not configured:', error);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!clientsContainer || !configContainer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const clientId = params.id;
    
    // Get client
    const { resource: client } = await clientsContainer.item(clientId, clientId).read();
    
    // Get global config
    const { resource: config } = await configContainer.item('stratos', 'stratos').read();
    
    // Calculate effective config
    const tierConfig = config.tiers[client.tier];
    const effectiveConfig = {
      tier: client.tier,
      pricing: { ...tierConfig.price },
      limits: { ...tierConfig.limits },
      addOns: {}
    };
    
    // Apply overrides
    if (client.overrides?.pricing?.enabled) {
      effectiveConfig.pricing = {
        ...effectiveConfig.pricing,
        ...client.overrides.pricing,
        isCustom: true
      };
    }
    
    if (client.overrides?.limits?.enabled) {
      effectiveConfig.limits = {
        ...effectiveConfig.limits,
        ...client.overrides.limits
      };
    }
    
    // Apply add-ons
    for (const [addonId, isEnabled] of Object.entries(client.addOns || {})) {
      if (isEnabled && config.addOns && config.addOns[addonId]) {
        (effectiveConfig.addOns as any)[addonId] = {
          ...config.addOns[addonId],
          enabled: true
        };
      }
    }
    
    return NextResponse.json({
      client,
      effectiveConfig,
      usageStats: {
        current: client.usage,
        limits: effectiveConfig.limits,
        utilization: {
          projects: (client.usage.projects / effectiveConfig.limits.projects) * 100,
          tokens: (client.usage.tokens.total / effectiveConfig.limits.tokens) * 100,
          storage: (client.usage.storage / effectiveConfig.limits.storage) * 100
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }
}
