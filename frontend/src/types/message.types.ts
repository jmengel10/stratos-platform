/**
 * Message and Artifact Types
 */

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  agentName?: string
  artifacts?: Artifact[]
  suggestions?: string[]
  timestamp: Date
  isStreaming?: boolean
  dataAnalysis?: any
  metadata?: {
    tokensUsed?: number
    duration?: number
    model?: string
  }
}

export type ArtifactType = 'framework' | 'chart' | 'table' | 'deck' | 'excel' | 'markdown'

export interface Artifact {
  type: ArtifactType
  title: string
  data: any
  exportable: boolean
  metadata?: {
    source?: string
    generatedAt?: string
    version?: string
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  selectedAgent: string | null
  industry: string | null
  isLoading: boolean
  createdAt: Date
  updatedAt: Date
}

