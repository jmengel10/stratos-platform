'use client';
import { Plus, Copy } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Template Library</h1>
          <p className="text-gray-text mt-2">Reusable frameworks to accelerate your work</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-border rounded-lg p-8">
        <div className="text-center py-12">
          <Copy className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No templates yet</h3>
          <p className="text-gray-text mb-6">Create your first reusable template</p>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            Create Your First Template
          </button>
        </div>
      </div>
    </div>
  );
}