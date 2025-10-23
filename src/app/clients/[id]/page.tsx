'use client';

import { useParams } from 'next/navigation';

import { 
  Calendar, 
  User, 
  Edit, 
  Plus,
  FolderOpen,
  MessageSquare,
  FileText,
  Clock,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProjectCard } from '@/components/features/ProjectCard';
import { ActivityItem } from '@/components/features/ActivityItem';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockClients, mockProjects, mockActivity } from '@/lib/mockData';

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  // Find client data (in real app, this would be from API)
  const client = mockClients.find(c => c.id === clientId) || mockClients[0];
  const clientProjects = mockProjects.filter(p => p.clientId === clientId);

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Clients', href: '/clients' },
        { label: client.name }
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
          <button className="pb-3 border-b-3 border-primary text-navy font-semibold">
            Overview
          </button>
          <button className="pb-3 text-gray-600 hover:text-navy">
            Information
          </button>
          <button className="pb-3 text-gray-600 hover:text-navy">
            Settings
          </button>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<FolderOpen className="w-8 h-8" />}
          label="Total Projects"
          value="6"
          subtext="2 active"
        />
        <StatsCard
          icon={<MessageSquare className="w-8 h-8" />}
          label="Active Conversations"
          value="18"
          subtext="Last 30 days"
        />
        <StatsCard
          icon={<FileText className="w-8 h-8" />}
          label="Artifacts Generated"
          value="43"
          subtext="Frameworks & decks"
        />
        <StatsCard
          icon={<Clock className="w-8 h-8" />}
          label="Last Engagement"
          value="2 days ago"
          subtext="GTM Strategy call"
        />
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy font-serif">Projects</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-primary text-white rounded-lg">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-navy font-serif mb-6">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}