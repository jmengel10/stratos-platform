'use client';

import { Target, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-navy font-serif">Welcome back, Sarah</h1>
        <p className="text-gray-text mt-2">Here&apos;s what&apos;s happening with your work today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Clients</p>
              <p className="text-3xl font-bold text-navy">12</p>
              <p className="text-sm text-green-600">↑+2</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Active Projects</p>
              <p className="text-3xl font-bold text-navy">18</p>
              <p className="text-sm text-green-600">↑+3</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Conversations</p>
              <p className="text-3xl font-bold text-navy">47</p>
              <p className="text-sm text-green-600">↑+15</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Completion Rate</p>
              <p className="text-3xl font-bold text-navy">78%</p>
              <p className="text-sm text-green-600">↑+5%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Overview Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-navy mb-4">Activity Overview</h2>
        <p className="text-gray-text mb-6">Your activity for the past 7 days</p>
        <div className="h-64 bg-bg-gray rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">New Client</h3>
          <p className="text-gray-text text-sm">Add a new client to organize projects</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">New Project</h3>
          <p className="text-gray-text text-sm">Start a new project for a client</p>
        </Card>

        <Card className="p-6 text-center bg-primary text-white hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">New Chat</h3>
          <p className="text-white/80 text-sm">Start a new conversation for a project</p>
        </Card>
      </div>

      {/* Recent Clients */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-navy">Recent Clients</h2>
          <span className="text-sm text-gray-500">8 clients</span>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Acme Corporation', industry: 'Financial Services', projects: 6, lastActive: '2 days ago', avatar: 'A' },
            { name: 'TechVentures Group', industry: 'Healthcare Technology', projects: 4, lastActive: '1 week ago', avatar: 'T' },
            { name: 'HealthFirst Systems', industry: 'Medical Devices', projects: 3, lastActive: '3 days ago', avatar: 'H' },
            { name: 'GlobalTech Solutions', industry: 'Enterprise Software', projects: 5, lastActive: '1 day ago', avatar: 'G' }
          ].map((client, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-bg-gray rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {client.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy">{client.name}</h3>
                <p className="text-sm text-gray-text">{client.industry}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-navy">{client.projects} Projects</p>
                <p className="text-xs text-gray-500">Active {client.lastActive}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-navy">Recent Projects</h2>
          <span className="text-sm text-gray-500">10 projects</span>
        </div>
        <div className="space-y-4">
          {[
            { title: 'GTM Strategy 2024', client: 'Acme Corporation', status: 'Active', conversations: 8, lastActive: '2 hours ago', tags: ['GTM Strategy', 'Transformation'] },
            { title: 'Market Expansion', client: 'TechVentures Group', status: 'In Progress', conversations: 5, lastActive: '1 day ago', tags: ['Fundraising', 'Operations'] },
            { title: 'Financial Planning', client: 'HealthFirst Systems', status: 'Active', conversations: 3, lastActive: '3 hours ago', tags: ['Market Entry', 'Operations'] }
          ].map((project, index) => (
            <div key={index} className="p-4 bg-bg-gray rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy">{project.title}</h3>
                  <p className="text-sm text-gray-text">@{project.client}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${project.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm font-medium text-navy">{project.status}</span>
                  </div>
                  <p className="text-sm text-gray-text">{project.conversations} conversations</p>
                  <p className="text-xs text-gray-500">Active {project.lastActive}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
