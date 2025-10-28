'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, Plus, FileText, Image, Video, Archive, BookOpen, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

type ResourceType = 'all' | 'documents' | 'templates' | 'guides' | 'videos' | 'images';
type ResourceCategory = 'all' | 'strategy' | 'operations' | 'marketing' | 'finance' | 'legal';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'template' | 'guide' | 'video' | 'image';
  category: 'strategy' | 'operations' | 'marketing' | 'finance' | 'legal';
  size: string;
  downloads: number;
  lastUpdated: string;
  author: string;
  tags: string[];
  thumbnail?: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Strategic Planning Framework',
    description: 'Comprehensive guide for developing strategic plans with templates and examples.',
    type: 'template',
    category: 'strategy',
    size: '2.4 MB',
    downloads: 156,
    lastUpdated: '2 days ago',
    author: 'Sarah Chen',
    tags: ['strategy', 'planning', 'framework'],
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Market Analysis Template',
    description: 'Excel template for conducting thorough market analysis and competitive research.',
    type: 'template',
    category: 'strategy',
    size: '1.8 MB',
    downloads: 89,
    lastUpdated: '1 week ago',
    author: 'Mike Johnson',
    tags: ['market', 'analysis', 'excel'],
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Operations Playbook',
    description: 'Step-by-step guide for optimizing business operations and processes.',
    type: 'guide',
    category: 'operations',
    size: '5.2 MB',
    downloads: 234,
    lastUpdated: '3 days ago',
    author: 'Alex Thompson',
    tags: ['operations', 'process', 'optimization'],
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '4',
    title: 'Financial Modeling Best Practices',
    description: 'Video tutorial covering advanced financial modeling techniques.',
    type: 'video',
    category: 'finance',
    size: '45 MB',
    downloads: 67,
    lastUpdated: '1 week ago',
    author: 'Maria Rodriguez',
    tags: ['finance', 'modeling', 'tutorial'],
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '5',
    title: 'Brand Guidelines Template',
    description: 'Comprehensive brand guidelines template for client presentations.',
    type: 'template',
    category: 'marketing',
    size: '3.1 MB',
    downloads: 123,
    lastUpdated: '5 days ago',
    author: 'Sarah Chen',
    tags: ['branding', 'guidelines', 'presentation'],
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '6',
    title: 'Legal Compliance Checklist',
    description: 'Checklist for ensuring legal compliance across different jurisdictions.',
    type: 'document',
    category: 'legal',
    size: '890 KB',
    downloads: 45,
    lastUpdated: '2 weeks ago',
    author: 'Legal Team',
    tags: ['legal', 'compliance', 'checklist'],
    thumbnail: '/api/placeholder/300/200'
  }
];

const typeIcons = {
  document: FileText,
  template: BookOpen,
  guide: BookOpen,
  video: Video,
  image: Image
};

const typeColors = {
  document: 'bg-blue-100 text-blue-800',
  template: 'bg-green-100 text-green-800',
  guide: 'bg-purple-100 text-purple-800',
  video: 'bg-red-100 text-red-800',
  image: 'bg-yellow-100 text-yellow-800'
};

const categoryColors = {
  strategy: 'bg-blue-500',
  operations: 'bg-green-500',
  marketing: 'bg-purple-500',
  finance: 'bg-yellow-500',
  legal: 'bg-red-500'
};

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType>('all');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'name'>('recent');

  const filteredResources = useMemo(() => {
    return mockResources
      .filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = selectedType === 'all' || 
          (selectedType === 'documents' && resource.type === 'document') ||
          (selectedType === 'templates' && resource.type === 'template') ||
          (selectedType === 'guides' && resource.type === 'guide') ||
          (selectedType === 'videos' && resource.type === 'video') ||
          (selectedType === 'images' && resource.type === 'image');
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.downloads - a.downloads;
          case 'name':
            return a.title.localeCompare(b.title);
          case 'recent':
          default:
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        }
      });
  }, [searchTerm, selectedType, selectedCategory, sortBy]);

  const handleDownload = (resource: Resource) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', resource.title);
    // You could show a toast notification here
  };

  const handleView = (resource: Resource) => {
    // In a real app, this would open a preview modal or navigate to viewer
    console.log('Viewing:', resource.title);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Resources' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Resources</h1>
          <p className="text-gray-600 mt-2">Access templates, guides, and documents for your consulting projects</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Request Resource</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ResourceType)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33A7B5]"
            >
              <option value="all">All Types</option>
              <option value="documents">Documents</option>
              <option value="templates">Templates</option>
              <option value="guides">Guides</option>
              <option value="videos">Videos</option>
              <option value="images">Images</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory)}
            className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33A7B5]"
          >
            <option value="all">All Categories</option>
            <option value="strategy">Strategy</option>
            <option value="operations">Operations</option>
            <option value="marketing">Marketing</option>
            <option value="finance">Finance</option>
            <option value="legal">Legal</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'name')}
            className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33A7B5]"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </Card>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Card className="p-12 text-center">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-navy mb-2">No resources found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button variant="secondary" onClick={() => {
            setSearchTerm('');
            setSelectedType('all');
            setSelectedCategory('all');
          }}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = typeIcons[resource.type];
            return (
              <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {resource.thumbnail ? (
                    <img 
                      src={resource.thumbnail} 
                      alt={resource.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <TypeIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-navy text-lg leading-tight">{resource.title}</h3>
                    <Badge className={typeColors[resource.type]}>
                      {resource.type}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{resource.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{resource.lastUpdated}</span>
                      </span>
                    </div>
                    <span>{resource.size}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{resource.downloads} downloads</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(resource)}
                        className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(resource)}
                        className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Request New Resource */}
      <Card className="p-6 bg-gradient-to-r from-[#33A7B5] to-[#0F172A] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Need a specific resource?</h3>
            <p className="text-blue-100">Request templates, guides, or documents that would help your team</p>
          </div>
          <Button variant="secondary" className="bg-white text-[#33A7B5] hover:bg-gray-100">
            Submit Request
          </Button>
        </div>
      </Card>
    </div>
  );
}
