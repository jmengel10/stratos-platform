'use client';

import { Search, Plus, Grid, List, FolderOpen, MessageSquare, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockClients } from '@/lib/mockData';

export default function ClientsPage() {
  const router = useRouter();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-[#0F172A] font-serif">Clients</h1>
          <p className="text-[#6B7280] mt-2">Manage your clients and their strategic engagements</p>
        </div>
        <button className="bg-[#33A7B5] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#33A7B5]/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
          <input
            type="text"
            placeholder="Search by client name or industry..."
            className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg bg-[#F3F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
          />
        </div>

        <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
          <option>All Industries</option>
          <option>Financial Services</option>
          <option>Healthcare Technology</option>
          <option>Medical Devices</option>
          <option>Enterprise Software</option>
        </select>

        <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="flex items-center border border-[#E5E7EB] rounded-lg p-1">
          <button className="bg-[#33A7B5] text-white p-2 rounded-md">
            <Grid className="w-4 h-4" />
          </button>
          <button className="text-[#6B7280] p-2 rounded-md hover:bg-[#F3F4F6]">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClients.map((client) => (
          <div 
            key={client.id} 
            className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/clients/${client.id}`)}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4"
                style={{ backgroundColor: client.avatarColor }}
              >
                {client.avatar}
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-1">{client.name}</h3>
              <p className="text-[#33A7B5] text-sm mb-3">{client.industry}</p>
              <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
                <div className="flex items-center space-x-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>{client.projects} Projects</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{client.conversations} Conversations</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
                <Clock className="w-4 h-4" />
                <span>Active {client.lastActive}</span>
              </div>
              <button 
                className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/clients/${client.id}`);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-[#6B7280]">Showing 1-6 of {mockClients.length} clients</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">
            ‹
          </button>
          <button className="px-3 py-1 text-sm bg-[#33A7B5] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">2</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">3</button>
          <span className="text-sm text-[#6B7280]">...</span>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">6</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}