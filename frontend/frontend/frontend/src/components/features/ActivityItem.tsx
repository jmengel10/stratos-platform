import { MessageSquare, FileText, FolderOpen, Users, Calendar } from 'lucide-react';

interface ActivityItemProps {
  activity: {
    id: string;
    type: 'conversation' | 'document' | 'project' | 'team' | 'calendar';
    title: string;
    description: string;
    user: string;
    timestamp: string;
  };
}

const icons = {
  conversation: MessageSquare,
  document: FileText,
  project: FolderOpen,
  team: Users,
  calendar: Calendar
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = icons[activity.type];

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-navy">
          <span className="font-medium">{activity.title}</span>
          <span className="text-gray-text"> {activity.description}</span>
          <span className="text-gray-500"> by {activity.user}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}
