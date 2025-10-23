'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Settings,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  tier: string;
  subscription: {
    status: string;
  };
  usage: {
    projects: number;
    tokens: { total: number };
    storage: number;
  };
  overrides: {
    pricing: { enabled: boolean };
    limits: { enabled: boolean };
  };
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTierColor = (tier: string) => {
    const tierColors = {
      starter: 'text-blue-600',
      pro: 'text-green-600',
      firm: 'text-purple-600',
      enterprise: 'text-orange-600'
    };
    
    return tierColors[tier as keyof typeof tierColors] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#33A7B5]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Admin Dashboard</h1>
          <p className="text-[#6B7280]">Manage clients, subscriptions, and platform configuration</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-[#33A7B5]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6B7280]">Total Clients</p>
                <p className="text-2xl font-semibold text-[#0F172A]">{clients.length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6B7280]">Active Subscriptions</p>
                <p className="text-2xl font-semibold text-[#0F172A]">
                  {clients.filter(c => c.subscription.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6B7280]">Past Due</p>
                <p className="text-2xl font-semibold text-[#0F172A]">
                  {clients.filter(c => c.subscription.status === 'past_due').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6B7280]">With Overrides</p>
                <p className="text-2xl font-semibold text-[#0F172A]">
                  {clients.filter(c => 
                    c.overrides?.pricing?.enabled || c.overrides?.limits?.enabled
                  ).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Global Configuration
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Usage Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Billing Overview
            </Button>
          </div>
        </Card>

        {/* Client List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0F172A]">Recent Clients</h2>
            <Button>View All Clients</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overrides
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.slice(0, 5).map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#0F172A]">{client.name}</div>
                        <div className="text-sm text-[#6B7280]">{client.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getTierColor(client.tier)}`}>
                        {client.tier.charAt(0).toUpperCase() + client.tier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(client.subscription.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                      <div>
                        <div>Projects: {client.usage.projects}</div>
                        <div>Tokens: {Math.round(client.usage.tokens.total / 1000)}K</div>
                        <div>Storage: {Math.round(client.usage.storage / 1024 / 1024 / 1024)}GB</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {client.overrides?.pricing?.enabled && (
                          <Badge className="bg-yellow-100 text-yellow-800">Custom Pricing</Badge>
                        )}
                        {client.overrides?.limits?.enabled && (
                          <Badge className="bg-yellow-100 text-yellow-800">Custom Limits</Badge>
                        )}
                        {!client.overrides?.pricing?.enabled && !client.overrides?.limits?.enabled && (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
