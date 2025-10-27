export interface Client {
  id: string;
  name: string;
  industry: string;
  avatar: string;
  avatarColor: string;
  projects: number;
  conversations: number;
  lastActive: string;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  type: string;
  status: 'active' | 'in-progress' | 'planning' | 'completed';
  progress: number;
  conversations: number;
  members: number;
  startDate: string;
  dueDate: string;
  lastActive: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  agentId: string;
  agent: string;
  agentAvatar: string;
  agentColor: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  CLIENTS: 'stratos_clients',
  PROJECTS: 'stratos_projects',
  CONVERSATIONS: 'stratos_conversations',
  INITIALIZED: 'stratos_initialized'
};

// Initial seed data
const SEED_CLIENTS: Client[] = [
  {
    id: 'client_1',
    name: 'Acme Corporation',
    industry: 'Financial Services',
    avatar: 'A',
    avatarColor: '#0F172A',
    projects: 3,
    conversations: 8,
    lastActive: '2 days ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_2',
    name: 'TechVentures Group',
    industry: 'Healthcare Technology',
    avatar: 'T',
    avatarColor: '#33A7B5',
    projects: 2,
    conversations: 6,
    lastActive: '1 week ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_3',
    name: 'HealthFirst Systems',
    industry: 'Medical Devices',
    avatar: 'H',
    avatarColor: '#6B7280',
    projects: 1,
    conversations: 3,
    lastActive: '3 days ago',
    createdAt: new Date().toISOString()
  }
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    name: 'GTM Strategy 2024',
    type: 'GTM Strategy',
    status: 'active',
    progress: 60,
    conversations: 3,
    members: 3,
    startDate: 'Jan 2024',
    dueDate: 'Mar 2024',
    lastActive: '3 hours ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj_2',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    name: 'Operations Review Q1',
    type: 'Operations',
    status: 'in-progress',
    progress: 35,
    conversations: 2,
    members: 2,
    startDate: 'Feb 2024',
    dueDate: 'Apr 2024',
    lastActive: '2 days ago',
    createdAt: new Date().toISOString()
  }
];

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    projectId: 'proj_1',
    projectName: 'GTM Strategy 2024',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    agentId: 'agent_gtm',
    agent: 'GTM Strategist',
    agentAvatar: '🎯',
    agentColor: '#3B82F6',
    title: 'Market Analysis',
    preview: 'Based on the competitive landscape...',
    timestamp: '2h ago',
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Help me analyze the target market for our new healthcare product.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: "I'll help you analyze the target market. Let me break this down into key areas:\n\n**Competitive Landscape**\n- Major competitors in healthcare IT\n- Their positioning and strengths\n- Market gaps and opportunities\n\n**Ideal Customer Profile**\n- Enterprise hospital systems (500+ beds)\n- Annual revenue $500M+\n- Current pain points with data management",
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize storage with seed data if first time
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(SEED_CONVERSATIONS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Clients
export function getAllClients(): Client[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
}

export function getClientById(id: string): Client | undefined {
  return getAllClients().find(c => c.id === id);
}

export function createClient(client: Omit<Client, 'id' | 'createdAt'>): Client {
  const clients = getAllClients();
  const newClient: Client = {
    ...client,
    id: `client_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  clients.push(newClient);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client | undefined {
  const clients = getAllClients();
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  clients[index] = { ...clients[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getAllClients();
  const filtered = clients.filter(c => c.id !== id);
  if (filtered.length === clients.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));
  return true;
}

// Projects
export function getAllProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find(p => p.id === id);
}

export function getProjectsByClientId(clientId: string): Project[] {
  return getAllProjects().filter(p => p.clientId === clientId);
}

export function createProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getAllProjects();
  const newProject: Project = {
    ...project,
    id: `proj_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  projects.push(newProject);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  
  // Update client project count
  const client = getClientById(project.clientId);
  if (client) {
    updateClient(client.id, { projects: client.projects + 1 });
  }
  
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  
  projects[index] = { ...projects[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const project = projects.find(p => p.id === id);
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
  
  // Update client project count
  if (project) {
    const client = getClientById(project.clientId);
    if (client && client.projects > 0) {
      updateClient(client.id, { projects: client.projects - 1 });
    }
  }
  
  return true;
}

// Conversations
export function getAllConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  return data ? JSON.parse(data) : [];
}

export function getConversationById(id: string): Conversation | undefined {
  return getAllConversations().find(c => c.id === id);
}

export function getConversationsByProjectId(projectId: string): Conversation[] {
  return getAllConversations().filter(c => c.projectId === projectId);
}

export function createConversation(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Conversation {
  const conversations = getAllConversations();
  const newConversation: Conversation = {
    ...conversation,
    id: `conv_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  conversations.push(newConversation);
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  
  // Update project conversation count
  const project = getProjectById(conversation.projectId);
  if (project) {
    updateProject(project.id, { 
      conversations: project.conversations + 1,
      lastActive: 'Just now'
    });
  }
  
  return newConversation;
}

export function updateConversation(id: string, updates: Partial<Conversation>): Conversation | undefined {
  const conversations = getAllConversations();
  const index = conversations.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  conversations[index] = { 
    ...conversations[index], 
    ...updates,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  return conversations[index];
}

export function addMessageToConversation(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Conversation | undefined {
  const conversation = getConversationById(conversationId);
  if (!conversation) return undefined;
  
  const newMessage: Message = {
    ...message,
    id: `msg_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  
  const updatedMessages = [...conversation.messages, newMessage];
  const preview = message.role === 'user' 
    ? message.content.slice(0, 60) + '...'
    : conversation.preview;
  
  return updateConversation(conversationId, {
    messages: updatedMessages,
    preview,
    timestamp: 'Just now',
    updatedAt: new Date().toISOString()
  });
}

export function deleteConversation(id: string): boolean {
  const conversations = getAllConversations();
  const conversation = conversations.find(c => c.id === id);
  const filtered = conversations.filter(c => c.id !== id);
  if (filtered.length === conversations.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));
  
  // Update project conversation count
  if (conversation) {
    const project = getProjectById(conversation.projectId);
    if (project && project.conversations > 0) {
      updateProject(project.id, { conversations: project.conversations - 1 });
    }
  }
  
  return true;
}

// Utility to reset all data
export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  initializeStorage();
}
