import { ArrowLeft, FolderOpen, MessageSquare, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
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
            </div>
          </div>
        </div>
      </div>

      {/* Conversations Section */}
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
      </div>
    </div>
  );
}
