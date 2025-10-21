'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '@/components/ui/button';
import {
  Users, FolderKanban, MessageSquare, Plus,
  Building, TrendingUp, Clock, ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { clients, fetchClients, isLoading: clientsLoading } = useClientStore();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore();
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  const recentClients = clients.slice(0, 5);
  const recentProjects = projects.slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-slate-600 mt-2">
                  What would you like to work on today?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/settings')}
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* New Client */}
              <button
                onClick={() => router.push('/clients?action=new')}
                className="bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 transition-all hover:shadow-md group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">New Client</h3>
                    <p className="text-sm text-slate-600">Create a new client to work with</p>
                  </div>
                </div>
              </button>

              {/* New Project */}
              <button
                onClick={() => router.push('/clients')}
                className="bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-green-500 p-8 transition-all hover:shadow-md group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FolderKanban className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">New Project</h3>
                    <p className="text-sm text-slate-600">Start a new project for a client</p>
                  </div>
                </div>
              </button>

              {/* Continue Working */}
              <button
                onClick={() => router.push('/clients')}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Continue Working</h3>
                    <p className="text-sm text-blue-100">Browse all clients and projects</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Clients */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Clients</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/clients')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {clientsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentClients.length > 0 ? (
                <div className="space-y-3">
                  {recentClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => router.push(`/clients/${client.id}`)}
                      className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {client.logoUrl ? (
                          <img src={client.logoUrl} alt={client.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-blue-600">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{client.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{client.industry}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-slate-900">
                          {client.stats?.projectCount || 0} projects
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                  <Building className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-600 mb-4">No clients yet</p>
                  <Button
                    size="sm"
                    onClick={() => router.push('/clients?action=new')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Client
                  </Button>
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Projects</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/clients')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {projectsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentProjects.length > 0 ? (
                <div className="space-y-3">
                  {recentProjects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{project.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{project.type.replace('-', ' ')}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-700' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                  <FolderKanban className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-600 mb-4">No projects yet</p>
                  <Button
                    size="sm"
                    onClick={() => router.push('/clients')}
                    disabled={clients.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                  {clients.length === 0 && (
                    <p className="text-xs text-slate-500 mt-2">Create a client first</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Clients</p>
                  <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Conversations</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {projects.reduce((sum, p) => sum + (p.stats?.conversationCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {projects.reduce((sum, p) => sum + (p.stats?.messageCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

