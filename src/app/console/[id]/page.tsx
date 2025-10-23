import { MessageSquare, Send, Plus, MoreVertical, Clock, User, FileText, Target, TrendingUp, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';

export async function generateStaticParams() {
  return [
    { id: 'gtm-strategy-chat' },
    { id: 'operations-analysis' },
    { id: 'fundraising-advisory' },
    { id: 'product-strategy' },
    { id: 'data-analysis' }
  ];
}

export default function ConversationPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-[#6B7280]">
        Home &gt; Conversations &gt; GTM Strategy Chat
      </div>

      {/* Chat Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] font-serif">GTM Strategy Chat</h1>
              <p className="text-[#6B7280] mt-1">Strategic go-to-market planning and execution</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-[#6B7280] hover:text-[#0F172A] hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg h-96 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* AI Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-sm font-medium">
              AI
            </div>
            <div className="flex-1">
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <p className="text-[#0F172A]">Hello! I&apos;m your GTM Strategy AI assistant. I can help you with market analysis, competitive positioning, pricing strategies, and go-to-market planning. What would you like to work on today?</p>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">2 minutes ago</p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-start space-x-3 justify-end">
            <div className="flex-1 max-w-md">
              <div className="bg-[#33A7B5] text-white rounded-lg p-4">
                <p>I need help developing a go-to-market strategy for our new SaaS product. We&apos;re targeting mid-market companies in the healthcare sector.</p>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 text-right">1 minute ago</p>
            </div>
            <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-sm font-medium">
              SC
            </div>
          </div>

          {/* AI Response */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-sm font-medium">
              AI
            </div>
            <div className="flex-1">
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <p className="text-[#0F172A] mb-3">Excellent! Healthcare SaaS for mid-market companies is a great opportunity. Let me help you develop a comprehensive GTM strategy. Here&apos;s what I recommend we cover:</p>
                <ul className="list-disc list-inside text-[#0F172A] space-y-1">
                  <li>Market segmentation and ideal customer profile</li>
                  <li>Competitive landscape analysis</li>
                  <li>Pricing strategy and positioning</li>
                  <li>Sales and marketing channel strategy</li>
                  <li>Launch timeline and milestones</li>
                </ul>
                <p className="text-[#0F172A] mt-3">Which area would you like to start with?</p>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">Just now</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full pl-4 pr-12 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#0F172A]">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button className="bg-[#33A7B5] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#33A7B5]/90 transition-colors">
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-[#33A7B5]" />
            <span className="text-[#0F172A] font-medium">Market Analysis</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Analyze market size and opportunities</p>
        </button>

        <button className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-[#33A7B5]" />
            <span className="text-[#0F172A] font-medium">Competitive Analysis</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Research competitors and positioning</p>
        </button>

        <button className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-[#33A7B5]" />
            <span className="text-[#0F172A] font-medium">Pricing Strategy</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Develop pricing models and tiers</p>
        </button>
      </div>
    </div>
  );
}
