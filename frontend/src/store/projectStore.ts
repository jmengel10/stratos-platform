/**
 * Project Store
 * Manages project state and operations
 */

import { create } from 'zustand';
import { api } from '@/lib/api';
import { Project, CreateProjectInput, UpdateProjectInput, ProjectFilters } from '@/types/project.types';
import toast from 'react-hot-toast';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: (filters?: ProjectFilters) => Promise<void>;
  fetchProjectsByClient: (clientId: string) => Promise<void>;
  selectProject: (project: Project | null) => void;
  createProject: (data: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, updates: UpdateProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (filters?: ProjectFilters) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await api.getProjects(filters);
      set({ projects, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load projects');
    }
  },

  fetchProjectsByClient: async (clientId: string) => {
    return get().fetchProjects({ clientId });
  },

  selectProject: (project: Project | null) => {
    set({ selectedProject: project });
  },

  createProject: async (data: CreateProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const project = await api.createProject(data);
      const projects = [project, ...get().projects];
      set({ projects, isLoading: false });
      toast.success('Project created successfully');
      return project;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create project');
      throw error;
    }
  },

  updateProject: async (id: string, updates: UpdateProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await api.updateProject(id, updates);
      const projects = get().projects.map(p => p.id === id ? updatedProject : p);
      set({ 
        projects, 
        selectedProject: get().selectedProject?.id === id ? updatedProject : get().selectedProject,
        isLoading: false 
      });
      toast.success('Project updated successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update project');
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProject(id);
      const projects = get().projects.filter(p => p.id !== id);
      set({ 
        projects,
        selectedProject: get().selectedProject?.id === id ? null : get().selectedProject,
        isLoading: false 
      });
      toast.success('Project archived successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete project');
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

