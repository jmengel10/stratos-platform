'use client';

import { Search, Plus, Target, TrendingUp, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

const mockConversations = [
  {
    id: '1',
    agent: 'GTM Strategist',
    title: 'Market Analysis',
    snippet: 'Based on the competitive landscape analysis...',
    timestamp: '2h ago',
    active: true,
    icon: Target,
    color: 'bg-navy'
  },
  {
    id: '2',
    agent: 'Operations Analyst',
    title: 'Process Optimization',
    snippet: 'Let me analyze your current operations...',
    timestamp: '5h ago',
    active: false,
    icon: TrendingUp,
    color: 'bg-green-600'
  },
  {
    id: '3',
    agent: 'Fundraising Advisor',
    title: 'Series B Preparation',
    snippet: 'For your Series B round, we need to...',
    timestamp: 'Yesterday',
    active: false,
    icon: DollarSign,
    color: 'bg-purple-600'
  },
  {
    id: '4',
    agent: 'Product Strategist',
    title: 'Feature Roadmap',
    snippet: 'Based on user feedback and market trends...',
    timestamp: '2 days ago',
    active: false,
    icon: Lightbulb,
    color: 'bg-orange-600'
  },
  {
    id: '5',
    agent: 'Data Analyst',
    title: 'Performance Metrics',
    snippet: 'Your key metrics show significant growth...',
    timestamp: '3 days ago',
    active: false,
    icon: BarChart3,
    color: 'bg-red-600'
  }
];

export default function ConsolePage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Conversations' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Conversations</h1>
          <p className="text-gray-600 mt-2">Chat with AI agents to get strategic insights</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Agents</option>
          <option>GTM Strategist</option>
          <option>Operations Analyst</option>
          <option>Fundraising Advisor</option>
          <option>Product Strategist</option>
          <option>Data Analyst</option>
        </select>
        
        <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Status</option>
          <option>Active</option>
          <option>Recent</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Conversations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockConversations.map((conversation) => {
          const Icon = conversation.icon;
          return (
            <Card key={conversation.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${conversation.color} rounded-full flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{conversation.agent}</p>
                    <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                  </div>
                  <p className="text-sm font-medium text-navy mt-1">{conversation.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{conversation.snippet}</p>
                  {conversation.active && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-gray-600">Showing 1-5 of 12 conversations</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">‹</button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}