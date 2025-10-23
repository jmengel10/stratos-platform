/**
 * StratOS Platform - Tenant Service
 * 
 * Comprehensive tenant and user management for multi-tenant SaaS
 */

import { CosmosService } from './cosmos.service';
import { insights } from './insights.service';
import { v4 as uuidv4 } from 'uuid';

export type TenantPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'cancelled';
export type UserStatus = 'active' | 'invited' | 'suspended';

export interface TenantSettings {
  allowedAgents: string[];
  monthlyQueryLimit: number;
  storageQuotaGB: number;
  enabledIndustries: string[];
  enabledFeatures: string[];
  customBranding?: {
    logo?: string;
    primaryColor?: string;
    companyName?: string;
  };
}

export interface UsageRecord {
  date: string;
  queries: number;
  tokensUsed: number;
  storageUsedMB: number;
}

export interface TenantUsage {
  queriesThisMonth: number;
  queriesTotal: number;
  storageUsedMB: number;
  lastQueryAt?: string;
  usageHistory: UsageRecord[];
}

export interface BillingInfo {
  stripeCustomerId?: string;
  paymentMethod?: string;
  billingEmail?: string;
  nextBillingDate?: string;
  lastPaymentDate?: string;
}

export interface TenantData {
  id: string;
  tenantId: string; // Same as id for partition key
  name: string;
  domain: string;
  plan: TenantPlan;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  settings: TenantSettings;
  usage: TenantUsage;
  billingInfo?: BillingInfo;
  owner: {
    userId: string;
    email: string;
    name: string;
  };
}

export interface UserData {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  roles: string[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  inviteToken?: string;
  inviteExpiry?: string;
}

/**
 * Plan configurations with limits and features
 */
const PLAN_CONFIGS: Record<TenantPlan, Partial<TenantSettings>> = {
  free: {
    monthlyQueryLimit: 50,
    storageQuotaGB: 1,
    allowedAgents: ['gtm-strategist'],
    enabledFeatures: ['basic-chat', 'search'],
  },
  starter: {
    monthlyQueryLimit: 500,
    storageQuotaGB: 10,
    allowedAgents: ['gtm-strategist', 'ops-analyst', 'product-strategist'],
    enabledFeatures: ['basic-chat', 'search', 'upload', 'conversations'],
  },
  pro: {
    monthlyQueryLimit: 2000,
    storageQuotaGB: 50,
    allowedAgents: ['gtm-strategist', 'ops-analyst', 'fundraising-advisor', 'product-strategist', 'data-analyst'],
    enabledFeatures: ['basic-chat', 'search', 'upload', 'conversations', 'artifacts', 'export'],
  },
  enterprise: {
    monthlyQueryLimit: 10000,
    storageQuotaGB: 500,
    allowedAgents: ['gtm-strategist', 'ops-analyst', 'fundraising-advisor', 'product-strategist', 'data-analyst'],
    enabledFeatures: ['basic-chat', 'search', 'upload', 'conversations', 'artifacts', 'export', 'custom-branding', 'api-access', 'sso'],
  },
};

export class TenantService {
  private cosmos: CosmosService;

  constructor() {
    this.cosmos = new CosmosService();
  }

  /**
   * Create a new tenant
   * 
   * @param data - Tenant creation data
   * @returns Created tenant
   */
  async createTenant(data: {
    name: string;
    domain: string;
    ownerEmail: string;
    ownerName: string;
    plan?: TenantPlan;
  }): Promise<TenantData> {
    try {
      const tenantId = uuidv4();
      const plan = data.plan || 'free';
      const planConfig = PLAN_CONFIGS[plan];

      const tenant: TenantData = {
        id: tenantId,
        tenantId, // Partition key
        name: data.name,
        domain: data.domain,
        plan,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          allowedAgents: planConfig.allowedAgents || [],
          monthlyQueryLimit: planConfig.monthlyQueryLimit || 50,
          storageQuotaGB: planConfig.storageQuotaGB || 1,
          enabledIndustries: [],
          enabledFeatures: planConfig.enabledFeatures || [],
        },
        usage: {
          queriesThisMonth: 0,
          queriesTotal: 0,
          storageUsedMB: 0,
          usageHistory: [],
        },
        owner: {
          userId: uuidv4(), // Will be linked to B2C account
          email: data.ownerEmail,
          name: data.ownerName,
        },
      };

      const created = await this.cosmos.createDocument('tenants', tenant);

      // Create owner user
      await this.createUser({
        tenantId,
        email: data.ownerEmail,
        name: data.ownerName,
        roles: ['owner', 'admin'],
      });

      insights.trackEvent('TenantCreated', {
        tenantId,
        plan,
        domain: data.domain,
      });

      return created as TenantData;
    } catch (error) {
      console.error('Create tenant error:', error);
      throw new Error(`Failed to create tenant: ${(error as Error).message}`);
    }
  }

