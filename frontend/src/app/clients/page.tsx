'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllClients, type Client } from '@/lib/storage';
import { Search, Plus } from 'lucide-react';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load clients from storage
    const loadedClients = getAllClients();
    setClients(loadedClients);
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Clients</h1>
          <p className="text-gray-text mt-2">Manage your clients and their strategic engagements</p>
        </div>
        <button 
          onClick={() => {
            console.log('New Client button clicked');
            router.push('/clients/new');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Client
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text" />
          <input
            type="text"
            placeholder="Search by client name or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <p className="text-gray-text">No clients found. Create your first client to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => router.push(`/clients/${client.id}`)}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: client.avatarColor }}
                >
                  {client.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">{client.name}</h3>
                  <p className="text-sm text-primary">{client.industry}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-sm text-gray-text">
                  <span className="font-semibold text-navy">{client.projects}</span> projects
                </p>
                <p className="text-sm text-gray-text">
                  <span className="font-semibold text-navy">{client.conversations}</span> conversations
                </p>
                <p className="text-xs text-gray-text">Active {client.lastActive}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
