/**
 * Dashboard Store
 * 
 * State management for dashboard data, usage stats, and saved outputs
 */

import { create } from 'zustand'

export interface UsageStats {
  queriesThisMonth: number
  queriesTotal: number
  monthlyLimit: number
  storageUsedMB: number
  storageQuotaGB: number
  topAgents: Array<{ name: string; count: number }>
  usageHistory: Array<{ date: string; queries: number; exports: number }>
}

export interface SavedOutput {
  id: string
  title: string
  type: 'deck' | 'analysis' | 'framework'
  agentName: string
  createdAt: string
  preview?: string
}

export interface RecentActivity {
  id: string
  type: 'conversation' | 'export' | 'upload'
  description: string
  timestamp: string
  agentName?: string
}

interface DashboardState {
  usageStats: UsageStats | null
  savedOutputs: SavedOutput[]
  recentActivity: RecentActivity[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchUsageStats: () => Promise<void>
  fetchSavedOutputs: () => Promise<void>
  fetchRecentActivity: () => Promise<void>
  deleteOutput: (outputId: string) => Promise<void>
  refreshAll: () => Promise<void>
  clearError: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  usageStats: null,
  savedOutputs: [],
  recentActivity: [],
  isLoading: false,
  error: null,

  /**
   * Fetch usage statistics from API
   */
  fetchUsageStats: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // TODO: Replace with actual API call
      // const stats = await api.getTenantUsage()
      
      // Mock data for now
      const stats: UsageStats = {
        queriesThisMonth: 127,
        queriesTotal: 456,
        monthlyLimit: 500,
        storageUsedMB: 245,
        storageQuotaGB: 50,
        topAgents: [
          { name: 'GTM Strategist', count: 45 },
          { name: 'Data Analyst', count: 32 },
          { name: 'Ops Analyst', count: 28 },
          { name: 'Product Strategist', count: 15 },
          { name: 'Fundraising Advisor', count: 7 },
        ],
        usageHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          queries: Math.floor(Math.random() * 20) + 5,
          exports: Math.floor(Math.random() * 5),
        })),
      }
      
      set({ usageStats: stats, isLoading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch usage stats', isLoading: false })
    }
  },

  /**
   * Fetch saved outputs
   */
  fetchSavedOutputs: async () => {
    try {
      // TODO: Replace with actual API call
      // const outputs = await api.getSavedOutputs()
      
      // Mock data
      const outputs: SavedOutput[] = [
        {
          id: '1',
          title: 'GTM Strategy for SaaS Product',
          type: 'framework',
          agentName: 'GTM Strategist',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          preview: 'Complete go-to-market strategy including...',
        },
        {
          id: '2',
          title: 'Q1 Financial Analysis',
          type: 'analysis',
          agentName: 'Data Analyst',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          preview: 'Revenue analysis showing 15% growth...',
        },
        {
          id: '3',
          title: 'Series A Pitch Deck',
          type: 'deck',
          agentName: 'Fundraising Advisor',
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
      ]
      
      set({ savedOutputs: outputs })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch saved outputs' })
    }
  },

  /**
   * Fetch recent activity
   */
  fetchRecentActivity: async () => {
    try {
      // TODO: Replace with actual API call
      // const activity = await api.getRecentActivity()
      
      // Mock data
      const activity: RecentActivity[] = [
        {
          id: '1',
          type: 'conversation',
          description: 'Started conversation with GTM Strategist',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          agentName: 'GTM Strategist',
        },
        {
          id: '2',
          type: 'export',
          description: 'Exported deck: Series A Pitch',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'upload',
          description: 'Uploaded data: sales-data.csv',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      
      set({ recentActivity: activity })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch recent activity' })
    }
  },

  /**
   * Delete a saved output
   */
  deleteOutput: async (outputId: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.deleteOutput(outputId)
      
      const outputs = get().savedOutputs.filter(o => o.id !== outputId)
      set({ savedOutputs: outputs })
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete output' })
    }
  },

  /**
   * Refresh all dashboard data
   */
  refreshAll: async () => {
    await Promise.all([
      get().fetchUsageStats(),
      get().fetchSavedOutputs(),
      get().fetchRecentActivity(),
    ])
  },

  /**
   * Clear error state
   */
  clearError: () => set({ error: null }),
}))

