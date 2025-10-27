'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/storage';
import { ArrowLeft, Save } from 'lucide-react';

const INDUSTRIES = [
  'Financial Services',
  'Healthcare Technology',
  'Medical Devices',
  'Enterprise Software',
  'Healthcare IT',
  'SaaS Platform',
  'Manufacturing',
  'Fintech',
  'Enterprise Solutions',
  'Consulting',
  'Other'
];

const AVATAR_COLORS = [
  '#0F172A', // Navy
  '#33A7B5', // Teal
  '#6B7280', // Gray
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Financial Services',
    avatar: '',
    avatarColor: '#0F172A'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    if (!formData.avatar.trim()) {
      newErrors.avatar = 'Avatar letter is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create client
    const newClient = createClient({
      name: formData.name.trim(),
      industry: formData.industry,
      avatar: formData.avatar.trim().toUpperCase().charAt(0),
      avatarColor: formData.avatarColor,
      projects: 0,
      conversations: 0,
      lastActive: 'Just now'
    });
    
    // Redirect to client detail
    router.push(`/clients/${newClient.id}`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-text hover:text-primary mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Clients
        </button>
        <h1 className="text-4xl font-serif font-bold text-navy">New Client</h1>
        <p className="text-gray-text mt-2">Add a new client to organize your projects</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8">
        {/* Client Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Acme Corporation"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
              errors.name ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Industry */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Industry *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Avatar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Avatar Letter *
          </label>
          <input
            type="text"
            maxLength={1}
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase() })}
            placeholder="First letter (e.g., A)"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
              errors.avatar ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
          )}
          <p className="text-xs text-gray-text mt-1">Single letter for the avatar</p>
        </div>

        {/* Avatar Color */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-navy mb-3">
            Avatar Color *
          </label>
          <div className="flex gap-3 flex-wrap">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, avatarColor: color })}
                className={`w-12 h-12 rounded-full transition-all ${
                  formData.avatarColor === color 
                    ? 'ring-4 ring-primary ring-offset-2' 
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        {formData.avatar && (
          <div className="mb-8 p-6 bg-bg-gray rounded-lg">
            <p className="text-sm font-medium text-navy mb-3">Preview:</p>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: formData.avatarColor }}
              >
                {formData.avatar}
              </div>
              <div>
                <p className="font-semibold text-navy">{formData.name || 'Client Name'}</p>
                <p className="text-sm text-primary">{formData.industry}</p>
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
            Create Client
          </button>
        </div>
      </form>
    </div>
  );
}
