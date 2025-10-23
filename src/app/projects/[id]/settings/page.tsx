'use client';

import { useParams } from 'next/navigation';
import { 
  Calendar, 
  User, 
  Edit, 
  Plus,
  FolderOpen,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockProjects } from '@/lib/mockData';

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const project = mockProjects.find(p => p.id === projectId) || mockProjects[0];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Clients', href: '/clients' },
        { label: 'Acme Corporation', href: '/clients/1' },
        { label: project.title },
        { label: 'Settings' }
      ]} />

      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-navy font-serif">{project.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Client since March 2022</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Primary: John Williams, CFO</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Client</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button className="pb-3 text-gray-600 hover:text-navy">
            Overview
          </button>
          <button className="pb-3 text-gray-600 hover:text-navy">
            Information
          </button>
          <button className="pb-3 border-b-3 border-primary text-navy font-semibold">
            Settings
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-primary text-white rounded-lg">
                <User className="w-4 h-4" />
                <span>General</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <User className="w-4 h-4" />
                <span>Team & Permissions</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Edit className="w-4 h-4" />
                <span>Danger Zone</span>
              </button>
            </nav>
          </Card>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-navy font-serif mb-6">General Settings</h3>
            
            <form className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  defaultValue={project.title}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter project description..."
                  defaultValue={project.description}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="gtm-strategy">GTM Strategy</option>
                  <option value="operations">Operations</option>
                  <option value="technology">Technology</option>
                  <option value="advisory">Advisory</option>
                  <option value="ma">M&A</option>
                  <option value="strategy">Strategy</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="status" value="active" defaultChecked className="mr-2" />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="status" value="on-hold" className="mr-2" />
                    <span className="text-sm">On Hold</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="status" value="completed" className="mr-2" />
                    <span className="text-sm">Completed</span>
                  </label>
                </div>
              </div>

              {/* Start Date / Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="default">
                      <span className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <X className="w-3 h-3 cursor-pointer" />
                      </span>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button variant="secondary" size="sm">Add</Button>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <input
                  type="text"
                  defaultValue={project.budget}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-6">
                <Button variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
                <Button variant="secondary" className="flex items-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
