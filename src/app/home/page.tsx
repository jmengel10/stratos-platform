'use client';

import { Target, FolderOpen, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockClients, mockProjects } from '@/lib/mockData';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-5xl font-bold text-[#0F172A] font-serif">Welcome back, Sarah</h1>
        <p className="text-[#6B7280] mt-2">Here&apos;s what&apos;s happening with your work today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Total Clients</p>
              <p className="text-4xl font-bold text-[#0F172A]">{mockClients.length}</p>
              <p className="text-sm text-green-600">↑+2</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Active Projects</p>
              <p className="text-4xl font-bold text-[#0F172A]">{mockProjects.length}</p>
              <p className="text-sm text-green-600">↑+3</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Conversations</p>
              <p className="text-4xl font-bold text-[#0F172A]">47</p>
              <p className="text-sm text-green-600">↑+15</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Completion Rate</p>
              <p className="text-4xl font-bold text-[#0F172A]">78%</p>
              <p className="text-sm text-green-600">↑+5%</p>
            </div>
            <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Activity Overview</h2>
        <p className="text-[#6B7280] mb-6">Your activity for the past 7 days</p>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-[#6B7280]">Chart visualization would go here</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">New Client</h3>
          <p className="text-[#6B7280] text-sm">Add a new client to organize projects</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-[#33A7B5] rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">New Project</h3>
          <p className="text-[#6B7280] text-sm">Start a new project for a client</p>
        </div>

        <div className="bg-[#33A7B5] text-white rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-[#33A7B5]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">New Chat</h3>
          <p className="text-white/80 text-sm">Start a new conversation for a project</p>
          <div className="mt-4">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-4 h-4 text-[#33A7B5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Clients and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0F172A]">Recent Clients</h2>
            <span className="text-sm text-[#6B7280]">{mockClients.length} clients</span>
          </div>
          <div className="space-y-4">
            {mockClients.slice(0, 4).map((client) => (
              <div 
                key={client.id} 
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: client.avatarColor }}
                >
                  {client.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0F172A]">{client.name}</h3>
                  <p className="text-sm text-[#6B7280]">{client.industry}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#0F172A]">{client.projects} Projects</p>
                  <p className="text-xs text-[#6B7280]">Active {client.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0F172A]">Recent Projects</h2>
            <span className="text-sm text-[#6B7280]">{mockProjects.length} projects</span>
          </div>
          <div className="space-y-4">
            {mockProjects.slice(0, 3).map((project) => (
              <div 
                key={project.id} 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0F172A]">{project.name}</h3>
                    <p className="text-sm text-[#6B7280]">@{project.clientName}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-1 bg-[#33A7B5]/10 text-[#33A7B5] text-xs rounded-full">
                        {project.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' : 
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        project.status === 'active' ? 'bg-green-500' : 
                        project.status === 'in-progress' ? 'bg-blue-500' : 
                        project.status === 'planning' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium text-[#0F172A]">{project.status}</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">{project.conversations} conversations</p>
                    <p className="text-xs text-[#6B7280]">Active {project.lastActive}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}