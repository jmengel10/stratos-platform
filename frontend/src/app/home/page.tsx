'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { useTenant } from '@/hooks/useTenant';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import {
  Users, FolderKanban, MessageSquare, Plus,
  Building, TrendingUp, Clock, ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const tenant = useTenant();
  const { clients, fetchClients, isLoading: clientsLoading } = useClientStore();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore();

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, [fetchClients, fetchProjects]);

  const recentClients = clients.slice(0, 5);
  const recentProjects = projects.slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: tenant.colors.background }}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/settings')}
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ 
                fontFamily: tenant.fonts.heading,
                color: tenant.colors.primary 
              }}
            >
              Welcome back, {user?.name}!
            </h1>
            <p 
              className="text-lg md:text-xl"
              style={{ color: tenant.colors.text, opacity: 0.7 }}
            >
              {tenant.tagline}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Actions */}
          <div className="mb-12">
            <h2 
              className="text-2xl font-semibold mb-6"
              style={{ 
                fontFamily: tenant.fonts.heading,
                color: tenant.colors.primary 
              }}
            >
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* New Client */}
              <button
                onClick={() => router.push('/clients?action=new')}
                className="bg-white rounded-xl border-2 border-dashed hover:shadow-lg p-8 transition-all group"
                style={{ 
                  borderColor: tenant.colors.accent,
                  borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tenant.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = tenant.colors.accent;
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-all"
                    style={{ 
                      backgroundColor: `${tenant.colors.primary}15`,
                      borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                    }}
                  >
                    <Building 
                      className="w-8 h-8" 
                      style={{ color: tenant.colors.primary }}
                    />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold text-lg mb-1"
                      style={{ color: tenant.colors.text }}
                    >
                      New Client
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: tenant.colors.text, opacity: 0.6 }}
                    >
                      Add a new client to your portfolio
                    </p>
                  </div>
                </div>
              </button>

              {/* New Project */}
              <button
                onClick={() => router.push('/clients?action=new-project')}
                className="bg-white rounded-xl border-2 border-dashed hover:shadow-lg p-8 transition-all group"
                style={{ 
                  borderColor: tenant.colors.accent,
                  borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tenant.colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = tenant.colors.accent;
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-all"
                    style={{ 
                      backgroundColor: `${tenant.colors.secondary}15`,
                      borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                    }}
                  >
                    <FolderKanban 
                      className="w-8 h-8" 
                      style={{ color: tenant.colors.secondary }}
                    />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold text-lg mb-1"
                      style={{ color: tenant.colors.text }}
                    >
                      New Project
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: tenant.colors.text, opacity: 0.6 }}
                    >
                      Start a new project for a client
                    </p>
                  </div>
                </div>
              </button>

              {/* Continue Working */}
              <button
                onClick={() => {
                  if (recentProjects.length > 0) {
                    router.push(`/projects/${recentProjects[0].id}`);
                  } else {
                    router.push('/clients');
                  }
                }}
                className="bg-white rounded-xl border-2 hover:shadow-lg p-8 transition-all group"
                style={{ 
                  borderColor: tenant.colors.primary,
                  backgroundColor: `${tenant.colors.primary}05`,
                  borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: tenant.colors.primary,
                      borderRadius: tenant.id === 'sparkworks' ? '1rem' : '0.75rem'
                    }}
                  >
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold text-lg mb-1"
                      style={{ color: tenant.colors.primary }}
                    >
                      Continue Working
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: tenant.colors.text, opacity: 0.6 }}
                    >
                      Pick up where you left off
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Clients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-xl font-semibold"
                  style={{ 
                    fontFamily: tenant.fonts.heading,
                    color: tenant.colors.primary 
                  }}
                >
                  Recent Clients
                </h2>
                <button
                  onClick={() => router.push('/clients')}
                  className="text-sm flex items-center gap-1 hover:underline"
                  style={{ color: tenant.colors.primary }}
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {clientsLoading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <div 
                    className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto"
                    style={{ borderColor: `${tenant.colors.primary} transparent transparent transparent` }}
                  />
                  <p className="mt-4 text-sm" style={{ color: tenant.colors.text, opacity: 0.6 }}>
                    Loading clients...
                  </p>
                </div>
              ) : recentClients.length > 0 ? (
                <div className="space-y-3">
                  {recentClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => router.push(`/clients/${client.id}`)}
                      className="w-full bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all text-left flex items-center justify-between group"
                      style={{ borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem' }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white"
                          style={{ 
                            backgroundColor: tenant.colors.primary,
                            borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                          }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p 
                            className="font-medium"
                            style={{ color: tenant.colors.text }}
                          >
                            {client.name}
                          </p>
                          <p 
                            className="text-sm capitalize"
                            style={{ color: tenant.colors.text, opacity: 0.6 }}
                          >
                            {client.industry}
                          </p>
                        </div>
                      </div>
                      <ArrowRight 
                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: tenant.colors.primary }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                  <Building 
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: tenant.colors.accent }}
                  />
                  <p style={{ color: tenant.colors.text, opacity: 0.6 }}>
                    No clients yet
                  </p>
                  <button
                    onClick={() => router.push('/clients?action=new')}
                    className="mt-4 px-4 py-2 rounded-lg font-medium text-white transition-colors"
                    style={{ 
                      backgroundColor: tenant.colors.primary,
                      borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                    }}
                  >
                    Create your first client
                  </button>
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-xl font-semibold"
                  style={{ 
                    fontFamily: tenant.fonts.heading,
                    color: tenant.colors.primary 
                  }}
                >
                  Recent Projects
                </h2>
                <button
                  onClick={() => router.push('/clients')}
                  className="text-sm flex items-center gap-1 hover:underline"
                  style={{ color: tenant.colors.primary }}
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {projectsLoading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <div 
                    className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto"
                    style={{ borderColor: `${tenant.colors.secondary} transparent transparent transparent` }}
                  />
                  <p className="mt-4 text-sm" style={{ color: tenant.colors.text, opacity: 0.6 }}>
                    Loading projects...
                  </p>
                </div>
              ) : recentProjects.length > 0 ? (
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="w-full bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all text-left flex items-center justify-between group"
                      style={{ borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem' }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${tenant.colors.secondary}15`,
                            borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                          }}
                        >
                          <FolderKanban 
                            className="w-5 h-5" 
                            style={{ color: tenant.colors.secondary }}
                          />
                        </div>
                        <div>
                          <p 
                            className="font-medium"
                            style={{ color: tenant.colors.text }}
                          >
                            {project.name}
                          </p>
                          <p 
                            className="text-sm capitalize"
                            style={{ color: tenant.colors.text, opacity: 0.6 }}
                          >
                            {project.type.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <ArrowRight 
                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: tenant.colors.secondary }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                  <FolderKanban 
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: tenant.colors.accent }}
                  />
                  <p style={{ color: tenant.colors.text, opacity: 0.6 }}>
                    No projects yet
                  </p>
                  <button
                    onClick={() => router.push('/clients?action=new-project')}
                    className="mt-4 px-4 py-2 rounded-lg font-medium text-white transition-colors"
                    style={{ 
                      backgroundColor: tenant.colors.secondary,
                      borderRadius: tenant.id === 'sparkworks' ? '0.75rem' : '0.5rem'
                    }}
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
