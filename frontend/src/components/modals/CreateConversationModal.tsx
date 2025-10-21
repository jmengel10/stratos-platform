'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  clientId: string;
  projectName?: string;
}

const AGENTS = [
  { value: 'gtm-strategist', label: 'GTM Strategist', icon: '🎯', description: 'Go-to-market strategy and planning' },
  { value: 'ops-analyst', label: 'Ops & Cost Analyst', icon: '⚙️', description: 'Operations optimization and cost analysis' },
  { value: 'fundraising-advisor', label: 'Fundraising Advisor', icon: '💰', description: 'Fundraising strategy and investor relations' },
  { value: 'product-strategist', label: 'Product Strategist', icon: '🚀', description: 'Product strategy and development' },
  { value: 'data-analyst', label: 'Data Analyst', icon: '📊', description: 'Data analysis and insights' },
];

export function CreateConversationModal({
  isOpen,
  onClose,
  projectId,
  clientId,
  projectName
}: CreateConversationModalProps) {
  const router = useRouter();

  const [selectedAgent, setSelectedAgent] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }

    try {
      setIsCreating(true);

      // Create conversation via API
      // TODO: This will need to be implemented in the chatStore
      // For now, navigate to console with query params
      const params = new URLSearchParams({
        projectId,
        clientId,
        agent: selectedAgent,
        ...(initialMessage && { message: initialMessage }),
      });

      router.push(`/console?${params.toString()}`);
      
      toast.success('Starting new conversation...');
      onClose();
    } catch (error) {
      toast.error('Failed to create conversation');
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Start New Conversation</h2>
              {projectName && (
                <p className="text-sm text-slate-600">Project: {projectName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Agent Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select AI Agent <span className="text-red-500">*</span>
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {AGENTS.map(agent => (
                <button
                  key={agent.value}
                  type="button"
                  onClick={() => setSelectedAgent(agent.value)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    selectedAgent === agent.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{agent.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">{agent.label}</p>
                      <p className="text-xs text-slate-600">{agent.description}</p>
                    </div>
                    {selectedAgent === agent.value && (
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Message (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Initial Message (Optional)
            </label>
            <textarea
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start with a question or context for the AI agent..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-base resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              You can also start the conversation after selecting the agent
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isCreating || !selectedAgent}
            >
              {isCreating ? 'Starting...' : 'Start Conversation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

