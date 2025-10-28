import { Briefcase, MessageSquare, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    industry: string;
    projects: number;
    conversations: number;
    lastActive: string;
  };
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar name={client.name} size="xl" />
        
        <div>
          <h3 className="text-lg font-semibold text-navy font-serif">{client.name}</h3>
          <p className="text-sm text-gray-600">{client.industry}</p>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Briefcase className="w-4 h-4" />
            <span>{client.projects} Projects</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{client.conversations} Conversations</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Active {client.lastActive}</span>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </Card>
  );
}
