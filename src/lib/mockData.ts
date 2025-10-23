export interface Client {
  id: string;
  name: string;
  industry: string;
  avatar: string;
  avatarColor: string;
  projects: number;
  conversations: number;
  lastActive: string;
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
}

export interface Conversation {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  agent: string;
  agentAvatar: string;
  agentColor: string;
  title: string;
  preview: string;
  timestamp: string;
}

export const mockClients: Client[] = [
  {
    id: 'client_1',
    name: 'Acme Corporation',
    industry: 'Financial Services',
    avatar: 'A',
    avatarColor: '#0F172A',
    projects: 6,
    conversations: 18,
    lastActive: '2 days ago'
  },
  {
    id: 'client_2',
    name: 'TechVentures Group',
    industry: 'Healthcare Technology',
    avatar: 'T',
    avatarColor: '#33A7B5',
    projects: 8,
    conversations: 24,
    lastActive: '1 week ago'
  },
  {
    id: 'client_3',
    name: 'HealthFirst Systems',
    industry: 'Medical Devices',
    avatar: 'H',
    avatarColor: '#6B7280',
    projects: 12,
    conversations: 32,
    lastActive: '3 days ago'
  },
  {
    id: 'client_4',
    name: 'GlobalTech Partners',
    industry: 'Enterprise Software',
    avatar: 'G',
    avatarColor: '#6B7280',
    projects: 10,
    conversations: 28,
    lastActive: 'Yesterday'
  },
  {
    id: 'client_5',
    name: 'MedCore Solutions',
    industry: 'Healthcare IT',
    avatar: 'M',
    avatarColor: '#0F172A',
    projects: 14,
    conversations: 40,
    lastActive: '4 days ago'
  },
  {
    id: 'client_6',
    name: 'InnovateCo',
    industry: 'SaaS Platform',
    avatar: 'I',
    avatarColor: '#33A7B5',
    projects: 7,
    conversations: 22,
    lastActive: 'Today'
  },
];

export const mockProjects: Project[] = [
  // Acme Corporation projects
  {
    id: 'proj_1',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    name: 'GTM Strategy 2024',
    type: 'GTM Strategy',
    status: 'active',
    progress: 60,
    conversations: 8,
    members: 3,
    startDate: 'Jan 2024',
    dueDate: 'Mar 2024',
    lastActive: '3 hours ago'
  },
  {
    id: 'proj_2',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    name: 'Operations Review Q1',
    type: 'Operations',
    status: 'in-progress',
    progress: 35,
    conversations: 5,
    members: 2,
    startDate: 'Feb 2024',
    dueDate: 'Apr 2024',
    lastActive: '2 days ago'
  },
  {
    id: 'proj_3',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    name: 'Digital Transformation',
    type: 'Technology',
    status: 'active',
    progress: 80,
    conversations: 12,
    members: 4,
    startDate: 'Dec 2023',
    dueDate: 'Feb 2024',
    lastActive: 'Yesterday'
  },
  // TechVentures projects
  {
    id: 'proj_4',
    clientId: 'client_2',
    clientName: 'TechVentures Group',
    name: 'Market Expansion',
    type: 'Growth Strategy',
    status: 'active',
    progress: 45,
    conversations: 6,
    members: 3,
    startDate: 'Jan 2024',
    dueDate: 'May 2024',
    lastActive: '1 day ago'
  },
  {
    id: 'proj_5',
    clientId: 'client_2',
    clientName: 'TechVentures Group',
    name: 'Product Launch Q2',
    type: 'Product Strategy',
    status: 'planning',
    progress: 20,
    conversations: 4,
    members: 2,
    startDate: 'Mar 2024',
    dueDate: 'Jun 2024',
    lastActive: '3 days ago'
  },
];

export const mockConversations: Conversation[] = [
  // GTM Strategy 2024 conversations
  {
    id: 'conv_1',
    projectId: 'proj_1',
    projectName: 'GTM Strategy 2024',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    agent: 'GTM Strategist',
    agentAvatar: '🎯',
    agentColor: '#3B82F6',
    title: 'Market Analysis',
    preview: 'Based on the competitive landscape analysis...',
    timestamp: '2h ago'
  },
  {
    id: 'conv_2',
    projectId: 'proj_1',
    projectName: 'GTM Strategy 2024',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    agent: 'GTM Strategist',
    agentAvatar: '🎯',
    agentColor: '#3B82F6',
    title: 'Competitor Analysis',
    preview: 'Top competitors in the healthcare IT space include...',
    timestamp: '1 week ago'
  },
  {
    id: 'conv_3',
    projectId: 'proj_1',
    projectName: 'GTM Strategy 2024',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    agent: 'Data Analyst',
    agentAvatar: '📊',
    agentColor: '#EC4899',
    title: 'Market Sizing',
    preview: 'TAM analysis shows a $12B addressable market...',
    timestamp: '3 days ago'
  },
  // Operations Review conversations
  {
    id: 'conv_4',
    projectId: 'proj_2',
    projectName: 'Operations Review Q1',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    agent: 'Operations Analyst',
    agentAvatar: '⚙️',
    agentColor: '#10B981',
    title: 'Process Optimization',
    preview: 'We can optimize the workflow by eliminating...',
    timestamp: '5h ago'
  },
  {
    id: 'conv_5',
    projectId: 'proj_2',
    projectName: 'Operations Review Q1',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    agent: 'Operations Analyst',
    agentAvatar: '⚙️',
    agentColor: '#10B981',
    title: 'Cost Reduction Strategy',
    preview: 'Three key areas for cost reduction identified...',
    timestamp: '2 days ago'
  },
  // Market Expansion conversations
  {
    id: 'conv_6',
    projectId: 'proj_4',
    projectName: 'Market Expansion',
    clientId: 'client_2',
    clientName: 'TechVentures Group',
    agent: 'Growth Strategist',
    agentAvatar: '📈',
    agentColor: '#8B5CF6',
    title: 'Regional Analysis',
    preview: 'Southeast Asia presents the strongest opportunity...',
    timestamp: '1 day ago'
  },
];

// Helper functions
export function getClientById(id: string): Client | undefined {
  return mockClients.find(c => c.id === id);
}

export function getProjectsByClientId(clientId: string): Project[] {
  return mockProjects.filter(p => p.clientId === clientId);
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id);
}

export function getConversationsByProjectId(projectId: string): Conversation[] {
  return mockConversations.filter(c => c.projectId === projectId);
}

export function getConversationById(id: string): Conversation | undefined {
  return mockConversations.find(c => c.id === id);
}
