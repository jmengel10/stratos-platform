'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllConversations, type Conversation } from '@/lib/storage';
import { Plus, MessageSquare, Search } from 'lucide-react';

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load conversations from storage
    const loadedConversations = getAllConversations();
    setConversations(loadedConversations);
  }, []);

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Conversations</h1>
          <p className="text-gray-text mt-2">View all your AI-powered conversations</p>
        </div>
        <button 
          onClick={() => {
            console.log('New Chat button clicked');
            router.push('/conversations/new');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No conversations yet</h3>
          <p className="text-gray-text mb-6">Start your first AI-powered conversation</p>
          <button 
            onClick={() => router.push('/conversations/new')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Your First Chat
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => router.push(`/conversations/${conversation.id}`)}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: conversation.agentColor }}
                >
                  {conversation.agentAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-navy truncate">{conversation.title}</h3>
                    <span className="text-sm text-gray-text">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-text mb-2">{conversation.preview}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-text">
                    <span>{conversation.clientName}</span>
                    <span>→</span>
                    <span>{conversation.projectName}</span>
                    <span>→</span>
                    <span>{conversation.agent}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
