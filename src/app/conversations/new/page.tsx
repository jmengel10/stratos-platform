'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockClients, mockProjects, getProjectsByClientId } from '@/lib/mockData';
import { ArrowLeft, Plus, MessageSquare } from 'lucide-react';

export default function NewConversationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isInternal, setIsInternal] = useState(false);

  // Pre-select client and project if coming from project page
  useEffect(() => {
    if (projectId) {
      const project = mockProjects.find(p => p.id === projectId);
      if (project) {
        setSelectedClientId(project.clientId);
        setSelectedProjectId(projectId);
      }
    }
  }, [projectId]);

  const availableProjects = selectedClientId ? getProjectsByClientId(selectedClientId) : [];

  const handleStartConversation = () => {
    if (!selectedClientId) {
      alert('Please select a client');
      return;
    }
    
    if (!isInternal && !selectedProjectId) {
      alert('Please select a project');
      return;
    }

    const conversationId = `new_${Date.now()}`;
    const params = new URLSearchParams({
      clientId: selectedClientId,
      ...(selectedProjectId && { projectId: selectedProjectId })
    });
    
    router.push(`/conversations/${conversationId}?${params.toString()}`);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => router.back()}
          className="p-2 text-[#6B7280] hover:text-[#0F172A] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-[#0F172A] font-serif">Start New Conversation</h1>
          <p className="text-[#6B7280] mt-2">Select a client and project to begin your strategic discussion</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 space-y-6">
          
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-3">Select Client</label>
            <div className="space-y-2">
              {/* Internal/Corporate Option */}
              <label className="flex items-center p-3 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="client"
                  value="internal"
                  checked={isInternal}
                  onChange={() => {
                    setIsInternal(true);
                    setSelectedClientId('internal');
                    setSelectedProjectId('');
                  }}
                  className="mr-3"
                />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    🏢
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A]">Internal/Corporate</p>
                    <p className="text-sm text-[#6B7280]">Internal strategic discussions</p>
                  </div>
                </div>
              </label>

              {/* Client Options */}
              {mockClients.map((client) => (
                <label key={client.id} className="flex items-center p-3 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="client"
                    value={client.id}
                    checked={selectedClientId === client.id}
                    onChange={() => {
                      setIsInternal(false);
                      setSelectedClientId(client.id);
                      setSelectedProjectId('');
                    }}
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: client.avatarColor }}
                    >
                      {client.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A]">{client.name}</p>
                      <p className="text-sm text-[#6B7280]">{client.industry}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Project Selection */}
          {!isInternal && (
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-3">Select Project</label>
              {selectedClientId ? (
                <div className="space-y-2">
                  {availableProjects.map((project) => (
                    <label key={project.id} className="flex items-center p-3 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="project"
                        value={project.id}
                        checked={selectedProjectId === project.id}
                        onChange={() => setSelectedProjectId(project.id)}
                        className="mr-3"
                      />
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{project.name}</p>
                          <p className="text-sm text-[#6B7280]">{project.type} • {project.status}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                  
                  {/* Create New Project Option */}
                  <label className="flex items-center p-3 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer border-dashed">
                    <input
                      type="radio"
                      name="project"
                      value="new"
                      checked={selectedProjectId === 'new'}
                      onChange={() => setSelectedProjectId('new')}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[#6B7280]">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">Create New Project</p>
                        <p className="text-sm text-[#6B7280]">Start a new project for this client</p>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <p className="text-[#6B7280] text-sm">Please select a client first</p>
              )}
            </div>
          )}

          {isInternal && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Internal conversations</strong> don't require a project. You can start discussing strategic topics directly.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#E5E7EB]">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 text-[#6B7280] hover:text-[#0F172A] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleStartConversation}
              className="px-6 py-2 bg-[#33A7B5] text-white rounded-lg hover:bg-[#33A7B5]/90 transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Conversation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
