'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getConversationById, 
  addMessageToConversation,
  getProjectById,
  getClientById,
  getAllConversations,
  type Conversation
} from '@/lib/storage';
import { sendMessageToAI, type AIStreamChunk } from '@/lib/azure-ai-service';
import { Send, Paperclip, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, streamingContent]);

  const loadConversation = () => {
    const conv = getConversationById(params.id);
    if (conv) {
      setConversation(conv);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !conversation || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    setIsLoading(true);
    setStreamingContent('');

    // Add user message immediately
    let updatedConv = addMessageToConversation(conversation.id, {
      role: 'user',
      content: userMessage
    });

    if (updatedConv) {
      setConversation(updatedConv);
    }

    try {
      // Get conversation history for context
      const conversationHistory = updatedConv?.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })) || [];

      // Get agent ID from conversation (fallback to default if not set)
      const agentId = (conversation as any).agentId || 'agent_gtm';

      let fullResponse = '';

      // Call AI with streaming
      fullResponse = await sendMessageToAI(
        agentId,
        conversationHistory,
        (chunk: AIStreamChunk) => {
          if (chunk.type === 'content' && chunk.content) {
            setStreamingContent(prev => prev + chunk.content);
          } else if (chunk.type === 'error') {
            setError(chunk.error || 'An error occurred');
          }
        }
      );

      // Add AI response to conversation
      const finalConv = addMessageToConversation(conversation.id, {
        role: 'assistant',
        content: fullResponse
      });

      if (finalConv) {
        setConversation(finalConv);
      }

      setStreamingContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
      console.error('AI Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">Conversation not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#33A7B5] text-white rounded-lg hover:bg-[#2A92A3]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const project = getProjectById(conversation.projectId);
  const client = getClientById(conversation.clientId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[#0F172A]">{conversation.title}</h1>
            <p className="text-sm text-[#6B7280]">
              {client?.name} → {project?.name} → {conversation.agent}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-[#33A7B5] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#0F172A] shadow-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{conversation.agentAvatar}</span>
                    <span className="text-sm font-medium text-[#33A7B5]">
                      {conversation.agent}
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-[#9CA3AF]'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming response */}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{conversation.agentAvatar}</span>
                  <span className="text-sm font-medium text-[#33A7B5]">
                    {conversation.agent}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-[#0F172A]">{streamingContent}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="w-3 h-3 text-[#33A7B5] animate-spin" />
                  <span className="text-xs text-[#9CA3AF]">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator (when not streaming) */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#33A7B5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#33A7B5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#33A7B5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#E5E7EB] p-6">
        <div className="max-w-4xl mx-auto flex items-end gap-4">
          <button className="p-3 text-[#6B7280] hover:text-[#33A7B5] transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your strategy..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#33A7B5] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              rows={3}
            />
            <p className="text-xs text-[#9CA3AF] mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-[#33A7B5] text-white rounded-full hover:bg-[#2A92A3] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}