'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  Target,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  FileText,
  Plus,
  Play,
  ArrowRight
} from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { getAllClients, getAllProjects, getAllConversations } from '@/lib/storage';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalConversations: 0,
    completionRate: 0
  });

  const handleNavigation = (path: string) => {
    console.log(`Navigating to ${path}`);
    console.log('Current URL:', window.location.href);
    console.log('Target URL:', path);
    
    try {
      if (typeof window !== 'undefined') {
        // Try multiple navigation methods
        console.log('Method 1: window.location.href');
        window.location.href = path;
        
        // Fallback after 1 second if first method doesn't work
        setTimeout(() => {
          console.log('Method 2: window.location.assign');
          window.location.assign(path);
        }, 1000);
        
        // Final fallback after 2 seconds
        setTimeout(() => {
          console.log('Method 3: window.location.replace');
          window.location.replace(path);
        }, 2000);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert(`Navigation to ${path} failed. Please try refreshing the page.`);
    }
  };

  useEffect(() => {
    // Load data from storage
    const clients = getAllClients();
    const projects = getAllProjects();
    const conversations = getAllConversations();
    
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const completionRate = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0;

    setStats({
      totalClients: clients.length,
      activeProjects,
      totalConversations: conversations.length,
      completionRate
    });
  }, []);

  const isNewUser = stats.totalClients === 0 && stats.activeProjects === 0 && stats.totalConversations === 0;

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Briefcase className="w-12 h-12 text-primary" />
      </div>
      
      <h2 className="text-2xl font-serif font-semibold text-navy mb-4">
        Ready to start your strategic consulting journey?
      </h2>
      
      <p className="text-gray-text mb-8 max-w-2xl mx-auto">
        Get started by creating your first client and project. Our AI-powered platform will help you 
        manage your consulting practice efficiently and deliver exceptional results.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => handleNavigation('/clients/new')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Your First Client
        </button>
        
        <button
          onClick={() => handleNavigation('/help')}
          className="flex items-center gap-2 px-6 py-3 border border-border text-navy rounded-lg hover:border-primary transition-colors"
        >
          <Play className="w-5 h-5" />
          Take a Tour
        </button>
        
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('/clients/new')}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-navy">Add New Client</h3>
            <p className="text-sm text-gray-text">Create a new client profile</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('/projects/new')}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-navy">Start New Project</h3>
            <p className="text-sm text-gray-text">Begin a strategic engagement</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('/conversations/new')}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-navy">Start AI Conversation</h3>
            <p className="text-sm text-gray-text">Get strategic insights</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-serif font-bold text-navy mb-2">
          {isNewUser ? 'Welcome to Stratos!' : 'Welcome back, Sarah'}
        </h1>
        <p className="text-gray-text text-lg">
          {isNewUser 
            ? 'Let\'s get your strategic consulting practice started' 
            : 'Here\'s what\'s happening with your strategic consulting practice'
          }
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          icon={<Briefcase className="w-8 h-8" />}
          label="Total Clients"
          value={stats.totalClients.toString()}
          subtext={stats.totalClients > 0 ? `↑+${stats.totalClients}` : 'No clients yet'}
          trend={{ value: `+${stats.totalClients}`, positive: true }}
        />
        <StatsCard
          icon={<FolderOpen className="w-8 h-8" />}
          label="Active Projects"
          value={stats.activeProjects.toString()}
          subtext={stats.activeProjects > 0 ? `↑+${stats.activeProjects}` : 'No active projects'}
          trend={{ value: `+${stats.activeProjects}`, positive: true }}
        />
        <StatsCard
          icon={<MessageSquare className="w-8 h-8" />}
          label="Conversations"
          value={stats.totalConversations.toString()}
          subtext={stats.totalConversations > 0 ? `↑+${stats.totalConversations}` : 'No conversations yet'}
          trend={{ value: `+${stats.totalConversations}`, positive: true }}
        />
        <StatsCard
          icon={<Target className="w-8 h-8" />}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          subtext={stats.completionRate > 0 ? `↑+${stats.completionRate}%` : 'No projects completed'}
          trend={{ value: `+${stats.completionRate}%`, positive: true }}
        />
      </div>

      {/* Empty State or Quick Actions */}
      {isNewUser ? renderEmptyState() : renderQuickActions()}

      {/* Recent Activity Section */}
      {!isNewUser && (
        <div className="bg-white border border-border rounded-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-navy font-serif">Recent Activity</h3>
              <p className="text-gray-text">Your latest updates and progress</p>
            </div>
            <button 
              onClick={() => handleNavigation('/dashboard')}
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Activity Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-bg-gray rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy">Project "Market Analysis" completed</p>
                <p className="text-sm text-gray-text">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-bg-gray rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy">New conversation with Strategy AI</p>
                <p className="text-sm text-gray-text">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-bg-gray rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy">Client "TechCorp" added to platform</p>
                <p className="text-sm text-gray-text">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {!isNewUser && (
        <div className="bg-white border border-border rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-navy font-serif">Upcoming Tasks</h3>
              <p className="text-gray-text">Things to focus on this week</p>
            </div>
            <button 
              onClick={() => handleNavigation('/calendar')}
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
            >
              View Calendar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy">Follow up with TechCorp on Q1 strategy</p>
                <p className="text-sm text-gray-text">Due tomorrow</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy">Prepare presentation for board meeting</p>
                <p className="text-sm text-gray-text">Due Friday</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}