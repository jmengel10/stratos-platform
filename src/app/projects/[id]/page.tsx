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
import { mockProjects, mockActivity } from '@/lib/mockData';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  // Find project data (in real app, this would be from API)
  const project = mockProjects.find(p => p.id === projectId) || mockProjects[0];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Clients', href: '/clients' },
        { label: 'Acme Corporation', href: '/clients/1' },
        { label: project.title }
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
          {mockProjects.map((project) => (
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