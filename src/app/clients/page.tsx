'use client';

import { Search, Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ClientCard } from '@/components/features/ClientCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockClients } from '@/lib/mockData';

export default function ClientsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Clients' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Clients</h1>
          <p className="text-gray-600 mt-2">Manage your clients and their strategic engagements</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by client name or industry..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Industries</option>
          <option>Financial Services</option>
          <option>Healthcare Technology</option>
          <option>Medical Devices</option>
        </select>
        
        <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        
        <div className="flex border border-border rounded-lg">
          <button className="p-2 bg-primary text-white rounded-l-lg">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-gray-600">Showing 1-9 of 47 clients</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">‹</button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">3</button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">6</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}