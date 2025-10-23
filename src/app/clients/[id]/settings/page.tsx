'use client';

import { useParams } from 'next/navigation';
import { 
  Calendar, 
  User, 
  Edit, 
  Plus,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockClients } from '@/lib/mockData';

export default function ClientSettingsPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  const client = mockClients.find(c => c.id === clientId) || mockClients[0];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Clients', href: '/clients' },
        { label: client.name },
        { label: 'Settings' }
      ]} />

      {/* Client Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Avatar name={client.name} size="xl" />
          <div>
            <h1 className="text-4xl font-bold text-navy font-serif">{client.name}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Client since {client.clientSince}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Primary: {client.primaryContact}</span>
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
                <Calendar className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <User className="w-4 h-4" />
                <span>Permissions</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Edit className="w-4 h-4" />
                <span>Integrations</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>Activity Log</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Edit className="w-4 h-4" />
                <span>Archive/Delete</span>
              </button>
            </nav>
          </Card>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-navy font-serif mb-6">General Settings</h3>
            
            <form className="space-y-6">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <input
                  type="text"
                  defaultValue={client.name}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="financial-services">Financial Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="technology">Technology</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>

              {/* Client Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="clientType" value="enterprise" defaultChecked className="mr-2" />
                    <span className="text-sm">Enterprise</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="clientType" value="mid-market" className="mr-2" />
                    <span className="text-sm">Mid-Market</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="clientType" value="startup" className="mr-2" />
                    <span className="text-sm">Startup</span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-600">Client is currently active</p>
                </div>
                <div className="relative">
                  <input type="checkbox" id="status" defaultChecked className="sr-only" />
                  <label htmlFor="status" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-6 bg-primary rounded-full shadow-inner"></div>
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="default" className="flex items-center space-x-1">
                    <span>High Priority</span>
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                  <Badge variant="default" className="flex items-center space-x-1">
                    <span>Strategic Account</span>
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Enter client description..."
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Client Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Logo</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>
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
