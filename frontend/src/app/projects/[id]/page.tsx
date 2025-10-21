'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Plus, Edit, FolderKanban, MessageSquare,
  FileText, Calendar, Tag, Clock, CheckCircle2
} from 'lucide-react';
import { PROJECT_TYPES } from '@/types/project.types';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const { selectedProject, selectProject, isLoading: projectLoading } = useProjectStore();
  const { selectedClient, selectClient } = useClientStore();

  const [conversations, setConversations] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projects = useProjectStore.getState().projects;
        const foundProject = projects.find(p => p.id === projectId);
        
        if (foundProject) {
          selectProject(foundProject);
          
          // Load client
          const clients = useClientStore.getState().clients;
          const client = clients.find(c => c.id === foundProject.clientId);
          if (client) {
            selectClient(client);
          }
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };

    loadProject();
  }, [projectId]);

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FolderKanban className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Project not found</h2>
          <Button onClick={() => router.push('/clients')}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  const projectType = PROJECT_TYPES.find(t => t.value === selectedProject.type);

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
              <button
                onClick={() => router.push(`/clients/${selectedProject.clientId}`)}
                className="hover:text-slate-900"
              >
                {selectedClient?.name || 'Client'}
              </button>
              <span>/</span>
              <span className="text-slate-900">{selectedProject.name}</span>
            </div>

            {/* Project Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-3xl">{projectType?.icon || '📁'}</span>
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">
                      {selectedProject.name}
                    </h1>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedProject.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedProject.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      selectedProject.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProject.status}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full capitalize">
                      {selectedProject.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600 max-w-2xl mb-2">
                    {selectedProject.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Started {new Date(selectedProject.startDate).toLocaleDateString()}
                    </span>
                    {selectedProject.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due {new Date(selectedProject.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => router.push(`/projects/${projectId}/conversations/new`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Conversation
                </Button>
              </div>
            </div>

            {/* Tags */}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Conversations</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedProject.stats?.conversationCount || 0}
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
                  <p className="text-sm text-slate-600">Messages</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedProject.stats?.messageCount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Artifacts</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedProject.stats?.artifactCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversations */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Conversations</h2>
              <Button
                size="sm"
                onClick={() => router.push(`/projects/${projectId}/conversations/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>

            {conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => router.push(`/console/${conv.id}`)}
                    className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{conv.title}</p>
                      <p className="text-sm text-slate-500">Agent: {conv.agentName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-600 mb-4">No conversations yet</p>
                <Button
                  size="sm"
                  onClick={() => router.push(`/projects/${projectId}/conversations/new`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start First Conversation
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

