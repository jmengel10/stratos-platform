'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, FolderKanban } from 'lucide-react';
import { PROJECT_TYPES } from '@/types/project.types';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

export function CreateProjectModal({ isOpen, onClose, clientId: preSelectedClientId }: CreateProjectModalProps) {
  const router = useRouter();
  const tenant = useTenant();
  const { createProject, isLoading } = useProjectStore();
  const { clients, fetchClients } = useClientStore();

  const [clientId, setClientId] = useState(preSelectedClientId || '');
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, fetchClients]);

  useEffect(() => {
    if (preSelectedClientId) {
      setClientId(preSelectedClientId);
    }
  }, [preSelectedClientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId) {
      toast.error('Please select a client');
      return;
    }

    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    if (!projectType) {
      toast.error('Please select a project type');
      return;
    }

    try {
      const project = await createProject({
        clientId,
        name: name.trim(),
        type: projectType as any,
        description: description.trim(),
        startDate,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      // Reset form
      setClientId(preSelectedClientId || '');
      setName('');
      setProjectType('');
      setDescription('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setTags('');

      toast.success('Project created successfully!');
      onClose();

      // Navigate to new project
      router.push(`/projects/${project.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
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
        className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
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
                backgroundColor: `${tenant.colors.secondary}15`,
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              <FolderKanban 
                className="w-5 h-5" 
                style={{ color: tenant.colors.secondary }}
              />
            </div>
            <h2 
              className="text-2xl font-bold"
              style={{ 
                fontFamily: tenant.fonts.heading,
                color: tenant.colors.secondary 
              }}
            >
              New Project
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Client Selector */}
          {!preSelectedClientId && (
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: tenant.colors.text }}
              >
                Client *
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                disabled={isLoading}
                className="w-full h-10 px-3 border border-slate-300 rounded-md"
                style={{ 
                  borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                }}
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Project Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Q1 Strategy Initiative"
              required
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Project Type *
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              disabled={isLoading}
              className="w-full h-10 px-3 border border-slate-300 rounded-md"
              style={{ 
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              <option value="">Select a type</option>
              {PROJECT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project objectives and scope..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none"
              style={{ 
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            />
          </div>

          {/* Start Date */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Start Date *
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Tags (comma-separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="strategy, q1, high-priority"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: tenant.colors.secondary,
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              {isLoading ? 'Creating...' : 'Create Project'}
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
