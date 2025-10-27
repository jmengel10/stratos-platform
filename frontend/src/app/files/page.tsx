'use client';
import { Upload, FileText } from 'lucide-react';

export default function FilesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">File Library</h1>
          <p className="text-gray-text mt-2">All your documents, frameworks, and artifacts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Upload className="w-5 h-5" />
          Upload Files
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-border rounded-lg p-8">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No files yet</h3>
          <p className="text-gray-text mb-6">Upload your first document or framework</p>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            Upload Your First File
          </button>
        </div>
      </div>
    </div>
  );
}