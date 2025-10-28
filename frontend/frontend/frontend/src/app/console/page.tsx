'use client';

import { useState } from 'react';
import { Send, Bot, User, Download, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

const mockMessages = [
  {
    id: '1',
    type: 'ai',
    content: 'Hello! I\'m your GTM Strategist. I can help you with market entry strategies, competitive analysis, pricing models, and go-to-market planning. What would you like to work on today?',
    timestamp: '10:30 AM',
    agent: 'GTM Strategist'
  },
  {
    id: '2',
    type: 'user',
    content: 'We\'re launching a new SaaS product and need help with our pricing strategy. We\'re competing against established players like Salesforce and HubSpot.',
    timestamp: '10:32 AM'
  },
  {
    id: '3',
    type: 'ai',
    content: 'Great! Pricing strategy is crucial for SaaS success. Let me help you develop a competitive pricing model. First, let me understand your product better:\n\n1. What\'s your core value proposition?\n2. What features differentiate you from Salesforce/HubSpot?\n3. What\'s your target customer segment?\n4. What\'s your current pricing structure (if any)?',
    timestamp: '10:33 AM',
    agent: 'GTM Strategist'
  }
];

const agentOptions = [
  { id: 'gtm', name: 'GTM Strategist', description: 'Market entry, pricing, competitive analysis' },
  { id: 'ops', name: 'Operations Analyst', description: 'Process optimization, workflow analysis' },
  { id: 'fundraising', name: 'Fundraising Advisor', description: 'Investor relations, pitch preparation' },
  { id: 'product', name: 'Product Strategist', description: 'Roadmap planning, feature prioritization' },
  { id: 'data', name: 'Data Analyst', description: 'Analytics, insights, reporting' }
];

export default function ConsolePage() {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('gtm');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: 'I understand. Let me analyze this and provide you with strategic recommendations. Based on your input, I suggest we focus on three key areas: competitive positioning, value-based pricing, and market segmentation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: agentOptions.find(a => a.id === selectedAgent)?.name || 'AI Agent'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] p-4">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Console' }
        ]} />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-navy">AI Console</h1>
            <p className="text-gray-600">Chat with AI agents for strategic insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]"
            >
              {agentOptions.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp}
                  {message.agent && (
                    <span className="ml-2 text-blue-600">• {message.agent}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#E5E7EB] p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send • {agentOptions.find(a => a.id === selectedAgent)?.description}
        </div>
      </div>
    </div>
  );
}
