<<<<<<< HEAD
'use client';

import { Calendar, User, Edit, Plus, FolderOpen, MessageSquare, FileText, Clock, MoreVertical, Grid, List, Target, TrendingUp, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getProjectById, getConversationsByProjectId, getClientById } from '@/lib/mockData';

export async function generateStaticParams() {
  return [
    { id: 'proj_1' },
    { id: 'proj_2' },
    { id: 'proj_3' },
    { id: 'proj_4' },
    { id: 'proj_5' }
=======
import { ArrowLeft, FolderOpen, MessageSquare, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
>>>>>>> 8153a21137d1aeba7c97ed95965a430c8439521c
  ];
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
<<<<<<< HEAD
  const router = useRouter();
  const project = getProjectById(params.id);
  const conversations = getConversationsByProjectId(params.id);
  const client = project ? getClientById(project.clientId) : null;

  if (!project || !client) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-4">Project not found</h1>
          <button 
            onClick={() => router.push('/projects')}
            className="bg-[#33A7B5] text-white px-4 py-2 rounded-lg hover:bg-[#33A7B5]/90 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-[#6B7280]">
        <span 
          className="hover:text-[#0F172A] cursor-pointer"
          onClick={() => router.push('/home')}
        >
          Home
        </span> &gt; <span 
          className="hover:text-[#0F172A] cursor-pointer"
          onClick={() => router.push('/clients')}
        >
          Clients
        </span> &gt; <span 
          className="hover:text-[#0F172A] cursor-pointer"
          onClick={() => router.push(`/clients/${client.id}`)}
        >
          {client.name}
        </span> &gt; {project.name}
      </div>

      {/* Project Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-[#33A7B5] rounded-full flex items-center justify-center text-white">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#0F172A] font-serif">{project.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-[#6B7280]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started {project.startDate} • Due {project.dueDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{project.members} team members</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-gray-50">
              <Edit className="w-4 h-4" />
              <span>Edit Project</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-[#33A7B5] text-white rounded-lg hover:bg-[#33A7B5]/90"
              onClick={() => router.push(`/conversations/new?projectId=${project.id}`)}
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <MessageSquare className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{project.conversations}</p>
              <p className="text-sm text-[#6B7280] text-right">Total Conversations</p>
              <p className="text-xs text-[#6B7280] text-right">Active discussions</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Target className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{project.progress}%</p>
              <p className="text-sm text-[#6B7280] text-right">Progress</p>
              <p className="text-xs text-[#6B7280] text-right">Completion rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <User className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{project.members}</p>
              <p className="text-sm text-[#6B7280] text-right">Team Members</p>
              <p className="text-xs text-[#6B7280] text-right">Active contributors</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Clock className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{project.lastActive}</p>
              <p className="text-sm text-[#6B7280] text-right">Last Activity</p>
              <p className="text-xs text-[#6B7280] text-right">Recent engagement</p>
=======
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-text mb-6">
        <Link href="/home" className="hover:text-navy">Home</Link>
        <span>/</span>
        <Link href="/clients" className="hover:text-navy">Clients</Link>
        <span>/</span>
        <Link href="/clients/acme" className="hover:text-navy">Acme Corporation</Link>
        <span>/</span>
        <span className="text-navy">Project Details</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-text" />
          </Link>
          <div>
            <h1 className="text-4xl font-serif font-bold text-navy">Project Details</h1>
            <p className="text-gray-text mt-2">Project ID: {params.id}</p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-lg p-8">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Project Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-text">Project Name</label>
                <p className="text-navy">GTM Strategy 2024</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-text">Client</label>
                <p className="text-navy">Acme Corporation</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-text">Status</label>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-text">Description</label>
                <p className="text-navy">Comprehensive go-to-market strategy for 2024 expansion</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-border rounded-lg p-8">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Project Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-text">Conversations</p>
                  <p className="text-xl font-bold text-navy">8</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-text">Created</p>
                  <p className="text-xl font-bold text-navy">2 weeks ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-text">Team Members</p>
                  <p className="text-xl font-bold text-navy">3</p>
                </div>
              </div>
>>>>>>> 8153a21137d1aeba7c97ed95965a430c8439521c
            </div>
          </div>
        </div>
      </div>

      {/* Conversations Section */}
<<<<<<< HEAD
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">Conversations</h2>
          <div className="flex items-center space-x-1">
            <button className="p-2 bg-[#33A7B5] text-white rounded-lg">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/conversations/${conversation.id}`)}
            >
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: conversation.agentColor }}
                >
                  {conversation.agentAvatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#0F172A]">{conversation.title}</h3>
                    <span className="text-sm text-[#6B7280]">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-2">{conversation.agent}</p>
                  <p className="text-[#6B7280]">{conversation.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left hover:shadow-md transition-shadow"
          onClick={() => router.push(`/conversations/new?projectId=${project.id}&agent=gtm-strategist`)}
        >
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-[#33A7B5]" />
            <span className="text-[#0F172A] font-medium">GTM Strategy Chat</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Start a strategic planning conversation</p>
        </button>

        <button 
          className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left hover:shadow-md transition-shadow"
          onClick={() => router.push(`/conversations/new?projectId=${project.id}&agent=data-analyst`)}
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-[#33A7B5]" />
            <span className="text-[#0F172A] font-medium">Data Analysis</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Analyze project data and metrics</p>
        </button>

        <button 
          className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-left hover:shadow-md transition-shadow"
          onClick={() => router.push(`/conversations/new?projectId=${project.id}&agent=operations-analyst`)}
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-[#33A7B5]" />
            <span className="text-[#0F172A] font-medium">Operations Review</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Review operational efficiency</p>
        </button>
=======
      <div className="bg-white border border-border rounded-lg p-8">
        <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Recent Conversations</h2>
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No conversations yet</h3>
          <p className="text-gray-text mb-6">Start a new conversation for this project</p>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            Start New Conversation
          </button>
        </div>
>>>>>>> 8153a21137d1aeba7c97ed95965a430c8439521c
      </div>
    </div>
  );
}
