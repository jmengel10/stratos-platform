/**
 * MessageList Component
 * 
 * Displays conversation messages with markdown support, syntax highlighting,
 * and artifact rendering.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  ExternalLink,
  FileText,
  BarChart3,
  Table as TableIcon,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Database,
  Presentation,
} from 'lucide-react'
import { Message, Artifact } from '@/types/message.types'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { DataAnalysisDisplay } from './DataAnalysisDisplay'
import { DeckGeneratorModal } from './DeckGeneratorModal'
import toast from 'react-hot-toast'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  onRegenerate?: (messageId: string) => void
  onFeedback?: (messageId: string, type: 'positive' | 'negative') => void
  onSuggestionClick?: (suggestion: string) => void
}

export function MessageList({ 
  messages, 
  isLoading, 
  onRegenerate,
  onFeedback,
  onSuggestionClick,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {messages.length === 0 && <WelcomeMessage />}
        
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            onRegenerate={onRegenerate}
            onFeedback={onFeedback}
            onSuggestionClick={onSuggestionClick}
          />
        ))}
        
        {isLoading && <LoadingMessage />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

// Welcome message when conversation is empty
function WelcomeMessage() {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
        <Sparkles className="w-8 h-8 text-primary-600" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Welcome to StratOS
      </h2>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        Your AI-powered strategy consulting platform. Select an agent and start asking questions about your business.
      </p>
      
      <div className="grid gap-3 max-w-2xl mx-auto mt-8">
        <SuggestedPrompt
          icon="💡"
          text="Help me develop a go-to-market strategy for my SaaS product"
        />
        <SuggestedPrompt
          icon="📊"
          text="Analyze our operational costs and suggest optimizations"
        />
        <SuggestedPrompt
          icon="💰"
          text="Create a pitch deck structure for Series A fundraising"
        />
        <SuggestedPrompt
          icon="🚀"
          text="Build a product roadmap for the next 6 months"
        />
      </div>
    </div>
  )
}

// Suggested prompt button
function SuggestedPrompt({ icon, text, onClick }: { icon: string; text: string; onClick?: () => void }) {
  return (
    <button
      className="flex items-center gap-3 p-4 text-left bg-white border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
      onClick={onClick || (() => console.log('Suggested prompt:', text))}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-slate-700">{text}</span>
    </button>
  )
}

// Individual message bubble
function MessageBubble({ 
  message,
  onRegenerate,
  onFeedback,
  onSuggestionClick,
}: { 
  message: Message
  onRegenerate?: (messageId: string) => void
  onFeedback?: (messageId: string, type: 'positive' | 'negative') => void
  onSuggestionClick?: (suggestion: string) => void
}) {
  const isUser = message.role === 'user'
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const [showDeckModal, setShowDeckModal] = useState(false)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content)
    setCopiedMessage(true)
    toast.success('Message copied to clipboard')
    setTimeout(() => setCopiedMessage(false), 2000)
  }

  const handleRegenerateClick = () => {
    if (onRegenerate) {
      onRegenerate(message.id)
      toast.success('Regenerating response...')
    }
  }

  const handleFeedbackClick = (type: 'positive' | 'negative') => {
    setFeedback(type)
    if (onFeedback) {
      onFeedback(message.id, type)
      toast.success(type === 'positive' ? 'Thanks for the feedback!' : 'Feedback noted, we\'ll improve')
    }
  }

  const handleGenerateDeck = () => {
    setShowDeckModal(true)
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
        </div>
      </div>
    )
  }

  // Data Analysis message (special rendering)
  if (message.dataAnalysis) {
    return (
      <div className="flex justify-start animate-slide-up">
        <div className="flex items-start gap-3 w-full max-w-full">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Agent badge */}
            <div className="inline-flex items-center gap-1 mb-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <Database className="w-3 h-3" />
              Data Analyst
            </div>
            
            {/* Data analysis display */}
            <DataAnalysisDisplay 
              analysis={message.dataAnalysis}
              onFollowUp={onSuggestionClick}
            />
            
            {/* Metadata */}
            <div className="mt-4 text-xs text-slate-500 flex items-center gap-3">
              <span>{formatRelativeTime(message.timestamp)}</span>
              {message.metadata?.tokensUsed && (
                <span>• {message.metadata.tokensUsed.toLocaleString()} tokens</span>
              )}
              {message.metadata?.duration && (
                <span>• {(message.metadata.duration / 1000).toFixed(1)}s</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular assistant message
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex items-start gap-3 max-w-[90%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <Bot className="w-5 h-5 text-slate-600" />
        </div>
        
        <div className="flex-1">
          {/* Agent name badge */}
          {message.agentName && (
            <div className="inline-flex items-center gap-1 mb-2 px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
              <Bot className="w-3 h-3" />
              {message.agentName}
            </div>
          )}
          
          {/* Message content with markdown */}
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="prose prose-slate max-w-none prose-pre:p-0 prose-pre:m-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const inline = !(props as any).inline
                    const match = /language-(\w+)/.exec(className || '')
                    const codeString = String(children).replace(/\n$/, '')
                    
                    if (!inline && match) {
                      return (
                        <div className="relative group">
                          <button
                            onClick={() => handleCopyCode(codeString)}
                            className="absolute right-2 top-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy code"
                          >
                            {copiedCode === codeString ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !mt-2 !mb-2"
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }
                    
                    return (
                      <code className={cn('px-1 py-0.5 rounded bg-slate-100 text-slate-800', className)} {...props}>
                        {children}
                      </code>
                    )
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                      >
                        {children}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Message Actions (for assistant messages) */}
          <div className="mt-3 flex items-center gap-3 text-xs">
            <button
              onClick={handleCopyMessage}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
              title="Copy message"
            >
              {copiedMessage ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={handleRegenerateClick}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
                title="Regenerate response"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
            )}

            {onFeedback && (
              <>
                <button
                  onClick={() => handleFeedbackClick('positive')}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    feedback === 'positive' ? 'text-green-600' : 'text-slate-500 hover:text-green-600'
                  )}
                  title="Good response"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleFeedbackClick('negative')}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    feedback === 'negative' ? 'text-red-600' : 'text-slate-500 hover:text-red-600'
                  )}
                  title="Bad response"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </>
            )}

            {/* Generate Deck button (for substantial content) */}
            {message.content.length > 300 && (
              <button
                onClick={handleGenerateDeck}
                className="flex items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors"
                title="Generate PowerPoint"
              >
                <Presentation className="w-3 h-3" />
                Generate Deck
              </button>
            )}
          </div>

          {/* Artifacts */}
          {message.artifacts && message.artifacts.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.artifacts.map((artifact, idx) => (
                <ArtifactCard key={idx} artifact={artifact} />
              ))}
            </div>
          )}
          
          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-slate-600 mb-2">💡 Suggested next steps:</div>
              <div className="flex flex-wrap gap-2">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-700 rounded-full transition-colors border border-transparent hover:border-primary-300"
                    onClick={() => {
                      if (onSuggestionClick) {
                        onSuggestionClick(suggestion)
                        toast.success('Added suggestion to input')
                      }
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Metadata and timestamp */}
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-3">
            <span>{formatRelativeTime(message.timestamp)}</span>
            {message.metadata?.tokensUsed && (
              <span>• {message.metadata.tokensUsed.toLocaleString()} tokens</span>
            )}
            {message.metadata?.duration && (
              <span>• {(message.metadata.duration / 1000).toFixed(1)}s</span>
            )}
          </div>

          {/* Deck Generator Modal */}
          <DeckGeneratorModal
            isOpen={showDeckModal}
            onClose={() => setShowDeckModal(false)}
            initialContent={message.content}
            initialTitle={message.agentName ? `${message.agentName} Insights` : 'Strategy Presentation'}
          />
        </div>
      </div>
    </div>
  )
}

// Artifact card component
function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const icons = {
    framework: FileText,
    chart: BarChart3,
    table: TableIcon,
    deck: FileText,
    excel: FileSpreadsheet,
    markdown: FileText,
  }
  
  const Icon = icons[artifact.type] || FileText
  
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate">{artifact.title}</h4>
            <p className="text-sm text-slate-600 capitalize">{artifact.type}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="View artifact"
            onClick={() => {
              // TODO: Open artifact viewer
              console.log('View artifact:', artifact)
            }}
          >
            <ExternalLink className="w-4 h-4 text-slate-600" />
          </button>
          {artifact.exportable && (
            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Export artifact"
              onClick={() => {
                // TODO: Export artifact
                console.log('Export artifact:', artifact)
              }}
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading indicator
function LoadingMessage() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <Bot className="w-5 h-5 text-slate-600" />
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-slate-600">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

