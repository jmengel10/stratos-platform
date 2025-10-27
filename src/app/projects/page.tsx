'use client';

import { Search, Plus, FolderOpen, MessageSquare, Clock, Grid, List, ChevronLeft, ChevronRight, Target, TrendingUp, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';

const mockProjects = [
  { 
    id: 'gtm-strategy-2024', 
    title: 'GTM Strategy 2024', 
    client: 'Acme Corporation', 
    status: 'Active', 
    statusColor: 'bg-green-500', 
    progress: 60, 
    conversations: 8, 
    members: 3, 
    start: 'Jan 2024', 
    end: 'Mar 2024', 
    lastActive: '3 hours ago',
    tags: ['GTM Strategy', 'Transformation'],
    description: 'Comprehensive go-to-market strategy development for Q1-Q2 2024'
  },
  { 
    id: 'operations-review-q1', 
    title: 'Operations Review Q1', 
    client: 'TechVentures Group', 
    status: 'In Progress', 
    statusColor: 'bg-blue-500', 
    progress: 35, 
    conversations: 5, 
    members: 2, 
    start: 'Feb 2024', 
    end: 'Apr 2024', 
    lastActive: '2 days ago',
    tags: ['Operations', 'Review'],
    description: 'Quarterly operations assessment and optimization recommendations'
  },
  { 
    id: 'digital-transformation', 
    title: 'Digital Transformation', 
    client: 'HealthFirst Systems', 
    status: 'Active', 
    statusColor: 'bg-green-500', 
    progress: 80, 
    conversations: 12, 
    members: 4, 
    start: 'Dec 2023', 
    end: 'Feb 2024', 
    lastActive: 'Yesterday',
    tags: ['Technology', 'Transformation'],
    description: 'Digital transformation roadmap and implementation strategy'
  },
  { 
    id: 'board-advisory-series-b', 
    title: 'Board Advisory - Series B', 
    client: 'GlobalTech Partners', 
    status: 'Planning', 
    statusColor: 'bg-yellow-500', 
    progress: 25, 
    conversations: 3, 
    members: 2, 
    start: 'Mar 2024', 
    end: 'Jun 2024', 
    lastActive: '1 week ago',
    tags: ['Advisory', 'Fundraising'],
    description: 'Board advisory services for Series B fundraising preparation'
  },
  { 
    id: 'ma-due-diligence', 
    title: 'M&A Due Diligence', 
    client: 'MedCore Solutions', 
    status: 'Completed', 
    statusColor: 'bg-gray-500', 
    progress: 100, 
    conversations: 15, 
    members: 5, 
    start: 'Nov 2023', 
    end: 'Jan 2024', 
    lastActive: 'Today',
    tags: ['M&A', 'Due Diligence'],
    description: 'Merger and acquisition due diligence and valuation analysis'
  },
  { 
    id: 'strategic-planning-2025', 
    title: 'Strategic Planning 2025', 
    client: 'InnovateCo', 
    status: 'Planning', 
    statusColor: 'bg-yellow-500', 
    progress: 15, 
    conversations: 4, 
    members: 3, 
    start: 'Mar 2024', 
    end: 'May 2024', 
    lastActive: '3 days ago',
    tags: ['Strategy', 'Planning'],
    description: 'Annual strategic planning and roadmap development for 2025'
  },
];

export default function ProjectsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-[#0F172A] font-serif">Projects</h1>
          <p className="text-[#6B7280] mt-2">Manage your strategic consulting projects and engagements</p>
        </div>
        <button className="bg-[#33A7B5] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#33A7B5]/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
          <input
            type="text"
            placeholder="Search by project name or client..."
            className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg bg-[#F3F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
          />
        </div>

        <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
          <option>All Status</option>
          <option>Active</option>
          <option>In Progress</option>
          <option>Planning</option>
          <option>Completed</option>
        </select>

        <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5]">
          <option>All Clients</option>
          <option>Acme Corporation</option>
          <option>TechVentures Group</option>
          <option>HealthFirst Systems</option>
          <option>GlobalTech Partners</option>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <div key={project.id} className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <FolderOpen className="w-6 h-6 text-[#33A7B5]" />
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${project.statusColor}`}></div>
                <span className="text-xs text-[#6B7280]">{project.status}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{project.title}</h3>
            <p className="text-sm text-[#6B7280] mb-3">@{project.client}</p>
            <p className="text-sm text-[#6B7280] mb-4">{project.description}</p>
            
            <div className="flex items-center space-x-2 mb-3">
              {project.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div className="bg-[#33A7B5] h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-[#6B7280] mb-3">
              <span>{project.conversations} conversations</span>
              <span>{project.members} members</span>
            </div>
            
            <p className="text-xs text-[#6B7280] mb-1">Started {project.start} • Due {project.end}</p>
            <p className="text-xs text-[#6B7280]">Active {project.lastActive}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-[#6B7280]">Showing 1-6 of 24 projects</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 text-sm bg-[#33A7B5] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">2</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">3</button>
          <span className="text-sm text-[#6B7280]">...</span>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">4</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-[#F3F4F6] text-[#6B7280]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
