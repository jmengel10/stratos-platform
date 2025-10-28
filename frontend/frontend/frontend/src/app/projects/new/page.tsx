'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createProject, getAllClients, type Client } from '@/lib/storage';
import { ArrowLeft, Save } from 'lucide-react';

const PROJECT_TYPES = [
  'GTM Strategy',
  'Operations',
  'Technology',
  'Growth Strategy',
  'Product Strategy',
  'Market Analysis',
  'Advisory',
  'M&A',
  'Financial Planning',
  'Other'
];

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId');
  
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    name: '',
    type: 'GTM Strategy',
    status: 'planning' as 'active' | 'in-progress' | 'planning' | 'completed',
    startDate: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setClients(getAllClients());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const client = clients.find(c => c.id === formData.clientId);
    if (!client) return;
    
    // Format dates
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    
    // Create project
    const newProject = createProject({
      clientId: formData.clientId,
      clientName: client.name,
      name: formData.name.trim(),
      type: formData.type,
      status: formData.status,
      progress: 0,
      conversations: 0,
      members: 1,
      startDate: formatDate(formData.startDate),
      dueDate: formatDate(formData.dueDate),
      lastActive: 'Just now'
    });
    
    // Redirect to project detail
    router.push(`/projects/${newProject.id}`);
  };

  const selectedClient = clients.find(c => c.id === formData.clientId);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-text hover:text-primary mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-4xl font-serif font-bold text-navy">New Project</h1>
        <p className="text-gray-text mt-2">Create a new project for a client</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8">
        {/* Client Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Client *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
              errors.clientId ? 'border-red-500' : 'border-border'
            }`}
          >
            <option value="">Select a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.industry}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
          )}
        </div>

        {/* Project Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Project Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., GTM Strategy 2024"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
              errors.name ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Project Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Project Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                errors.startDate ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                errors.dueDate ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Preview */}
        {selectedClient && formData.name && (
          <div className="mb-8 p-6 bg-bg-gray rounded-lg">
            <p className="text-sm font-medium text-navy mb-3">Preview:</p>
            <div>
              <p className="text-sm text-gray-text mb-1">{selectedClient.name}</p>
              <p className="text-lg font-semibold text-navy">{formData.name}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-50 text-primary text-xs rounded-full">
                  {formData.type}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {formData.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-border text-navy rounded-lg hover:border-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            <Save className="w-5 h-5" />
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
