'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { useTenant } from '@/hooks/useTenant';
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
  const tenant = useTenant();

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
  }, [clientId, fetchProjectsByClient, selectClient]);

  const clientProjects = projects.filter(p => p.clientId === clientId);

  if (clientLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: tenant.colors.background }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: `${tenant.colors.primary} transparent transparent transparent` }}
          />
          <p style={{ color: tenant.colors.text, opacity: 0.7 }}>
            Loading client...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: tenant.colors.background }}
      >
        <div className="text-center">
          <Building 
            className="w-16 h-16 mx-auto mb-4" 
            style={{ color: tenant.colors.accent }}
          />
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ 
              fontFamily: tenant.fonts.heading,
              color: tenant.colors.text 
            }}
          >
            Client not found
          </h2>
          <button
            onClick={() => router.push('/clients')}
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ 
              backgroundColor: tenant.colors.primary,
              borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
            }}
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: tenant.colors.background }}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <div 
              className="flex items-center gap-2 text-sm mb-4"
              style={{ color: tenant.colors.text, opacity: 0.7 }}
            >
              <button 
                onClick={() => router.push('/home')} 
                className="hover:underline"
                style={{ color: tenant.colors.primary }}
              >
                Home
              </button>
              <span>/</span>
              <button 
                onClick={() => router.push('/clients')} 
                className="hover:underline"
                style={{ color: tenant.colors.primary }}
              >
                Clients
              </button>
              <span>/</span>
              <span style={{ color: tenant.colors.text }}>{selectedClient.name}</span>
            </div>

            {/* Client Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Client Logo */}
                <div 
                  className="w-24 h-24 flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${tenant.colors.primary} 0%, ${tenant.colors.secondary} 100%)`,
                    borderRadius: tenant.id === 'sparkworks' ? '1.5rem' : '1rem'
                  }}
                >
                  {selectedClient.logoUrl ? (
                    <img
                      src={selectedClient.logoUrl}
                      alt={selectedClient.name}
                      className="w-24 h-24 object-cover"
                      style={{ borderRadius: tenant.id === 'sparkworks' ? '1.5rem' : '1rem' }}
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Client Info */}
                <div>
                  <h1 
                    className="text-3xl font-bold mb-2"
                    style={{ 
                      fontFamily: tenant.fonts.heading,
                      color: tenant.colors.primary 
                    }}
                  >
                    {selectedClient.name}
                  </h1>
                  <p 
                    className="mb-4 max-w-2xl"
                    style={{ color: tenant.colors.text, opacity: 0.7 }}
                  >
                    {selectedClient.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-3 py-1 text-sm font-medium rounded-full capitalize"
                      style={{ 
                        backgroundColor: `${tenant.colors.primary}15`,
                        color: tenant.colors.primary
                      }}
                    >
                      {selectedClient.industry}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedClient.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedClient.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/clients')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div 
              className="bg-white border border-slate-200 p-6"
              style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: tenant.colors.text, opacity: 0.7 }}
                >
                  Total Projects
                </span>
                <FolderKanban 
                  className="w-5 h-5" 
                  style={{ color: tenant.colors.primary }}
                />
              </div>
              <p 
                className="text-3xl font-bold"
                style={{ color: tenant.colors.text }}
              >
                {clientProjects.length}
              </p>
            </div>

            <div 
              className="bg-white border border-slate-200 p-6"
              style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: tenant.colors.text, opacity: 0.7 }}
                >
                  Active Conversations
                </span>
                <MessageSquare 
                  className="w-5 h-5" 
                  style={{ color: tenant.colors.secondary }}
                />
              </div>
              <p 
                className="text-3xl font-bold"
                style={{ color: tenant.colors.text }}
              >
                {selectedClient.stats?.conversationCount || 0}
              </p>
            </div>

            <div 
              className="bg-white border border-slate-200 p-6"
              style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: tenant.colors.text, opacity: 0.7 }}
                >
                  Artifacts Generated
                </span>
                <FileText 
                  className="w-5 h-5" 
                  style={{ color: tenant.colors.accent === '#EEEEEE' ? '#6b7280' : tenant.colors.accent }}
                />
              </div>
              <p 
                className="text-3xl font-bold"
                style={{ color: tenant.colors.text }}
              >
                {(selectedClient.stats as any)?.artifactsCount || 0}
              </p>
            </div>

            <div 
              className="bg-white border border-slate-200 p-6"
              style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: tenant.colors.text, opacity: 0.7 }}
                >
                  Last Activity
                </span>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <p 
                className="text-lg font-semibold"
                style={{ color: tenant.colors.text }}
              >
                {new Date(selectedClient.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-bold"
                style={{ 
                  fontFamily: tenant.fonts.heading,
                  color: tenant.colors.primary 
                }}
              >
                Projects
              </h2>
              <button
                onClick={() => router.push(`/projects/new?clientId=${clientId}`)}
                className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: tenant.colors.primary,
                  borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                }}
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>

            {projectsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className="h-40 bg-white border border-slate-200 animate-pulse"
                    style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
                  />
                ))}
              </div>
            ) : clientProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="bg-white border border-slate-200 p-6 hover:shadow-lg transition-all text-left"
                    style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${tenant.colors.secondary}15`,
                          borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                        }}
                      >
                        <FolderKanban 
                          className="w-5 h-5" 
                          style={{ color: tenant.colors.secondary }}
                        />
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

                    <h3 
                      className="font-bold mb-2"
                      style={{ color: tenant.colors.text }}
                    >
                      {project.name}
                    </h3>
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: tenant.colors.text, opacity: 0.6 }}
                    >
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ 
                          backgroundColor: `${tenant.colors.primary}10`,
                          color: tenant.colors.primary
                        }}
                      >
                        {project.type.replace('-', ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div 
                className="bg-white border-2 border-dashed border-slate-200 p-12 text-center"
                style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
              >
                <FolderKanban 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: tenant.colors.accent === '#EEEEEE' ? '#cbd5e1' : tenant.colors.accent }}
                />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: tenant.colors.text }}
                >
                  No projects yet
                </h3>
                <p 
                  className="mb-4"
                  style={{ color: tenant.colors.text, opacity: 0.6 }}
                >
                  Create your first project for {selectedClient.name}
                </p>
                <button
                  onClick={() => router.push(`/projects/new?clientId=${clientId}`)}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: tenant.colors.primary,
                    borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                  }}
                >
                  Create First Project
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
