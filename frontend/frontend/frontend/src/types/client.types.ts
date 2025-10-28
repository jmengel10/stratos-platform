/**
 * Client Type Definitions
 */

export interface Client {
  id: string;
  tenantId: string;
  name: string;
  industry: 'fintech' | 'healthcare' | 'saas' | 'logistics' | 'ecommerce' | 'enterprise' | 'other';
  description: string;
  logoUrl?: string;
  status: 'active' | 'inactive' | 'archived';
  metadata?: {
    contactEmail?: string;
    contactName?: string;
    website?: string;
    size?: 'startup' | 'smb' | 'mid-market' | 'enterprise';
    revenue?: string;
    employees?: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  stats?: {
    projectCount: number;
    conversationCount: number;
    lastActivity: string;
  };
}

export interface CreateClientInput {
  name: string;
  industry: Client['industry'];
  description: string;
  logoUrl?: string;
  metadata?: Client['metadata'];
}

export interface UpdateClientInput {
  name?: string;
  industry?: Client['industry'];
  description?: string;
  logoUrl?: string;
  status?: Client['status'];
  metadata?: Client['metadata'];
}

export interface ClientFilters {
  industry?: string;
  status?: string;
  search?: string;
}

export const INDUSTRIES = [
  { value: 'fintech', label: 'FinTech' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'saas', label: 'SaaS' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'other', label: 'Other' },
] as const;

