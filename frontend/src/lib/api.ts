/**
 * API Client
 * 
 * Centralized HTTP client for backend API calls
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071/api';

class APIClient {
  private client: AxiosInstance;
  private requestCache: Map<string, Promise<any>> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      switch (status) {
        case 401:
          toast.error('Unauthorized. Please log in again.');
          // Redirect to login or refresh token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
          }
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(message || 'An error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }

    console.error('[API Error]', error);
  }

  /**
   * Deduplicated request - prevents multiple identical requests
   */
  private async deduplicatedRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key);
    }

    const promise = requestFn().finally(() => {
      this.requestCache.delete(key);
    });

    this.requestCache.set(key, promise);
    return promise;
  }

  // ===== Authentication =====

  async onboardTenant(data: {
    tenantName: string;
    domain: string;
    ownerEmail: string;
    ownerName: string;
  }): Promise<any> {
    const response = await this.client.post('/tenant/onboard', data);
    return response.data;
  }

  // ===== Chat =====

  async chat(data: {
    message: string;
    agentName?: string;
    conversationId?: string;
    industry?: string;
  }): Promise<any> {
    const response = await this.client.post('/chat', data);
    return response.data;
  }

  async getConversations(): Promise<any[]> {
    const key = 'conversations';
    return this.deduplicatedRequest(key, async () => {
      const response = await this.client.get('/conversations');
      return response.data;
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.client.delete(`/conversations/${conversationId}`);
  }

  // ===== Search & Context =====

  async searchContext(query: string): Promise<any> {
    const response = await this.client.post('/search', { query });
    return response.data;
  }

  // ===== File Upload & Analysis =====

  async uploadDocument(file: File, metadata?: Record<string, any>): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async analyzeData(data: {
    fileId: string;
    analysisType: string;
    options?: Record<string, any>;
  }): Promise<any> {
    const response = await this.client.post('/analyze-data', data);
    return response.data;
  }

  // ===== Deck Generation =====

  async generateDeck(data: {
    conversationId: string;
    template: string;
    customization?: Record<string, any>;
  }): Promise<any> {
    const response = await this.client.post('/generate-deck', data);
    return response.data;
  }

  // ===== User Management =====

  async inviteUser(data: {
    email: string;
    name: string;
    role: string;
  }): Promise<any> {
    const response = await this.client.post('/users/invite', data);
    return response.data;
  }

  async acceptInvite(inviteToken: string): Promise<any> {
    const response = await this.client.post('/users/accept-invite', { inviteToken });
    return response.data;
  }

  async listUsers(): Promise<any[]> {
    const response = await this.client.get('/users');
    return response.data;
  }

  async updateUserRole(userId: string, role: string): Promise<any> {
    const response = await this.client.put(`/users/${userId}/role`, { role });
    return response.data;
  }

  async removeUser(userId: string): Promise<void> {
    await this.client.delete(`/users/${userId}`);
  }

  // ===== Dashboard & Analytics =====

  async getTenantUsage(): Promise<any> {
    const key = 'tenant-usage';
    return this.deduplicatedRequest(key, async () => {
      const response = await this.client.get('/tenant/usage');
      return response.data;
    });
  }

  async getSavedOutputs(): Promise<any[]> {
    const response = await this.client.get('/outputs');
    return response.data;
  }

  async getRecentActivity(): Promise<any[]> {
    const response = await this.client.get('/activity');
    return response.data;
  }

  async deleteOutput(outputId: string): Promise<void> {
    await this.client.delete(`/outputs/${outputId}`);
  }
}

// Export singleton instance
export const api = new APIClient();

