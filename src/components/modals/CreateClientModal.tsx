'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientStore } from '@/store/clientStore';
import { useTenant } from '@/hooks/useTenant';
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
  const tenant = useTenant();
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

      toast.success('Client created successfully!');
      onClose();

      // Navigate to new client
      router.push(`/clients/${client.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create client');
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
                backgroundColor: `${tenant.colors.primary}15`,
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              <Building 
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
              New Client
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
          {/* Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Client Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              required
              disabled={isLoading}
            />
          </div>

          {/* Industry */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Industry *
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              disabled={isLoading}
              className="w-full h-10 px-3 border border-slate-300 rounded-md"
              style={{ 
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              <option value="">Select an industry</option>
              {INDUSTRIES.map(ind => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
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
              placeholder="Brief description of the client..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none"
              style={{ 
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            />
          </div>

          {/* Logo URL (optional) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: tenant.colors.text }}
            >
              Logo URL (optional)
            </label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
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
                backgroundColor: tenant.colors.primary,
                borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
              }}
            >
              {isLoading ? 'Creating...' : 'Create Client'}
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
