/**
 * Client Store
 * Manages client state and operations
 */

import { create } from 'zustand';
import { api } from '@/lib/api';
import { Client, CreateClientInput, UpdateClientInput, ClientFilters } from '@/types/client.types';
import toast from 'react-hot-toast';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchClients: (filters?: ClientFilters) => Promise<void>;
  selectClient: (client: Client | null) => void;
  createClient: (data: CreateClientInput) => Promise<Client>;
  updateClient: (id: string, updates: UpdateClientInput) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  fetchClients: async (filters?: ClientFilters) => {
    set({ isLoading: true, error: null });
    try {
      const clients = await api.getClients(filters);
      set({ clients, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load clients');
    }
  },

  selectClient: (client: Client | null) => {
    set({ selectedClient: client });
  },

  createClient: async (data: CreateClientInput) => {
    set({ isLoading: true, error: null });
    try {
      const client = await api.createClient(data);
      const clients = [client, ...get().clients];
      set({ clients, isLoading: false });
      toast.success('Client created successfully');
      return client;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create client');
      throw error;
    }
  },

  updateClient: async (id: string, updates: UpdateClientInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedClient = await api.updateClient(id, updates);
      const clients = get().clients.map(c => c.id === id ? updatedClient : c);
      set({ 
        clients, 
        selectedClient: get().selectedClient?.id === id ? updatedClient : get().selectedClient,
        isLoading: false 
      });
      toast.success('Client updated successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update client');
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteClient(id);
      const clients = get().clients.filter(c => c.id !== id);
      set({ 
        clients,
        selectedClient: get().selectedClient?.id === id ? null : get().selectedClient,
        isLoading: false 
      });
      toast.success('Client archived successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete client');
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

