'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Plus, Edit, Building, FolderKanban,
  MessageSquare, FileText, Calendar, Tag
} from 'lucide-react';
import { PROJECT_TYPES } from '@/types/project.types';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const { selectedClient, selectClient, isLoading: clientLoading } = useClientStore();
  const { projects, fetchProjectsByClient, isLoading: projectsLoading } = useProjectStore();

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const client = await useClientStore.getState().fetchClients();
        const foundClient = useClientStore.getState().clients.find(c => c.id === clientId);
        if (foundClient) {
          selectClient(foundClient);
        }
      } catch (error) {
        console.error('Failed to load client:', error);
      }
    };

    loadClient();
    fetchProjectsByClient(clientId);
  }, [clientId]);

  const clientProjects = projects.filter(p => p.clientId === clientId);

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading client...</p>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Client not found</h2>
          <Button onClick={() => router.push('/clients')}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <button onClick={() => router.push('/home')} className="hover:text-slate-900">
                Home
              </button>
              <span>/</span>
              <button onClick={() => router.push('/clients')} className="hover:text-slate-900">
                Clients
              </button>
              <span>/</span>
              <span className="text-slate-900">{selectedClient.name}</span>
            </div>

            {/* Client Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  {selectedClient.logoUrl ? (
                    <img
                      src={selectedClient.logoUrl}
                      alt={selectedClient.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">
                      {selectedClient.name}
                    </h1>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedClient.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedClient.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedClient.status}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full capitalize">
                      {selectedClient.industry}
                    </span>
                  </div>
                  <p className="text-slate-600 max-w-2xl">
                    {selectedClient.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button>
                <Button onClick={() => router.push(`/clients/${clientId}/projects/new`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Projects</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedClient.stats?.projectCount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Conversations</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedClient.stats?.conversationCount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Artifacts</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {clientProjects.reduce((sum, p) => sum + (p.stats?.artifactCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Last Activity</p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedClient.stats?.lastActivity 
                      ? new Date(selectedClient.stats.lastActivity).toLocaleDateString()
                      : 'No activity'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
              <Button
                size="sm"
                onClick={() => router.push(`/clients/${clientId}/projects/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {projectsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : clientProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {clientProjects.map(project => {
                  const projectType = PROJECT_TYPES.find(t => t.value === project.type);
                  return (
                    <button
                      key={project.id}
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="p-5 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-slate-50 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{projectType?.icon || '📁'}</span>
                          <div>
                            <h3 className="font-semibold text-slate-900">{project.name}</h3>
                            <p className="text-sm text-slate-500 capitalize">
                              {project.type.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-700' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Project Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {project.stats?.conversationCount || 0} chats
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {project.stats?.artifactCount || 0} artifacts
                        </span>
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <FolderKanban className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-600 mb-4">No projects yet</p>
                <Button
                  size="sm"
                  onClick={() => router.push(`/clients/${clientId}/projects/new`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