  /**
   * Get tenant by ID
   * 
   * @param tenantId - Tenant ID
   * @returns Tenant or null
   */
  async getTenant(tenantId: string): Promise<TenantData | null> {
    try {
      return await this.cosmos.getDocument<TenantData>('tenants', tenantId, tenantId);
    } catch (error) {
      console.error('Get tenant error:', error);
      return null;
    }
  }

  /**
   * Update tenant
   * 
   * @param tenantId - Tenant ID
   * @param updates - Fields to update
   * @returns Updated tenant
   */
  async updateTenant(
    tenantId: string,
    updates: Partial<TenantData>
  ): Promise<TenantData> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const updated = {
        ...tenant,
        ...updates,
        id: tenantId, // Ensure ID doesn't change
        tenantId, // Ensure partition key doesn't change
        updatedAt: new Date().toISOString(),
      };

      return await this.cosmos.updateDocument('tenants', updated) as TenantData;
    } catch (error) {
      console.error('Update tenant error:', error);
      throw new Error(`Failed to update tenant: ${(error as Error).message}`);
    }
  }

  /**
   * Check if tenant is under usage limit
   * 
   * @param tenantId - Tenant ID
   * @returns True if under limit
   */
  async checkUsageLimit(tenantId: string): Promise<boolean> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant) return false;

      if (tenant.status !== 'active') return false;

      return tenant.usage.queriesThisMonth < tenant.settings.monthlyQueryLimit;
    } catch (error) {
      console.error('Check usage limit error:', error);
      return false;
    }
  }

  /**
   * Increment tenant usage
   * 
   * @param tenantId - Tenant ID
   * @param type - Usage type
   * @param amount - Amount to increment
   */
  async incrementUsage(
    tenantId: string,
    type: 'queries' | 'storage',
    amount: number = 1
  ): Promise<void> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant) return;

      if (type === 'queries') {
        tenant.usage.queriesThisMonth += amount;
        tenant.usage.queriesTotal += amount;
        tenant.usage.lastQueryAt = new Date().toISOString();
      } else if (type === 'storage') {
        tenant.usage.storageUsedMB += amount;
      }

      // Check if approaching limit (80%)
      const usagePercentage = (tenant.usage.queriesThisMonth / tenant.settings.monthlyQueryLimit) * 100;
      if (usagePercentage >= 80 && usagePercentage < 81) {
        insights.trackEvent('UsageLimitWarning', {
          tenantId,
          percentage: usagePercentage,
          plan: tenant.plan,
        });

        // In production, send email notification
        console.warn(`Tenant ${tenantId} approaching usage limit: ${usagePercentage}%`);
      }

      await this.cosmos.updateDocument('tenants', tenant);
    } catch (error) {
      console.error('Increment usage error:', error);
      // Don't throw - usage tracking failure shouldn't break requests
    }
  }

  /**
   * Upgrade tenant plan
   * 
   * @param tenantId - Tenant ID
   * @param newPlan - New plan tier
   * @returns Updated tenant
   */
  async upgradePlan(tenantId: string, newPlan: TenantPlan): Promise<TenantData> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const planConfig = PLAN_CONFIGS[newPlan];

      // Update plan and settings
      tenant.plan = newPlan;
      tenant.settings = {
        ...tenant.settings,
        ...planConfig,
      };

      const updated = await this.cosmos.updateDocument('tenants', tenant) as TenantData;

      insights.trackEvent('PlanUpgraded', {
        tenantId,
        oldPlan: tenant.plan,
        newPlan,
      });

      return updated;
    } catch (error) {
      console.error('Upgrade plan error:', error);
      throw new Error(`Failed to upgrade plan: ${(error as Error).message}`);
    }
  }

  /**
   * Suspend tenant
   * 
   * @param tenantId - Tenant ID
   * @param reason - Suspension reason
   */
  async suspendTenant(tenantId: string, reason: string): Promise<void> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      tenant.status = 'suspended';
      await this.cosmos.updateDocument('tenants', tenant);

      insights.trackEvent('TenantSuspended', {
        tenantId,
        reason,
      });

      // In production, send notification email
      console.log(`Tenant ${tenantId} suspended: ${reason}`);
    } catch (error) {
      console.error('Suspend tenant error:', error);
      throw new Error(`Failed to suspend tenant: ${(error as Error).message}`);
    }
  }

  /**
   * Create user
   * 
   * @param data - User data
   * @returns Created user
   */
  async createUser(data: {
    tenantId: string;
    email: string;
    name: string;
    roles: string[];
  }): Promise<UserData> {
    try {
      const user: UserData = {
        id: uuidv4(),
        tenantId: data.tenantId,
        email: data.email,
        name: data.name,
        roles: data.roles,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return await this.cosmos.createDocument('users', user) as UserData;
    } catch (error) {
      console.error('Create user error:', error);
      throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
  }

  /**
   * Get tenant users
   * 
   * @param tenantId - Tenant ID
   * @returns List of users
   */
  async getTenantUsers(tenantId: string): Promise<UserData[]> {
    try {
      const result = await this.cosmos.queryAll<UserData>(
        'users',
        'SELECT * FROM c',
        tenantId
      );

      return result;
    } catch (error) {
      console.error('Get tenant users error:', error);
      return [];
    }
  }

  /**
   * Invite user to tenant
   * 
   * @param tenantId - Tenant ID
   * @param email - User email
   * @param role - User role
   * @returns Created user with invite token
   */
  async inviteUser(
    tenantId: string,
    email: string,
    role: string
  ): Promise<UserData> {
    try {
      const inviteToken = uuidv4();
      const inviteExpiry = new Date();
      inviteExpiry.setDate(inviteExpiry.getDate() + 7); // 7 days

      const user: UserData = {
        id: uuidv4(),
        tenantId,
        email,
        name: '', // Will be filled when user accepts
        roles: [role],
        status: 'invited',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inviteToken,
        inviteExpiry: inviteExpiry.toISOString(),
      };

      const created = await this.cosmos.createDocument('users', user) as UserData;

      insights.trackEvent('UserInvited', {
        tenantId,
        email,
        role,
      });

      // In production, send invitation email
      console.log(`User invited: ${email} to tenant ${tenantId}`);

      return created;
    } catch (error) {
      console.error('Invite user error:', error);
      throw new Error(`Failed to invite user: ${(error as Error).message}`);
    }
  }

  /**
   * Get user by ID
   * 
   * @param userId - User ID
   * @param tenantId - Tenant ID
   * @returns User or null
   */
  async getUser(userId: string, tenantId: string): Promise<UserData | null> {
    try {
      return await this.cosmos.getDocument<UserData>('users', userId, tenantId);
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Update user
   * 
   * @param userId - User ID
   * @param tenantId - Tenant ID
   * @param updates - Fields to update
   * @returns Updated user
   */
  async updateUser(
    userId: string,
    tenantId: string,
    updates: Partial<UserData>
  ): Promise<UserData> {
    try {
      const user = await this.getUser(userId, tenantId);
      if (!user) {
        throw new Error('User not found');
      }

      const updated = {
        ...user,
        ...updates,
        id: userId,
        tenantId,
        updatedAt: new Date().toISOString(),
      };

      return await this.cosmos.updateDocument('users', updated) as UserData;
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error(`Failed to update user: ${(error as Error).message}`);
    }
  }
}

