'use client';

import { 
  Search, 
  Grid, 
  List, 
  Upload, 
  Database,
  FolderOpen,
  FileText,
  Download,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileCard } from '@/components/features/FileCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockFiles } from '@/lib/mockData';

export default function FilesPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Files' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">File Library</h1>
          <p className="text-gray-600 mt-2">All your documents, frameworks, and artifacts in one place</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </Button>
      </div>

      {/* Search and View Options */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search files, clients, or projects..."
            className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
          />
        </div>
        
        <div className="flex border border-[#E5E7EB] rounded-lg">
          <button className="p-2 bg-primary text-white rounded-l-lg">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Storage Usage */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-600">2.3 GB of 50 GB used</span>
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '4.6%' }}></div>
            </div>
          </div>
          <a href="#" className="text-sm text-primary hover:underline">Manage Storage</a>
        </div>
      </Card>

      {/* Clients Section */}
      <div>
        <h2 className="text-xl font-semibold text-navy font-serif mb-4">Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Acme Corp', 'TechVentures', 'HealthFirst', 'GlobalTech'].map((client, index) => (
            <Card key={client} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-purple-100' : 
                  index === 1 ? 'bg-green-100' : 
                  index === 2 ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  <FolderOpen className={`w-6 h-6 ${
                    index === 0 ? 'text-purple-600' : 
                    index === 1 ? 'text-green-600' : 
                    index === 2 ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">{client}</h3>
                  <p className="text-sm text-gray-600">1 project • files</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Projects Section */}
      <div>
        <h2 className="text-xl font-semibold text-navy font-serif mb-4">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['GTM Strategy 2024', 'Market Expansion', 'Operations Review', 'Digital Transformation'].map((project, index) => (
            <Card key={project} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-primary/20' : 
                  index === 1 ? 'bg-purple-100' : 
                  index === 2 ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <FolderOpen className={`w-6 h-6 ${
                    index === 0 ? 'text-primary' : 
                    index === 1 ? 'text-purple-600' : 
                    index === 2 ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">{project}</h3>
                  <p className="text-sm text-gray-600">
                    {index === 0 ? 'Acme Corp' : 
                     index === 1 ? 'TechVentures' : 
                     index === 2 ? 'HealthFirst' : 'GlobalTech'} • {index + 2} files
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Files Section */}
      <div>
        <h2 className="text-xl font-semibold text-navy font-serif mb-4">All Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockFiles.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-gray-600">Showing 1-12 of 12 files</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">‹</button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">3</button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">13</button>
          <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}
