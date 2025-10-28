'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllClientBilling,
  getAllPackages,
  getAllAgents,
  isAdmin 
} from '@/lib/admin-storage';
import { 
  getAllClients, 
  getAllProjects, 
  getAllConversations
} from '@/lib/storage';
import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  DollarSign,
  Package,
  Bot,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalProjects: 0,
    totalConversations: 0,
    monthlyRevenue: 0,
    totalPackages: 0,
    totalAgents: 0,
    activeSubscriptions: 0
  });

  useEffect(() => {
    // Check admin access
    if (!isAdmin()) {
      router.push('/home');
      return;
    }

    // Load stats
    const clients = getAllClients();
    const projects = getAllProjects();
    const conversations = getAllConversations();
    const billing = getAllClientBilling();
    const packages = getAllPackages();
    const agents = getAllAgents();

    // Calculate monthly revenue
    const monthlyRevenue = billing
      .filter(b => b.status === 'active')
      .reduce((sum, b) => sum + b.amount, 0);

    // Count active subscriptions
    const activeSubscriptions = billing.filter(b => b.status === 'active').length;

    setStats({
      totalUsers: clients.length, // Assuming each client is a user
      totalClients: clients.length,
      totalProjects: projects.length,
      totalConversations: conversations.length,
      monthlyRevenue,
      totalPackages: packages.length,
      totalAgents: agents.length,
      activeSubscriptions
    });
  }, [router]);

  const quickActions = [
    {
      title: 'Manage Pricing',
      description: 'Configure pricing packages and features',
      icon: <Package className="w-8 h-8" />,
      href: '/admin/pricing',
      color: 'bg-blue-500'
    },
    {
      title: 'Client Billing',
      description: 'View and manage client subscriptions',
      icon: <DollarSign className="w-8 h-8" />,
      href: '/admin/billing',
      color: 'bg-green-500'
    },
    {
      title: 'AI Agents',
      description: 'Configure AI agents and capabilities',
      icon: <Bot className="w-8 h-8" />,
      href: '/admin/agents',
      color: 'bg-purple-500'
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: <Users className="w-8 h-8" />,
      href: '/admin/users',
      color: 'bg-orange-500'
    },
    {
      title: 'Platform Settings',
      description: 'Configure platform-wide settings',
      icon: <Activity className="w-8 h-8" />,
      href: '/admin/settings',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Admin Dashboard</h1>
        <p className="text-gray-text mt-2">Manage your platform and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Users</p>
              <p className="text-3xl font-bold text-navy">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Active Projects</p>
              <p className="text-3xl font-bold text-navy">{stats.totalProjects}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Conversations</p>
              <p className="text-3xl font-bold text-navy">{stats.totalConversations}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Monthly Revenue</p>
              <p className="text-3xl font-bold text-navy">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Pricing Packages</p>
              <p className="text-2xl font-bold text-navy">{stats.totalPackages}</p>
            </div>
            <Package className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">AI Agents</p>
              <p className="text-2xl font-bold text-navy">{stats.totalAgents}</p>
            </div>
            <Bot className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Active Subscriptions</p>
              <p className="text-2xl font-bold text-navy">{stats.activeSubscriptions}</p>
            </div>
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`${action.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-text">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-serif font-semibold text-navy mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-text mx-auto mb-4" />
          <p className="text-gray-text">Activity monitoring coming soon...</p>
        </div>
      </div>
    </div>
  );
}
