/**
 * Project Model
 * Represents a project within a client - middle level of the hierarchy
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
}

export interface CreateProjectInput {
  clientId: string;
  name: string;
  description: string;
  type: Project['type'];
  startDate: string;
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

