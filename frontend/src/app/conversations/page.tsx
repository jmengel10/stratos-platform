'use client';
import { useState, useEffect } from 'react';
import { getAllConversations, type Conversation } from '@/lib/storage';
import { Plus, MessageSquare, Search } from 'lucide-react';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'support' | 'info'>('support');

  useEffect(() => {
    const loadedConversations = getAllConversations();
    setConversations(loadedConversations);
  }, []);

  const handleNewChat = () => {
    try {
      if (typeof window !== 'undefined') {
        window.location.href = '/conversations/new';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Navigation failed. Please try refreshing the page.');
    }
  };

  const handleConversationClick = (conversationId: string) => {
    console.log('Conversation clicked:', conversationId);
    try {
      if (typeof window !== 'undefined') {
        window.location.href = `/conversations/${conversationId}`;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

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
          onClick={handleNewChat}
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
            onClick={handleNewChat}
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
              onClick={() => handleConversationClick(conversation.id)}
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

      {/* Compact Support/Info Tabs */}
      <div className="mt-10">
        <div className="bg-white border border-border rounded-lg">
          <div className="flex border-b border-border text-sm">
            <button
              className={`px-4 py-2 ${activeTab === 'support' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('support')}
            >
              Support
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('info')}
            >
              Info
            </button>
          </div>
          <div className="p-4 text-sm text-gray-700">
            {activeTab === 'support' ? (
              <div className="space-y-2">
                <p>Need help? Visit the Help Center or open a support ticket.</p>
                <div className="flex gap-2">
                  <a href="/help" className="px-3 py-2 border border-border rounded hover:bg-gray-50">Help Center</a>
                  <a href="/support" className="px-3 py-2 border border-border rounded hover:bg-gray-50">Contact Support</a>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-gray-600">Tips: Use search to filter conversations. Click any row to open.</p>
                <p className="text-gray-600">New: Quick actions are available on the dashboard.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
