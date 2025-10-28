'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { 
  getConversationById, 
  addMessageToConversation,
  getProjectById,
  getClientById,
  type Conversation
} from '@/lib/storage';
import { sendMessageToAI, type AIStreamChunk } from '@/lib/azure-ai-service';
import { Send, Paperclip, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ConversationClient({ params }: { params: { id: string } }) {
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

  const loadConversation = async () => {
    try {
      const conv = getConversationById(params.id);
      if (conv) {
        setConversation(conv);
      } else {
        setError('Conversation not found');
      }
    } catch (err) {
      setError('Failed to load conversation');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    const updatedConversation = addMessageToConversation(params.id, userMessage);
    setConversation(updatedConversation);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Get project and client context
      const project = conversation?.projectId ? getProjectById(conversation.projectId) : null;
      const client = project?.clientId ? getClientById(project.clientId) : null;

      let aiResponse = '';
      const stream = await sendMessageToAI(
        'default-agent',
        updatedConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        (chunk) => {
          if (chunk.type === 'content') {
            aiResponse += chunk.content;
            setStreamingContent(aiResponse);
          }
        }
      );

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant' as const,
        timestamp: new Date().toISOString(),
      };

      const finalConversation = addMessageToConversation(params.id, aiMessage);
      setConversation(finalConversation);
      setStreamingContent('');
    } catch (err) {
      setError('Failed to send message');
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

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-text" />
          </button>
          <h1 className="text-4xl font-serif font-bold text-navy">Conversation</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-text" />
          </button>
          <h1 className="text-4xl font-serif font-bold text-navy">Conversation</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-text" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">
              {conversation.title || 'Conversation'}
            </h1>
            <p className="text-sm text-gray-text">
              {conversation.messages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-primary-100' : 'text-gray-text'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Streaming response */}
          {isLoading && streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-3 rounded-lg bg-white border border-border">
                <div className="whitespace-pre-wrap">{streamingContent}</div>
                <div className="text-xs mt-2 text-gray-text">
                  <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                  AI is typing...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    </div>
  );
}
