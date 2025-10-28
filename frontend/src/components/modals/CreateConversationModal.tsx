'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  clientId: string;
}

const AGENTS = [
  { id: 'gtm-strategist', name: 'GTM Strategist', description: 'Go-to-market strategy and positioning', icon: '🎯' },
  { id: 'ops-analyst', name: 'Ops & Cost Analyst', description: 'Operational efficiency and cost optimization', icon: '⚙️' },
  { id: 'fundraising-advisor', name: 'Fundraising Advisor', description: 'Fundraising strategy and investor targeting', icon: '💰' },
  { id: 'product-strategist', name: 'Product Strategist', description: 'Product roadmaps and feature prioritization', icon: '📦' },
  { id: 'data-analyst', name: 'Data Analyst', description: 'Data analysis and visualization', icon: '📊' },
];

export function CreateConversationModal({ isOpen, onClose, projectId, clientId }: CreateConversationModalProps) {
  const router = useRouter();
  const tenant = useTenant();
  const { createConversation, isLoading } = useChatStore();

  const [selectedAgent, setSelectedAgent] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAgent) {
      toast.error('Please select an AI agent');
      return;
    }

    try {
      const conversation = await createConversation(
        projectId,
        clientId,
        selectedAgent,
        initialMessage.trim() || undefined
      );

      // Reset form
      setSelectedAgent('');
      setInitialMessage('');

      toast.success('Conversation started!');
      onClose();

      // Navigate to console
      router.push(`/console?conversationId=${conversation.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to start conversation');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ 
          borderRadius: tenant.id === 'sparkworks' ? '1.5rem' : '1rem',
          margin: '1rem'
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between"
          style={{ 
            borderTopLeftRadius: tenant.id === 'sparkworks' ? '1.5rem' : '1rem',
            borderTopRightRadius: tenant.id === 'sparkworks' ? '1.5rem' : '1rem'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 flex items-center justify-center"
              style={{ 
                backgroundColor: `${tenant.colors.primary}15`,
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              <MessageSquare 
                className="w-5 h-5" 
                style={{ color: tenant.colors.primary }}
              />
            </div>
            <h2 
              className="text-2xl font-bold"
              style={{ 
                fontFamily: tenant.fonts.heading,
                color: tenant.colors.primary 
              }}
            >
              Start New Conversation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" style={{ color: tenant.colors.text }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Agent Selection */}
          <div>
            <label 
              className="block text-sm font-medium mb-3"
              style={{ color: tenant.colors.text }}
            >
              Select AI Agent *
            </label>
            <div className="grid gap-3">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setSelectedAgent(agent.id)}
                  disabled={isLoading}
                  className="text-left p-4 border-2 rounded-lg transition-all hover:shadow-md disabled:opacity-50"
                  style={{ 
                    borderColor: selectedAgent === agent.id ? tenant.colors.primary : '#e2e8f0',
                    backgroundColor: selectedAgent === agent.id ? `${tenant.colors.primary}05` : 'white',
                    borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{agent.icon}</span>
                    <div className="flex-1">
                      <h3 
                        className="font-semibold mb-1"
                        style={{ 
                          color: selectedAgent === agent.id ? tenant.colors.primary : tenant.colors.text 
                        }}
                      >
                        {agent.name}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: tenant.colors.text, opacity: 0.7 }}
                      >
                        {agent.description}
                      </p>
                    </div>
                    {selectedAgent === agent.id && (
                      <Sparkles 
                        className="w-5 h-5" 
                        style={{ color: tenant.colors.primary }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Message (Optional) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Initial Message (optional)
            </label>
            <textarea
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start the conversation with a specific question or topic..."
              rows={4}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none"
              style={{ 
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            />
            <p 
              className="text-xs mt-1"
              style={{ color: tenant.colors.text, opacity: 0.6 }}
            >
              Leave blank to start with a general greeting
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !selectedAgent}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: tenant.colors.primary,
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              {isLoading ? 'Starting...' : 'Start Conversation'}
            </button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
