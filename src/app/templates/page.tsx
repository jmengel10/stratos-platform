'use client';

import { 
  Search, 
  Grid, 
  List, 
  Plus,
  Star,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TemplateCard } from '@/components/features/TemplateCard';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockTemplates } from '@/lib/mockData';

export default function TemplatesPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Templates' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Template Library</h1>
          <p className="text-gray-600 mt-2">Reusable frameworks and templates to accelerate your strategic work</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex border border-border rounded-lg">
          <button className="p-2 bg-primary text-white rounded-l-lg">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center space-x-2">
        <Badge variant="primary" className="px-4 py-2">All Templates</Badge>
        <Badge variant="default" className="px-4 py-2">GTM Strategy</Badge>
        <Badge variant="default" className="px-4 py-2">Operations</Badge>
        <Badge variant="default" className="px-4 py-2">Fundraising</Badge>
        <Badge variant="default" className="px-4 py-2">Product</Badge>
        <Badge variant="default" className="px-4 py-2">Data Analysis</Badge>
      </div>

      {/* Featured Templates */}
      <div>
        <h2 className="text-2xl font-semibold text-navy font-serif mb-6">Featured Templates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockTemplates.filter(t => t.featured).map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Badge variant="planning">Featured</Badge>
                </div>
                
                <div 
                  className="w-full h-48 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: template.previewColor }}
                >
                  {template.title.charAt(0)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">{template.category}</Badge>
                  </div>
                  
                  <h3 className="font-semibold text-navy font-serif text-xl">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{template.uses} uses</span>
                    </div>
                  </div>
                  <span>by {template.author}</span>
                </div>

                <Button variant="primary" className="w-full">
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-2xl font-semibold text-navy font-serif mb-6">All Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-gray-600">Showing 1-12 of 48 templates</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">‹</button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">4</button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">13</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}
