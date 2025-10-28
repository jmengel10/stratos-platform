'use client';

import { TrendingUp, Users, FolderOpen, MessageSquare, DollarSign, Target, BarChart3, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

const stats = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2 this month',
    changeType: 'positive' as const,
    icon: FolderOpen,
    color: 'text-blue-600'
  },
  {
    title: 'Total Clients',
    value: '8',
    change: '+1 this month',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'AI Conversations',
    value: '45',
    change: '+12 this week',
    changeType: 'positive' as const,
    icon: MessageSquare,
    color: 'text-purple-600'
  },
  {
    title: 'Revenue Generated',
    value: '$125K',
    change: '+15% this quarter',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-emerald-600'
  }
];

const recentActivities = [
  {
    id: '1',
    type: 'conversation',
    title: 'GTM Strategy Discussion',
    description: 'New conversation started with GTM Strategist',
    timestamp: '2 hours ago',
    icon: Target,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    type: 'project',
    title: 'Market Analysis Complete',
    description: 'Operations Analyst finished competitive analysis',
    timestamp: '4 hours ago',
    icon: BarChart3,
    color: 'bg-green-500'
  },
  {
    id: '3',
    type: 'client',
    title: 'New Client Onboarded',
    description: 'TechCorp Inc. added to client portfolio',
    timestamp: '1 day ago',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    id: '4',
    type: 'meeting',
    title: 'Strategy Review Scheduled',
    description: 'Weekly strategy review with leadership team',
    timestamp: '2 days ago',
    icon: Calendar,
    color: 'bg-yellow-500'
  }
];

// Placeholder analytics data
const revenueData = [
  { month: 'Jan', revenue: 12 },
  { month: 'Feb', revenue: 18 },
  { month: 'Mar', revenue: 25 },
  { month: 'Apr', revenue: 22 },
  { month: 'May', revenue: 28 },
  { month: 'Jun', revenue: 35 },
];

const projectsByStatus = [
  { status: 'Planned', count: 6 },
  { status: 'Active', count: 12 },
  { status: 'Blocked', count: 2 },
  { status: 'Completed', count: 9 },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard' }
      ]} />

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-navy font-serif">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your strategic consulting activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatsCard
              key={index}
              icon={<Icon className="w-6 h-6" />}
              label={stat.title}
              value={stat.value}
              subtext={stat.change}
              trend={{
                value: stat.change,
                positive: stat.changeType === 'positive'
              }}
            />
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-navy">Revenue Over Time</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#33A7B5" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-navy">Projects by Status</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectsByStatus} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0F172A" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-navy">Recent Activities</h2>
              <button className="text-sm text-primary hover:text-primary-dark">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => { if (typeof window !== 'undefined') window.location.href = '/conversations/new'; }} className="w-full flex items-center space-x-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-left">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Start New Conversation</span>
              </button>
              <button onClick={() => { if (typeof window !== 'undefined') window.location.href = '/projects/new'; }} className="w-full flex items-center space-x-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-left">
                <FolderOpen className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Create Project</span>
              </button>
              <button onClick={() => { if (typeof window !== 'undefined') window.location.href = '/clients/new'; }} className="w-full flex items-center space-x-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-left">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Add Client</span>
              </button>
              <button onClick={() => { if (typeof window !== 'undefined') window.location.href = '/reports'; }} className="w-full flex items-center space-x-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-left">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium">Generate Report</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
