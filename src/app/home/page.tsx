'use client';

import { 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  Target,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  FileText
} from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { ActivityItem } from '@/components/features/ActivityItem';
import { mockActivity } from '@/lib/mockData';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-navy font-serif">Welcome back, Sarah</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your work today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Briefcase className="w-8 h-8" />}
          label="Total Clients"
          value="12"
          subtext="↑+2"
          trend={{ value: "+2", positive: true }}
        />
        <StatsCard
          icon={<FolderOpen className="w-8 h-8" />}
          label="Active Projects"
          value="18"
          subtext="↑+3"
          trend={{ value: "+3", positive: true }}
        />
        <StatsCard
          icon={<MessageSquare className="w-8 h-8" />}
          label="Conversations"
          value="47"
          subtext="↑+15"
          trend={{ value: "+15", positive: true }}
        />
        <StatsCard
          icon={<Target className="w-8 h-8" />}
          label="Completion Rate"
          value="78%"
          subtext="↑+5%"
          trend={{ value: "+5%", positive: true }}
        />
      </div>

      {/* Activity Overview Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-navy font-serif">Activity Overview</h3>
            <p className="text-gray-600">Your activity for the past 7 days</p>
          </div>
        </div>
        
        {/* Simple chart representation */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
          {[20, 35, 25, 40, 30, 45, 50].map((height, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 bg-primary rounded-t"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-gray-600">Conversations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full" />
            <span className="text-sm text-gray-600">Projects</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-navy">New Client</h3>
              <p className="text-sm text-gray-600">Add a new client to organize projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-navy">New Project</h3>
              <p className="text-sm text-gray-600">Start a new project for a client</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-primary text-white hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">New Chat</h3>
              <p className="text-sm text-white/80">Start a new conversation for a project</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">+</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">GTM Strategy Call</p>
                <p className="text-sm text-gray-600">Acme Corporation • 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">Team Meeting</p>
                <p className="text-sm text-gray-600">Tomorrow • 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-navy">Report Review</p>
                <p className="text-sm text-gray-600">Friday • 3:00 PM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}