'use client';

import { ArrowLeft, Users, FolderOpen, MessageSquare, Calendar, Edit } from 'lucide-react';
import Link from 'next/link';
import { getAllClients } from '@/lib/storage';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  
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
        <button 
          onClick={() => console.log('Edit client:', params.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-text hover:text-navy"
          title="Edit Client"
        >
          <Edit className="w-5 h-5" />
        </button>
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
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white border border-border rounded-lg p-8">
        <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Projects</h2>
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No projects yet</h3>
          <p className="text-gray-text mb-6">Start a new project for this client</p>
          <Link 
            href={`/projects/new?clientId=${params.id}`}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
          >
            Create New Project
          </Link>
        </div>
      </div>
    </div>
  );
}
