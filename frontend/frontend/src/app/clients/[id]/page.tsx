'use client';

<<<<<<< HEAD
import { Calendar, User, Edit, Plus, FolderOpen, MessageSquare, FileText, Clock, MoreVertical, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getClientById, getProjectsByClientId } from '@/lib/mockData';

export async function generateStaticParams() {
  return [
    { id: 'client_1' },
    { id: 'client_2' },
    { id: 'client_3' },
    { id: 'client_4' },
    { id: 'client_5' },
    { id: 'client_6' }
  ];
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const client = getClientById(params.id);
  const projects = getProjectsByClientId(params.id);

  if (!client) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-4">Client not found</h1>
          <button 
            onClick={() => router.push('/clients')}
            className="bg-[#33A7B5] text-white px-4 py-2 rounded-lg hover:bg-[#33A7B5]/90 transition-colors"
          >
            Back to Clients
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
        </span> &gt; {client.name}
      </div>

      {/* Client Header */}
      <div className="bg-white border-b border-[#E5E7EB] p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
              style={{ backgroundColor: client.avatarColor }}
            >
              {client.avatar}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#0F172A] font-serif">{client.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-[#6B7280]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Client since March 2022</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Industry: {client.industry}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-gray-50">
              <Edit className="w-4 h-4" />
              <span>Edit Client</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#33A7B5] text-white rounded-lg hover:bg-[#33A7B5]/90">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] mt-8">
          <button className="pb-3 px-4 text-[#0F172A] font-semibold border-b-3 border-[#33A7B5]">Overview</button>
          <button className="pb-3 px-4 text-[#6B7280] hover:text-[#0F172A]">Information</button>
          <button className="pb-3 px-4 text-[#6B7280] hover:text-[#0F172A]">Settings</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <FolderOpen className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{client.projects}</p>
              <p className="text-sm text-[#6B7280] text-right">Total Projects</p>
              <p className="text-xs text-[#6B7280] text-right">{projects.filter(p => p.status === 'active').length} active</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <MessageSquare className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{client.conversations}</p>
              <p className="text-sm text-[#6B7280] text-right">Active Conversations</p>
              <p className="text-xs text-[#6B7280] text-right">Last 30 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <FileText className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">43</p>
              <p className="text-sm text-[#6B7280] text-right">Artifacts Generated</p>
              <p className="text-xs text-[#6B7280] text-right">Frameworks & decks</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Clock className="w-6 h-6 text-[#33A7B5]" />
            <div>
              <p className="text-4xl font-bold text-[#0F172A] text-right">{client.lastActive}</p>
              <p className="text-sm text-[#6B7280] text-right">Last Engagement</p>
              <p className="text-xs text-[#6B7280] text-right">GTM Strategy call</p>
=======
import { ArrowLeft, Users, FolderOpen, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllClients } from '@/lib/storage';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-text mb-6">
        <Link href="/home" className="hover:text-navy">Home</Link>
        <span>/</span>
        <Link href="/clients" className="hover:text-navy">Clients</Link>
        <span>/</span>
        <span className="text-navy">Client Details</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-text" />
          </Link>
          <div>
            <h1 className="text-4xl font-serif font-bold text-navy">Client Details</h1>
            <p className="text-gray-text mt-2">Client ID: {params.id}</p>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-lg p-8">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Client Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-text">Company Name</label>
                <p className="text-navy">Acme Corporation</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-text">Industry</label>
                <p className="text-navy">Financial Services</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-text">Contact Person</label>
                <p className="text-navy">John Smith</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-text">Email</label>
                <p className="text-navy">john@acme.com</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-border rounded-lg p-8">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-text">Active Projects</p>
                  <p className="text-xl font-bold text-navy">6</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-text">Conversations</p>
                  <p className="text-xl font-bold text-navy">24</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-text">Last Active</p>
                  <p className="text-xl font-bold text-navy">2 days ago</p>
                </div>
              </div>
>>>>>>> 8153a21137d1aeba7c97ed95965a430c8439521c
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
<<<<<<< HEAD
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">Projects</h2>
          <div className="flex items-center space-x-1">
            <button className="p-2 bg-[#33A7B5] text-white rounded-lg">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#33A7B5] rounded-full flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0F172A]">{project.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-[#33A7B5]/10 text-[#33A7B5] text-xs rounded-full">{project.type}</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'active' ? 'bg-green-500' : 
                          project.status === 'in-progress' ? 'bg-blue-500' : 
                          project.status === 'planning' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <span className={`text-sm ${
                          project.status === 'active' ? 'text-green-600' : 
                          project.status === 'in-progress' ? 'text-blue-600' : 
                          project.status === 'planning' ? 'text-yellow-600' : 'text-gray-600'
                        }`}>{project.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="p-1 text-[#6B7280] hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6B7280]">Progress</span>
                  <span className="text-sm font-medium text-[#0F172A]">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#33A7B5] h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#6B7280]">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{project.conversations} conversations</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{project.members} members</span>
                  </div>
                </div>
                <p>Started {project.startDate} • Due {project.dueDate}</p>
                <p>Active {project.lastActive}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { icon: MessageSquare, text: 'New conversation started in GTM Strategy 2024', time: '2 hours ago' },
            { icon: FileText, text: 'Framework document generated', time: '5 hours ago' },
            { icon: FolderOpen, text: 'Operations Review Q1 marked as completed', time: 'Yesterday' },
            { icon: User, text: 'New team member added to Digital Transformation', time: '2 days ago' },
            { icon: Calendar, text: 'Board Advisory meeting scheduled', time: '3 days ago' },
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="flex-1 text-[#6B7280]">{activity.text}</p>
                <span className="text-xs text-[#6B7280]">{activity.time}</span>
              </div>
            );
          })}
=======
      <div className="bg-white border border-border rounded-lg p-8">
        <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Projects</h2>
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No projects yet</h3>
          <p className="text-gray-text mb-6">Start a new project for this client</p>
          <button 
            onClick={() => router.push(`/projects/new?clientId=${params.id}`)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Project
          </button>
>>>>>>> 8153a21137d1aeba7c97ed95965a430c8439521c
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8153a21137d1aeba7c97ed95965a430c8439521c
