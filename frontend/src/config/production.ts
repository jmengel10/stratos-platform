// Production configuration
export const productionConfig = {
  // Application settings
  app: {
    name: 'StratOS Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    debug: process.env.NODE_ENV === 'development',
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://stratos-platform-func-829197.azurewebsites.net',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Database Configuration
  database: {
    cosmosEndpoint: process.env.COSMOS_ENDPOINT,
    cosmosKey: process.env.COSMOS_KEY,
    databaseId: process.env.COSMOS_DATABASE_ID || 'stratos',
    containers: {
      config: 'stratos_config',
      clients: 'clients',
      audit: 'audit_logs',
      users: 'users',
      projects: 'projects',
      conversations: 'conversations',
      prompts: 'prompts',
      outputs: 'outputs',
      tenants: 'tenants'
    }
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    requireLowercase: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    adminMaxRequests: 1000,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Monitoring and Logging
  monitoring: {
    appInsightsConnectionString: process.env.APPINSIGHTS_CONNECTION_STRING,
    logLevel: process.env.LOG_LEVEL || 'info',
    enablePerformanceTracking: true,
    enableErrorTracking: true,
    enableUserTracking: true,
    enableDependencyTracking: true,
  },

  // Feature Flags
  features: {
    enableAdminPanel: true,
    enableMultiTenant: true,
    enableBilling: process.env.STRIPE_SECRET_KEY ? true : false,
    enableAnalytics: true,
    enableNotifications: true,
    enableFileUpload: true,
    enableRealTimeChat: true,
    enableDataExport: true,
    enableAuditLogging: true,
  },

  // External Services
  services: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      enabled: !!process.env.STRIPE_SECRET_KEY,
    },
    azure: {
      openaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
      openaiKey: process.env.AZURE_OPENAI_KEY,
      openaiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      openaiEmbeddingDeployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
      storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      searchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
      searchKey: process.env.AZURE_SEARCH_KEY,
    },
  },

  // UI Configuration
  ui: {
    theme: 'light',
    primaryColor: '#33A7B5',
    secondaryColor: '#EFF6FF',
    accentColor: '#D97706',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    successColor: '#10B981',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx', '.png', '.jpg', '.jpeg', '.gif'],
    paginationSize: 20,
    maxSearchResults: 100,
  },

  // Performance Configuration
  performance: {
    enableCaching: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    enableCompression: true,
    enableImageOptimization: true,
    maxConcurrentRequests: 10,
    requestTimeout: 30000, // 30 seconds
  },

  // Backup and Recovery
  backup: {
    enabled: true,
    frequency: 'daily',
    retentionDays: 30,
    includeAuditLogs: true,
    includeUserData: true,
    includeSystemConfig: true,
  },

  // Health Check Configuration
  healthCheck: {
    enabled: true,
    interval: 60 * 1000, // 1 minute
    timeout: 10 * 1000, // 10 seconds
    endpoints: [
      '/api/health',
      '/api/admin/health',
      '/api/clients/health'
    ],
  },

  // Maintenance Mode
  maintenance: {
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: 'System maintenance in progress. Please try again later.',
    allowedPaths: ['/api/health', '/api/status'],
  }
};

export default productionConfig;

