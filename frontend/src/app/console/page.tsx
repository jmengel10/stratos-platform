'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useChatStore } from '@/store/chatStore';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function ConsolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = useTenant();
  
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
      <div className="h-screen flex flex-col" style={{ backgroundColor: tenant.colors.background }}>
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
                    className="hover:underline transition-colors"
                    style={{ color: tenant.colors.primary }}
                  >
                    Clients
                  </button>
                  <span style={{ color: tenant.colors.text, opacity: 0.4 }}>/</span>
                  <button
                    onClick={() => router.push(`/clients/${selectedClient.id}`)}
                    className="hover:underline transition-colors"
                    style={{ color: tenant.colors.primary }}
                  >
                    {selectedClient.name}
                  </button>
                  <span style={{ color: tenant.colors.text, opacity: 0.4 }}>/</span>
                  <button
                    onClick={() => router.push(`/projects/${selectedProject.id}`)}
                    className="hover:underline transition-colors"
                    style={{ color: tenant.colors.primary }}
                  >
                    {selectedProject.name}
                  </button>
                  <span style={{ color: tenant.colors.text, opacity: 0.4 }}>/</span>
                  <span 
                    className="font-medium"
                    style={{ color: tenant.colors.text }}
                  >
                    {currentConversation.title || 'Conversation'}
                  </span>
                </div>
              )}
            </div>

            {/* Project Context Badge */}
            {selectedProject && (
              <div 
                className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                style={{ 
                  backgroundColor: `${tenant.colors.secondary}15`,
                  borderColor: `${tenant.colors.secondary}40`,
                  borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                }}
              >
                <span 
                  className="text-sm font-medium"
                  style={{ color: tenant.colors.secondary }}
                >
                  Project: {selectedProject.name}
                </span>
                <span 
                  className="px-2 py-0.5 text-xs rounded capitalize"
                  style={{ 
                    backgroundColor: tenant.colors.secondary,
                    color: 'white'
                  }}
                >
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
                <div 
                  className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                  style={{ borderColor: `${tenant.colors.primary} transparent transparent transparent` }}
                />
                <p style={{ color: tenant.colors.text, opacity: 0.7 }}>
                  Loading conversation...
                </p>
              </div>
            </div>
          ) : currentConversation ? (
            <div className="h-full flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Chat messages would go here */}
                  <div 
                    className="text-center"
                    style={{ color: tenant.colors.text, opacity: 0.6 }}
                  >
                    <p>Chat interface will be integrated here</p>
                    <p className="text-sm mt-2">Conversation ID: {currentConversation.id}</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-200 bg-white p-6">
                <div className="max-w-4xl mx-auto">
                  <p 
                    className="text-sm"
                    style={{ color: tenant.colors.text, opacity: 0.6 }}
                  >
                    Message input area (to be integrated with existing components)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${tenant.colors.primary}10` }}
                >
                  <ArrowLeft 
                    className="w-8 h-8" 
                    style={{ color: tenant.colors.primary }}
                  />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ 
                    fontFamily: tenant.fonts.heading,
                    color: tenant.colors.text 
                  }}
                >
                  No conversation selected
                </h3>
                <p 
                  className="mb-4"
                  style={{ color: tenant.colors.text, opacity: 0.7 }}
                >
                  Go to a project and start a new conversation
                </p>
                <button
                  onClick={() => router.push('/home')}
                  className="px-4 py-2 rounded-lg font-medium text-white"
                  style={{ 
                    backgroundColor: tenant.colors.primary,
                    borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                  }}
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

