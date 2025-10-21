'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useChatStore } from '@/store/chatStore';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function ConsolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { currentConversation, createConversation, isLoading } = useChatStore();
  const { selectedProject } = useProjectStore();
  const { selectedClient } = useClientStore();

  const projectId = searchParams.get('projectId');
  const clientId = searchParams.get('clientId');
  const agent = searchParams.get('agent');
  const initialMessage = searchParams.get('message');

  useEffect(() => {
    // If we have projectId, clientId, and agent from URL params, create new conversation
    if (projectId && clientId && agent && !currentConversation) {
      createConversation(projectId, clientId, agent, initialMessage || undefined)
        .then(() => {
          // Clear URL params after conversation created
          router.replace('/console');
        })
        .catch(error => {
          console.error('Failed to create conversation:', error);
        });
    }
  }, [projectId, clientId, agent]);

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-slate-50">
        {/* Header with Breadcrumb */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/home')}
              >
                <Home className="w-4 h-4" />
              </Button>
              
              {selectedClient && selectedProject && currentConversation && (
                <div className="flex items-center gap-2 text-sm">
                  <button
                    onClick={() => router.push('/clients')}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Clients
                  </button>
                  <span className="text-slate-400">/</span>
                  <button
                    onClick={() => router.push(`/clients/${selectedClient.id}`)}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {selectedClient.name}
                  </button>
                  <span className="text-slate-400">/</span>
                  <button
                    onClick={() => router.push(`/projects/${selectedProject.id}`)}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {selectedProject.name}
                  </button>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-900 font-medium">
                    {currentConversation.title || 'Conversation'}
                  </span>
                </div>
              )}
            </div>

            {/* Project Context Badge */}
            {selectedProject && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-900 font-medium">
                  Project: {selectedProject.name}
                </span>
                <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded capitalize">
                  {selectedProject.type.replace('-', ' ')}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading conversation...</p>
              </div>
            </div>
          ) : currentConversation ? (
            <div className="h-full flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Chat messages would go here */}
                  <div className="text-center text-slate-500">
                    <p>Chat interface will be integrated here</p>
                    <p className="text-sm mt-2">Conversation ID: {currentConversation.id}</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-200 bg-white p-6">
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm text-slate-500">Message input area (to be integrated with existing components)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-slate-600 mb-4">
                  Go to a project and start a new conversation
                </p>
                <Button onClick={() => router.push('/home')}>
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

