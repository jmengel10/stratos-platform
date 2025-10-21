/**
 * StratOS Platform - Type Definitions
 */

// Export new hierarchy models
export * from './client.model';
export * from './project.model';

// ============================================
// User & Tenant Models
// ============================================

export interface User {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Tenant {
  id: string;
  tenantId: string; // Same as id for partition key
  name: string;
  industry?: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  usage: {
    requestsThisMonth: number;
    storageUsedMB: number;
    lastResetDate: string;
  };
  quota: {
    maxRequestsPerMonth: number;
    maxStorageMB: number;
  };
  settings: {
    allowedOrigins?: string[];
    customPrompts?: Record<string, string>;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Conversation Models
// ============================================

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface Conversation {
  id: string;
  tenantId: string;
  userId: string;
  projectId: string;
  clientId: string;
  agentName: string;
  title: string;
  messages: Message[];
  context?: {
    industry?: string;
    previousAgents?: string[];
    customData?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

// ============================================
// Artifact Models
// ============================================

export type ArtifactType = 'framework' | 'chart' | 'table' | 'deck' | 'excel' | 'markdown';

export interface Artifact {
  type: ArtifactType;
  title: string;
  data: any;
  exportable: boolean;
  metadata?: {
    source?: string;
    generatedAt?: string;
    version?: string;
  };
}

export interface Output {
  id: string;
  tenantId: string;
  userId: string;
  conversationId: string;
  agentName: string;
  content: string;
  artifacts: Artifact[];
  suggestions?: string[];
  nextAgent?: string;
  metadata: {
    tokensUsed?: number;
    duration?: number;
    model?: string;
  };
  createdAt: string;
}

// ============================================
// Agent Models
// ============================================

export interface AgentContext {
  tenantId: string;
  userId: string;
  industry?: string;
  previousContext?: any;
  conversationHistory?: Message[];
  customPrompts?: Record<string, string>;
}

export interface AgentResponse {
  content: string;
  artifacts?: Artifact[];
  suggestions?: string[];
  nextAgent?: string;
  metadata?: {
    tokensUsed?: number;
    duration?: number;
    model?: string;
  };
}

// ============================================
// Document & Search Models
// ============================================

export interface Document {
  id: string;
  tenantId: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  content: string;
  embedding?: number[];
  metadata: {
    title?: string;
    author?: string;
    tags?: string[];
    industry?: string;
    documentType?: string;
  };
  blobUrl: string;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  document: any;
  score: number;
  highlights?: string[];
}

// ============================================
// Prompt Models
// ============================================

export interface Prompt {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
  industry?: string;
  agentName?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Request/Response Models
// ============================================

export interface ChatRequest {
  message: string;
  agentName?: string;
  industry?: string;
  conversationId?: string;
  previousContext?: any;
  stream?: boolean;
}

export interface ChatResponse {
  agentName: string;
  response: AgentResponse;
  conversationId: string;
  suggestions?: string[];
  nextAgent?: string;
}

export interface SearchRequest {
  query: string;
  filters?: {
    tenantId?: string;
    industry?: string;
    documentType?: string;
    tags?: string[];
  };
  limit?: number;
  useVector?: boolean;
}

export interface UploadRequest {
  fileName: string;
  fileType: string;
  content: Buffer;
  metadata?: {
    title?: string;
    tags?: string[];
    documentType?: string;
  };
}

// ============================================
// Error Models
// ============================================

export class StratOSError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'StratOSError';
  }
}

export class AuthenticationError extends StratOSError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends StratOSError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends StratOSError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends StratOSError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 'RATE_LIMIT_ERROR', 429, details);
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends StratOSError {
  constructor(message: string, details?: any) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

