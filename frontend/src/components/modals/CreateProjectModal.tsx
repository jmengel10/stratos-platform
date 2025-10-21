'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, FolderKanban } from 'lucide-react';
import { PROJECT_TYPES } from '@/types/project.types';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string; // If provided, pre-select this client
}

export function CreateProjectModal({ isOpen, onClose, clientId }: CreateProjectModalProps) {
  const router = useRouter();
  const { createProject, isLoading } = useProjectStore();
  const { clients, fetchClients } = useClientStore();

  const [selectedClientId, setSelectedClientId] = useState(clientId || '');
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      setSelectedClientId(clientId);
    }
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      toast.error('Please select a client');
      return;
    }

    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    if (!type) {
      toast.error('Please select a project type');
      return;
    }

    try {
      const project = await createProject({
        clientId: selectedClientId,
        name: name.trim(),
        description: description.trim(),
        type: type as any,
        startDate,
        dueDate: dueDate || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      // Reset form
      setName('');
      setType('');
      setDescription('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setTags('');
      
      onClose();
      router.push(`/projects/${project.id}`);
    } catch (error) {
      // Error already handled by store
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
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
          {/* Client Selection (if not pre-selected) */}
          {!clientId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required
                className="w-full h-11 px-3 border border-slate-300 rounded-md text-base"
              >
                <option value="">Select a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No clients found. Create a client first.
                </p>
              )}
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Q4 GTM Strategy"
              required
              className="text-base"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full h-11 px-3 border border-slate-300 rounded-md text-base"
            >
              <option value="">Select a type...</option>
              {PROJECT_TYPES.map(pt => (
                <option key={pt.value} value={pt.value}>
                  {pt.icon} {pt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project goals and scope..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-base resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Due Date (Optional)
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (Optional)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="strategy, marketing, Q4 (comma-separated)"
              className="text-base"
            />
            <p className="text-xs text-slate-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

