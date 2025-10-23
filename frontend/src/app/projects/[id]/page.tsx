'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Plus, Edit, FolderKanban, MessageSquare,
  Calendar, Tag, FileText, TrendingUp
} from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const tenant = useTenant();

  const { selectedProject, selectProject, isLoading: projectLoading } = useProjectStore();
  const { selectedClient, selectClient } = useClientStore();

  useEffect(() => {
    const loadProject = async () => {
      try {
        await useProjectStore.getState().fetchProjects();
        const foundProject = useProjectStore.getState().projects.find(p => p.id === projectId);
        if (foundProject) {
          selectProject(foundProject);
          
          // Load client
          await useClientStore.getState().fetchClients();
          const foundClient = useClientStore.getState().clients.find(c => c.id === foundProject.clientId);
          if (foundClient) {
            selectClient(foundClient);
          }
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };

    loadProject();
  }, [projectId, selectProject, selectClient]);

  if (projectLoading || !selectedProject) {
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
            Loading project...
          </p>
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
              {selectedClient && (
                <>
                  <span>/</span>
                  <button 
                    onClick={() => router.push(`/clients/${selectedClient.id}`)} 
                    className="hover:underline"
                    style={{ color: tenant.colors.primary }}
                  >
                    {selectedClient.name}
                  </button>
                </>
              )}
              <span>/</span>
              <span style={{ color: tenant.colors.text }}>{selectedProject.name}</span>
            </div>

            {/* Project Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${tenant.colors.secondary}20`,
                    borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                  }}
                >
                  <FolderKanban 
                    className="w-8 h-8" 
                    style={{ color: tenant.colors.secondary }}
                  />
                </div>

                <div>
                  <h1 
                    className="text-3xl font-bold mb-2"
                    style={{ 
                      fontFamily: tenant.fonts.heading,
                      color: tenant.colors.primary 
                    }}
                  >
                    {selectedProject.name}
                  </h1>
                  <p 
                    className="mb-4 max-w-2xl"
                    style={{ color: tenant.colors.text, opacity: 0.7 }}
                  >
                    {selectedProject.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-3 py-1 text-sm font-medium rounded-full capitalize"
                      style={{ 
                        backgroundColor: `${tenant.colors.secondary}15`,
                        color: tenant.colors.secondary
                      }}
                    >
                      {selectedProject.type.replace('-', ' ')}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedProject.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedProject.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      selectedProject.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/clients/${selectedProject.clientId}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
                  Conversations
                </span>
                <MessageSquare 
                  className="w-5 h-5" 
                  style={{ color: tenant.colors.primary }}
                />
              </div>
              <p 
                className="text-3xl font-bold"
                style={{ color: tenant.colors.text }}
              >
                0
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
                  Messages
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
                0
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
                  Artifacts
                </span>
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <p 
                className="text-3xl font-bold"
                style={{ color: tenant.colors.text }}
              >
                0
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
                  Start Date
                </span>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <p 
                className="text-lg font-semibold"
                style={{ color: tenant.colors.text }}
              >
                {new Date(selectedProject.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Conversations Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-bold"
                style={{ 
                  fontFamily: tenant.fonts.heading,
                  color: tenant.colors.primary 
                }}
              >
                Conversations
              </h2>
              <button
                onClick={() => router.push(`/console?projectId=${projectId}&clientId=${selectedProject.clientId}`)}
                className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: tenant.colors.primary,
                  borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                }}
              >
                <Plus className="w-4 h-4" />
                New Conversation
              </button>
            </div>

            {/* Empty state */}
            <div 
              className="bg-white border-2 border-dashed border-slate-200 p-12 text-center"
              style={{ borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem' }}
            >
              <MessageSquare 
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: tenant.colors.accent === '#EEEEEE' ? '#cbd5e1' : tenant.colors.accent }}
              />
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: tenant.colors.text }}
              >
                No conversations yet
              </h3>
              <p 
                className="mb-4"
                style={{ color: tenant.colors.text, opacity: 0.6 }}
              >
                Start a conversation with an AI agent for this project
              </p>
              <button
                onClick={() => router.push(`/console?projectId=${projectId}&clientId=${selectedProject.clientId}`)}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: tenant.colors.primary,
                  borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                }}
              >
                Start First Conversation
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
