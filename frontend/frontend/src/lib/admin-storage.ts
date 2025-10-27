// Admin Portal Data Storage System
// Handles pricing packages, client billing, AI agents, and platform settings

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  stripePriceId: string;
  features: string[];
  limits: {
    clients: number;
    projects: number;
    conversations: number;
    storage: number; // in GB
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientBilling {
  id: string;
  clientId: string;
  clientName: string;
  packageId: string;
  packageName: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  amount: number;
  billingEmail: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  color: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  stripeKeys: {
    publishableKey: string;
    secretKey: string;
  };
  updatedAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  PRICING_PACKAGES: 'admin_pricing_packages',
  CLIENT_BILLING: 'admin_client_billing',
  AI_AGENTS: 'admin_ai_agents',
  PLATFORM_SETTINGS: 'admin_platform_settings',
};

// Default seed data
const SEED_DATA = {
  pricingPackages: [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      interval: 'monthly' as const,
      stripePriceId: 'price_starter_monthly',
      features: [
        'Up to 5 clients',
        'Unlimited projects',
        'Basic AI agents',
        'Email support',
        'Standard templates'
      ],
      limits: {
        clients: 5,
        projects: -1, // unlimited
        conversations: 100,
        storage: 10
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 299,
      interval: 'monthly' as const,
      stripePriceId: 'price_professional_monthly',
      features: [
        'Up to 25 clients',
        'Unlimited projects',
        'All AI agents',
        'Priority support',
        'Advanced templates',
        'Custom branding',
        'API access'
      ],
      limits: {
        clients: 25,
        projects: -1,
        conversations: 500,
        storage: 50
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      interval: 'monthly' as const,
      stripePriceId: 'price_enterprise_monthly',
      features: [
        'Unlimited clients',
        'Unlimited projects',
        'All AI agents',
        '24/7 support',
        'Custom templates',
        'White-label solution',
        'Full API access',
        'Dedicated account manager'
      ],
      limits: {
        clients: -1,
        projects: -1,
        conversations: -1,
        storage: 500
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as PricingPackage[],
  
  aiAgents: [
    {
      id: 'gtm-strategist',
      name: 'GTM Strategist',
      avatar: '🎯',
      color: '#3B82F6',
      description: 'Expert in go-to-market strategies, market analysis, and competitive positioning',
      systemPrompt: 'You are a seasoned go-to-market strategist with 15+ years of experience helping companies launch products and enter new markets. Focus on data-driven insights, competitive analysis, and actionable recommendations.',
      capabilities: ['Market Analysis', 'Competitive Research', 'Pricing Strategy', 'Channel Strategy', 'Customer Segmentation'],
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'operations-analyst',
      name: 'Operations Analyst',
      avatar: '⚙️',
      color: '#10B981',
      description: 'Specializes in operational efficiency, process optimization, and workflow analysis',
      systemPrompt: 'You are an operations analyst with deep expertise in process improvement, efficiency optimization, and operational excellence. Provide practical, implementable solutions.',
      capabilities: ['Process Optimization', 'Workflow Analysis', 'Efficiency Metrics', 'Resource Planning', 'Quality Control'],
      model: 'gpt-4',
      temperature: 0.6,
      maxTokens: 2000,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fundraising-advisor',
      name: 'Fundraising Advisor',
      avatar: '💰',
      color: '#8B5CF6',
      description: 'Expert in fundraising strategies, investor relations, and pitch development',
      systemPrompt: 'You are a fundraising advisor with extensive experience in venture capital, private equity, and startup financing. Help craft compelling narratives and strategic approaches.',
      capabilities: ['Pitch Development', 'Investor Relations', 'Financial Modeling', 'Due Diligence', 'Term Sheet Analysis'],
      model: 'gpt-4',
      temperature: 0.8,
      maxTokens: 2500,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'product-strategist',
      name: 'Product Strategist',
      avatar: '💡',
      color: '#F59E0B',
      description: 'Focuses on product strategy, roadmap planning, and feature prioritization',
      systemPrompt: 'You are a product strategist with expertise in product management, user experience, and market-driven product development. Emphasize user-centric approaches.',
      capabilities: ['Product Roadmap', 'Feature Prioritization', 'User Research', 'Market Validation', 'Competitive Analysis'],
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst',
      avatar: '📊',
      color: '#EC4899',
      description: 'Specializes in data analysis, metrics interpretation, and business intelligence',
      systemPrompt: 'You are a data analyst with strong expertise in statistical analysis, business metrics, and data-driven decision making. Focus on actionable insights.',
      capabilities: ['Statistical Analysis', 'Metrics Design', 'Data Visualization', 'Trend Analysis', 'Performance Measurement'],
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 2000,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as AIAgent[],
  
  platformSettings: {
    siteName: 'Stratos',
    supportEmail: 'support@stratos.com',
    maxFileSize: 10, // MB
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
    maintenanceMode: false,
    stripeKeys: {
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...'
    },
    updatedAt: new Date().toISOString()
  } as PlatformSettings
};

// Helper function to check localStorage availability
function isLocalStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// Initialize admin storage
export function initializeAdminStorage(): void {
  if (!isLocalStorageAvailable()) return;
  
  // Initialize pricing packages
  if (!localStorage.getItem(STORAGE_KEYS.PRICING_PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PRICING_PACKAGES, JSON.stringify(SEED_DATA.pricingPackages));
  }
  
  // Initialize client billing (empty array)
  if (!localStorage.getItem(STORAGE_KEYS.CLIENT_BILLING)) {
    localStorage.setItem(STORAGE_KEYS.CLIENT_BILLING, JSON.stringify([]));
  }
  
  // Initialize AI agents
  if (!localStorage.getItem(STORAGE_KEYS.AI_AGENTS)) {
    localStorage.setItem(STORAGE_KEYS.AI_AGENTS, JSON.stringify(SEED_DATA.aiAgents));
  }
  
  // Initialize platform settings
  if (!localStorage.getItem(STORAGE_KEYS.PLATFORM_SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, JSON.stringify(SEED_DATA.platformSettings));
  }
}

// Pricing Package CRUD operations
export function getAllPackages(): PricingPackage[] {
  if (!isLocalStorageAvailable()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.PRICING_PACKAGES);
  return data ? JSON.parse(data) : [];
}

export function createPackage(pkg: Omit<PricingPackage, 'id' | 'createdAt' | 'updatedAt'>): PricingPackage {
  if (!isLocalStorageAvailable()) throw new Error('localStorage not available');
  const packages = getAllPackages();
  const newPackage: PricingPackage = {
    ...pkg,
    id: `pkg_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  packages.push(newPackage);
  localStorage.setItem(STORAGE_KEYS.PRICING_PACKAGES, JSON.stringify(packages));
  return newPackage;
}

export function updatePackage(id: string, updates: Partial<PricingPackage>): PricingPackage | null {
  if (!isLocalStorageAvailable()) return null;
  const packages = getAllPackages();
  const index = packages.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  packages[index] = {
    ...packages[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEYS.PRICING_PACKAGES, JSON.stringify(packages));
  return packages[index];
}

export function deletePackage(id: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  const packages = getAllPackages();
  const billing = getAllClientBilling();
  
  // Check if package has active clients
  const hasActiveClients = billing.some(b => b.packageId === id && b.status === 'active');
  if (hasActiveClients) {
    throw new Error('Cannot delete package with active clients');
  }
  
  const filteredPackages = packages.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRICING_PACKAGES, JSON.stringify(filteredPackages));
  return true;
}

// Client Billing CRUD operations
export function getAllClientBilling(): ClientBilling[] {
  if (!isLocalStorageAvailable()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.CLIENT_BILLING);
  return data ? JSON.parse(data) : [];
}

export function createClientBilling(billing: Omit<ClientBilling, 'id' | 'createdAt' | 'updatedAt'>): ClientBilling {
  if (!isLocalStorageAvailable()) throw new Error('localStorage not available');
  const allBilling = getAllClientBilling();
  const newBilling: ClientBilling = {
    ...billing,
    id: `billing_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  allBilling.push(newBilling);
  localStorage.setItem(STORAGE_KEYS.CLIENT_BILLING, JSON.stringify(allBilling));
  return newBilling;
}

export function updateClientBilling(id: string, updates: Partial<ClientBilling>): ClientBilling | null {
  if (!isLocalStorageAvailable()) return null;
  const allBilling = getAllClientBilling();
  const index = allBilling.findIndex(b => b.id === id);
  
  if (index === -1) return null;
  
  allBilling[index] = {
    ...allBilling[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEYS.CLIENT_BILLING, JSON.stringify(allBilling));
  return allBilling[index];
}

// AI Agent CRUD operations
export function getAllAgents(): AIAgent[] {
  if (!isLocalStorageAvailable()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.AI_AGENTS);
  return data ? JSON.parse(data) : [];
}

export function getActiveAgents(): AIAgent[] {
  return getAllAgents().filter(agent => agent.isActive);
}

export function createAgent(agent: Omit<AIAgent, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): AIAgent {
  if (!isLocalStorageAvailable()) throw new Error('localStorage not available');
  const agents = getAllAgents();
  const newAgent: AIAgent = {
    ...agent,
    id: `agent_${Date.now()}`,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  agents.push(newAgent);
  localStorage.setItem(STORAGE_KEYS.AI_AGENTS, JSON.stringify(agents));
  return newAgent;
}

export function updateAgent(id: string, updates: Partial<AIAgent>): AIAgent | null {
  if (!isLocalStorageAvailable()) return null;
  const agents = getAllAgents();
  const index = agents.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  agents[index] = {
    ...agents[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEYS.AI_AGENTS, JSON.stringify(agents));
  return agents[index];
}

export function deleteAgent(id: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  const agents = getAllAgents();
  const filteredAgents = agents.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.AI_AGENTS, JSON.stringify(filteredAgents));
  return true;
}

export function incrementAgentUsage(agentId: string): void {
  if (!isLocalStorageAvailable()) return;
  const agents = getAllAgents();
  const agent = agents.find(a => a.id === agentId);
  if (agent) {
    agent.usageCount += 1;
    agent.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.AI_AGENTS, JSON.stringify(agents));
  }
}

// Platform Settings operations
export function getPlatformSettings(): PlatformSettings {
  if (!isLocalStorageAvailable()) return SEED_DATA.platformSettings;
  const data = localStorage.getItem(STORAGE_KEYS.PLATFORM_SETTINGS);
  return data ? JSON.parse(data) : SEED_DATA.platformSettings;
}

export function updatePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  if (!isLocalStorageAvailable()) throw new Error('localStorage not available');
  const currentSettings = getPlatformSettings();
  const updatedSettings: PlatformSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, JSON.stringify(updatedSettings));
  return updatedSettings;
}

// Helper functions
export function getPackageById(id: string): PricingPackage | null {
  return getAllPackages().find(p => p.id === id) || null;
}

export function getAgentById(id: string): AIAgent | null {
  return getAllAgents().find(a => a.id === id) || null;
}

export function getBillingByClientId(clientId: string): ClientBilling | null {
  return getAllClientBilling().find(b => b.clientId === clientId) || null;
}

// Admin check function
export function isAdmin(): boolean {
  // For now, return true for demo purposes
  // In production, this would check user role from auth system
  return true;
}
