import { FolderOpen, MessageSquare, Users, Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    type: string;
    status: 'active' | 'in-progress' | 'planning' | 'completed';
    progress: number;
    conversations: number;
    members: number;
    startDate: string;
    dueDate: string;
    lastActive: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusVariants = {
    active: 'active',
    'in-progress': 'in-progress', 
    planning: 'planning',
    completed: 'completed'
  } as const;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <FolderOpen className="w-6 h-6 text-primary" />
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-navy font-serif">{project.title}</h3>
        
        <div className="flex space-x-2">
          <Badge variant="default">{project.type}</Badge>
          <Badge variant={statusVariants[project.status]}>
            {project.status === 'in-progress' ? 'In Progress' : 
             project.status === 'active' ? 'Active' :
             project.status === 'planning' ? 'Planning' : 'Completed'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{project.progress}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{project.conversations} conversations</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{project.members} members</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Started {project.startDate} • Due {project.dueDate}</span>
        </div>

        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Active {project.lastActive}</span>
        </div>
      </div>
    </Card>
  );
}
