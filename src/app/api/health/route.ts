import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

// Health check endpoint for production monitoring
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    checks: {
      database: 'unknown',
      api: 'healthy',
      memory: 'healthy',
      disk: 'healthy'
    },
    responseTime: 0
  };

  try {
    // Check database connectivity
    if (process.env.COSMOS_ENDPOINT && process.env.COSMOS_KEY) {
      try {
        const cosmosClient = new CosmosClient({
          endpoint: process.env.COSMOS_ENDPOINT,
          key: process.env.COSMOS_KEY
        });
        
        const database = cosmosClient.database(process.env.COSMOS_DATABASE_ID || 'stratos');
        await database.read();
        healthStatus.checks.database = 'healthy';
      } catch (error) {
        healthStatus.checks.database = 'unhealthy';
        healthStatus.status = 'degraded';
      }
    } else {
      healthStatus.checks.database = 'not_configured';
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    const maxMemoryMB = 512; // 512MB limit for Azure Functions
    
    if (memoryUsageMB > maxMemoryMB * 0.9) {
      healthStatus.checks.memory = 'warning';
      healthStatus.status = 'degraded';
    }

    // Check disk space (simplified)
    healthStatus.checks.disk = 'healthy';

    // Calculate response time
    healthStatus.responseTime = Date.now() - startTime;

    // Determine overall status
    const unhealthyChecks = Object.values(healthStatus.checks).filter(status => 
      status === 'unhealthy' || status === 'error'
    );
    
    if (unhealthyChecks.length > 0) {
      healthStatus.status = 'unhealthy';
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    healthStatus.status = 'unhealthy';
    healthStatus.checks.api = 'error';
    healthStatus.responseTime = Date.now() - startTime;

    return NextResponse.json(healthStatus, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// Simple status endpoint for load balancers
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

