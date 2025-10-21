'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientStore } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Building } from 'lucide-react';
import { INDUSTRIES } from '@/types/client.types';
import toast from 'react-hot-toast';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClientModal({ isOpen, onClose }: CreateClientModalProps) {
  const router = useRouter();
  const { createClient, isLoading } = useClientStore();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState<string>('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Client name is required');
      return;
    }

    if (!industry) {
      toast.error('Please select an industry');
      return;
    }

    try {
      const client = await createClient({
        name: name.trim(),
        industry: industry as any,
        description: description.trim(),
        logoUrl: logoUrl.trim() || undefined,
      });

      // Reset form
      setName('');
      setIndustry('');
      setDescription('');
      setLogoUrl('');
      
      onClose();
      router.push(`/clients/${client.id}`);
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Client</h2>
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
          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corporation"
              required
              className="text-base"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              className="w-full h-11 px-3 border border-slate-300 rounded-md text-base"
            >
              <option value="">Select an industry...</option>
              {INDUSTRIES.map(ind => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
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
              placeholder="Brief description of the client and their business..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-base resize-none"
            />
          </div>

          {/* Logo URL (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo URL (Optional)
            </label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              type="url"
              className="text-base"
            />
            <p className="text-xs text-slate-500 mt-1">
              Provide a URL to the client's logo image
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
              {isLoading ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

