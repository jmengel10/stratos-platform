/**
 * Client Model
 * Represents a client in the system - top level of the hierarchy
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

