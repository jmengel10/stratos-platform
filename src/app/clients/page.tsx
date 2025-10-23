'use client';

import { Search, Plus, Grid, List, FolderOpen, MessageSquare, Clock } from 'lucide-react';

export default function ClientsPage() {
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
        </select>
        <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="flex items-center space-x-1">
          <button className="p-2 bg-[#33A7B5] text-white rounded-lg">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              A
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Acme Corporation</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Financial Services</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>6 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>18 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 2 days ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              T
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">TechVentures Group</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Healthcare Technology</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>8 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>24 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 1 week ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#6B7280] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              H
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">HealthFirst Systems</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Medical Devices</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>12 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>32 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 3 days ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Row 2 */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#6B7280] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              G
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">GlobalTech Partners</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Enterprise Software</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>10 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>28 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active Yesterday</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              M
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">MedCore Solutions</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Healthcare IT</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>14 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>40 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 4 days ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              I
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">InnovateCo</h3>
            <p className="text-[#33A7B5] text-sm mb-3">SaaS Platform</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>7 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>22 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active Today</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Row 3 */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#6B7280] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              F
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Fintech Dynamics</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Fintech</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>9 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>26 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 5 days ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#6B7280] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              E
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Enterprise Solutions Inc</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Enterprise Solutions</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>11 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>34 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 2 weeks ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
              N
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">NexGen Industries</h3>
            <p className="text-[#33A7B5] text-sm mb-3">Manufacturing</p>
            <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-4">
              <div className="flex items-center space-x-1">
                <FolderOpen className="w-4 h-4" />
                <span>8 Projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>20 Conversations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6B7280] mb-4">
              <Clock className="w-4 h-4" />
              <span>Active 1 day ago</span>
            </div>
            <button className="w-full border border-[#33A7B5] text-[#33A7B5] px-4 py-2 rounded-lg hover:bg-[#33A7B5] hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-[#6B7280]">Showing 1-9 of 47 clients</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">‹</button>
          <button className="px-3 py-1 text-sm bg-[#33A7B5] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">...</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">6</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}
