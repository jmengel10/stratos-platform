'use client';

import { useState } from 'react';

import { 
  Search, 
  Plus, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Lightbulb, 
  BarChart3,
  Settings,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  FileText,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

const mockConversations = [
  {
    id: '1',
    agent: 'GTM Strategist',
    title: 'Market Analysis',
    snippet: 'Based on the competitive...',
    timestamp: '2h ago',
    active: true,
    icon: Target,
    color: 'bg-navy'
  },
  {
    id: '2',
    agent: 'Operations Analyst',
    title: 'Process Optimization',
    snippet: 'Let me analyze your current...',
    timestamp: '5h ago',
    active: false,
    icon: TrendingUp,
    color: 'bg-green-600'
  },
  {
    id: '3',
    agent: 'Fundraising Advisor',
    title: 'Series B Preparation',
    snippet: 'For your Series B round...',
    timestamp: 'Yesterday',
    active: false,
    icon: DollarSign,
    color: 'bg-purple-600'
  },
  {
    id: '4',
    agent: 'Product Strategist',
    title: 'Feature Roadmap',
    snippet: 'Based on user feedback...',
    timestamp: '2 days ago',
    active: false,
    icon: Lightbulb,
    color: 'bg-orange-600'
  },
  {
    id: '5',
    agent: 'Data Analyst',
    title: 'Performance Metrics',
    snippet: 'Your key metrics show...',
    timestamp: '3 days ago',
    active: false,
    icon: BarChart3,
    color: 'bg-red-600'
  }
];

export default function ChatConsolePage() {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-navy font-serif mb-4">Conversations</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button variant="primary" className="w-full flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex space-x-1 mb-4">
              <button className="px-3 py-1 bg-primary text-white text-sm rounded-lg">All</button>
              <button className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded-lg">Active</button>
              <button className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded-lg">Archived</button>
            </div>
            
            <div className="space-y-2">
              {mockConversations.map((conversation) => {
                const Icon = conversation.icon;
                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      conversation.active 
                        ? 'bg-primary/10 border-l-4 border-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${conversation.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{conversation.agent}</p>
                          <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                        </div>
                        <p className="text-sm font-medium text-navy">{conversation.title}</p>
                        <p className="text-xs text-gray-600 truncate">{conversation.snippet}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Breadcrumb items={[
              { label: 'Acme Corp', href: '/clients/1' },
              { label: 'GTM Strategy 2024', href: '/projects/1' },
              { label: 'Market Analysis' }
            ]} />
            <div className="flex items-center space-x-3">
              <Button variant="primary" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>GTM Strategist</span>
              </Button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-primary text-white p-4 rounded-lg max-w-2xl">
              <p>
                Help me analyze the target market for our new healthcare product. I need to understand the competitive landscape and identify our ideal customer profile.
              </p>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border p-4 rounded-lg max-w-2xl">
              <p className="mb-4">
                I&apos;ll help you analyze the target market. Let me break this down into key areas:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-navy font-serif">Competitive Landscape</h4>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    <li>• Major competitors in healthcare IT</li>
                    <li>• Their positioning and strengths</li>
                    <li>• Market gaps and opportunities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-navy font-serif">Ideal Customer Profile</h4>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    <li>• Enterprise hospital systems (500+ beds)</li>
                    <li>• Annual revenue $500M+</li>
                    <li>• Current pain points with data management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Artifact Card */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <Card className="p-4 bg-blue-50 border-l-4 border-primary max-w-2xl">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-semibold text-navy">Market Analysis Framework</h4>
                  <p className="text-sm text-gray-600">Generated framework for competitive analysis</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-border p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Paperclip className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Ask anything about your strategy..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button variant="primary" className="p-2">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
