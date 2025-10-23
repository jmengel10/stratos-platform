'use client';

import { Search, Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProjectCard } from '@/components/features/ProjectCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockProjects } from '@/lib/mockData';

export default function ProjectsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Projects' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your strategic projects and initiatives</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by project name or client..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Clients</option>
          <option>Acme Corporation</option>
          <option>TechVentures Group</option>
          <option>HealthFirst Systems</option>
        </select>
        
        <select className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Status</option>
          <option>Active</option>
          <option>In Progress</option>
          <option>Planning</option>
          <option>Completed</option>
        </select>
        
        <div className="flex border border-border rounded-lg">
          <button className="p-2 bg-primary text-white rounded-l-lg">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-gray-600">Showing 1-6 of 18 projects</span>
        <div className="flex items-center space-x-1 ml-4">
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">‹</button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}
