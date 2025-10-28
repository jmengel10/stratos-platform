/**
 * Project Type Definitions
 */

export interface Project {
  id: string;
  clientId: string;
  tenantId: string;
  name: string;
  description: string;
  type: 'gtm-strategy' | 'operations' | 'fundraising' | 'product' | 'data-analysis' | 'general';
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  startDate: string;
  dueDate?: string;
  completedDate?: string;
  tags: string[];
  metadata?: {
    budget?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string[];
    customFields?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  stats?: {
    conversationCount: number;
    messageCount: number;
    artifactCount: number;
    lastActivity: string;
  };
}

export interface CreateProjectInput {
  clientId: string;
  name: string;
  description: string;
  type: Project['type'];
  startDate?: string;
  dueDate?: string;
  tags?: string[];
  metadata?: Project['metadata'];
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  type?: Project['type'];
  status?: Project['status'];
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  tags?: string[];
  metadata?: Project['metadata'];
}

export interface ProjectFilters {
  clientId?: string;
  type?: string;
  status?: string;
  search?: string;
}

export const PROJECT_TYPES = [
  { value: 'gtm-strategy', label: 'GTM Strategy', icon: '🎯' },
  { value: 'operations', label: 'Operations', icon: '⚙️' },
  { value: 'fundraising', label: 'Fundraising', icon: '💰' },
  { value: 'product', label: 'Product Strategy', icon: '🚀' },
  { value: 'data-analysis', label: 'Data Analysis', icon: '📊' },
  { value: 'general', label: 'General Consulting', icon: '💼' },
] as const;

export const PROJECT_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'completed', label: 'Completed', color: 'blue' },
  { value: 'on-hold', label: 'On Hold', color: 'yellow' },
  { value: 'archived', label: 'Archived', color: 'gray' },
] as const;

