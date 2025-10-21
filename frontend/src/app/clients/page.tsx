'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useClientStore } from '@/store/clientStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Search, Building, Filter, ArrowLeft, FolderKanban
} from 'lucide-react';
import { INDUSTRIES } from '@/types/client.types';

export default function ClientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clients, fetchClients, isLoading } = useClientStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchClients();
    
    // Check if we should show create modal
    if (searchParams.get('action') === 'new') {
      router.push('/clients?modal=create');
    }
  }, []);

  useEffect(() => {
    const filters = {
      search: searchQuery || undefined,
      industry: industryFilter || undefined,
    };
    fetchClients(filters);
  }, [searchQuery, industryFilter]);

  const filteredClients = clients;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/home')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
                  <p className="text-slate-600 mt-1">{clients.length} total clients</p>
                </div>
              </div>
              <Button onClick={() => router.push('/clients?modal=create')}>
                <Plus className="w-4 h-4 mr-2" />
                New Client
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search clients by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="flex gap-4 p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                  >
                    <option value="">All Industries</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setIndustryFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Clients Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => router.push(`/clients/${client.id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 text-left"
                >
                  {/* Client Logo/Initial */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      {client.logoUrl ? (
                        <img src={client.logoUrl} alt={client.name} className="w-14 h-14 rounded-xl object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-700' :
                      client.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  {/* Client Info */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">
                    {client.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {client.description}
                  </p>

                  {/* Industry Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full capitalize">
                      {client.industry}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FolderKanban className="w-4 h-4" />
                      <span>{client.stats?.projectCount || 0} projects</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{client.stats?.conversationCount || 0} chats</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No clients found
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {searchQuery || industryFilter
                  ? 'Try adjusting your search or filters'
                  : 'Create your first client to get started with StratOS'}
              </p>
              {!searchQuery && !industryFilter && (
                <Button onClick={() => router.push('/clients?modal=create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Client
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

