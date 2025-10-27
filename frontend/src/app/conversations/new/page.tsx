'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getAllClients, 
  getAllProjects,
  getProjectsByClientId,
  createConversation,
  type Client,
  type Project 
} from '@/lib/storage';
import { getActiveAgents, incrementAgentUsage } from '@/lib/admin-storage';
import { ArrowLeft, ChevronDown } from 'lucide-react';

export default function NewConversationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get('projectId');
  
  const [clients, setClients] = useState<Client[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState(getActiveAgents());
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(preselectedProjectId || '');
  const [selectedAgent, setSelectedAgent] = useState(agents[0] || null);
  const [conversationTitle, setConversationTitle] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  useEffect(() => {
    const loadedClients = getAllClients();
    const loadedProjects = getAllProjects();
    const loadedAgents = getActiveAgents();
    setClients(loadedClients);
    setAllProjects(loadedProjects);
    setAgents(loadedAgents);
    
    // Set default agent if available
    if (loadedAgents.length > 0 && !selectedAgent) {
      setSelectedAgent(loadedAgents[0]);
    }
    
    // If project is preselected, select its client too
    if (preselectedProjectId) {
      const project = loadedProjects.find(p => p.id === preselectedProjectId);
      if (project) {
        setSelectedClientId(project.clientId);
        setSelectedProjectId(project.id);
      }
    }
  }, [preselectedProjectId, selectedAgent]);

  const clientProjects = selectedClientId 
    ? getProjectsByClientId(selectedClientId)
    : [];

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedProject = allProjects.find(p => p.id === selectedProjectId);

  const handleCreate = () => {
    if (!selectedClientId || !selectedProjectId || !conversationTitle.trim() || !selectedAgent) {
      alert('Please fill in all fields');
      return;
    }

    const project = allProjects.find(p => p.id === selectedProjectId);
    const client = clients.find(c => c.id === selectedClientId);
    
    if (!project || !client || !selectedAgent) return;

    const newConversation = createConversation({
      projectId: selectedProjectId,
      projectName: project.name,
      clientId: selectedClientId,
      clientName: client.name,
      agent: selectedAgent.name,
      agentAvatar: selectedAgent.avatar,
      agentColor: selectedAgent.color,
      title: conversationTitle.trim(),
      preview: 'New conversation',
      timestamp: 'Just now',
      messages: []
    });

    // Increment agent usage count
    incrementAgentUsage(selectedAgent.id);

    router.push(`/conversations/${newConversation.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-text hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2">
            Start New Conversation
          </h1>
          <p className="text-gray-text mb-8">
            Select a client, project, and agent to begin
          </p>

          {/* Client Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy mb-2">
              Client *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-primary focus:outline-none focus:border-primary text-left"
              >
                {selectedClient ? (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: selectedClient.avatarColor }}
                    >
                      {selectedClient.avatar}
                    </div>
                    <span className="text-navy">{selectedClient.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-text">Select a client...</span>
                )}
                <ChevronDown className="w-5 h-5 text-gray-text" />
              </button>

              {showClientDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setSelectedProjectId('');
                        setShowClientDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-gray text-left"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: client.avatarColor }}
                      >
                        {client.avatar}
                      </div>
                      <div>
                        <p className="text-navy font-medium">{client.name}</p>
                        <p className="text-xs text-gray-text">{client.industry}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy mb-2">
              Project *
            </label>
            {!selectedClientId ? (
              <div className="px-4 py-3 bg-bg-gray border border-border rounded-lg text-gray-text text-sm">
                Please select a client first
              </div>
            ) : clientProjects.length === 0 ? (
              <div className="px-4 py-3 bg-bg-gray border border-border rounded-lg">
                <p className="text-gray-text text-sm mb-2">No projects for this client</p>
                <button
                  type="button"
                  onClick={() => router.push(`/projects/new?clientId=${selectedClientId}`)}
                  className="text-sm text-primary hover:underline"
                >
                  Create a project first
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-primary focus:outline-none focus:border-primary text-left"
                >
                  <span className="text-navy">
                    {selectedProject ? selectedProject.name : 'Select a project...'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-text" />
                </button>

                {showProjectDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {clientProjects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setShowProjectDropdown(false);
                        }}
                        className="w-full px-4 py-3 hover:bg-bg-gray text-left"
                      >
                        <p className="text-navy font-medium">{project.name}</p>
                        <p className="text-xs text-gray-text">{project.type}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

            {/* Agent Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-navy mb-3">
                AI Agent *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgent(agent)}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      selectedAgent?.id === agent.id
                        ? 'border-primary bg-blue-50'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: agent.color }}
                    >
                      {agent.avatar}
                    </div>
                    <span className="text-sm font-medium text-navy">{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>

          {/* Conversation Title */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-navy mb-2">
              Conversation Title *
            </label>
            <input
              type="text"
              value={conversationTitle}
              onChange={(e) => setConversationTitle(e.target.value)}
              placeholder="e.g., Market Analysis Q1"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-border text-navy rounded-lg hover:border-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!selectedClientId || !selectedProjectId || !conversationTitle.trim() || !selectedAgent}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
