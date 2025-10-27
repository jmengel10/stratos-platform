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
import { Send, Paperclip, ArrowLeft } from 'lucide-react';

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conv = getConversationById(params.id);
    if (conv) {
      setConversation(conv);
    }
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !conversation) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const updatedConv = addMessageToConversation(conversation.id, {
      role: 'user',
      content: userMessage
    });

    if (updatedConv) {
      setConversation(updatedConv);
    }

    // Simulate AI response (replace with real API call later)
    setTimeout(() => {
      const aiResponse = `I understand you're asking about: "${userMessage}". This is a simulated response. In production, this would call the actual AI API.`;
      
      const finalConv = addMessageToConversation(conversation.id, {
        role: 'assistant',
        content: aiResponse
      });

      if (finalConv) {
        setConversation(finalConv);
      }
      setIsLoading(false);
    }, 1000);
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
          <p className="text-gray-text mb-4">Conversation not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600"
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
      <div className="bg-white border-b border-border px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-bg-gray rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-text" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-navy">{conversation.title}</h1>
            <p className="text-sm text-gray-text">
              {client?.name} → {project?.name} → {conversation.agent}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-navy'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{conversation.agentAvatar}</span>
                    <span className="text-sm font-medium text-primary">
                      {conversation.agent}
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-text'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-border rounded-2xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border p-6">
        <div className="max-w-4xl mx-auto flex items-end gap-4">
          <button className="p-3 text-gray-text hover:text-primary">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your strategy..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-text mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-primary text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
