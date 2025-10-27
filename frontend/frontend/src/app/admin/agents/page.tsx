'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllAgents, 
  createAgent, 
  updateAgent, 
  deleteAgent,
  isAdmin,
  type AIAgent 
} from '@/lib/admin-storage';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Bot,
  CheckCircle,
  XCircle,
  Settings,
  MessageSquare
} from 'lucide-react';

const AGENT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Orange
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

const AI_MODELS = [
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku'
];

export default function AdminAgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    color: '#3B82F6',
    description: '',
    systemPrompt: '',
    capabilities: [''],
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/home');
      return;
    }

    setAgents(getAllAgents());
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Agent name is required';
    if (!formData.avatar.trim()) newErrors.avatar = 'Avatar emoji is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.systemPrompt.trim()) newErrors.systemPrompt = 'System prompt is required';
    if (formData.capabilities.every(c => !c.trim())) newErrors.capabilities = 'At least one capability is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const capabilities = formData.capabilities.filter(c => c.trim());
      
      if (editingAgent) {
        updateAgent(editingAgent.id, {
          ...formData,
          capabilities
        });
      } else {
        createAgent({
          ...formData,
          capabilities
        });
      }
      
      setAgents(getAllAgents());
      setShowModal(false);
      setEditingAgent(null);
      setFormData({
        name: '',
        avatar: '',
        color: '#3B82F6',
        description: '',
        systemPrompt: '',
        capabilities: [''],
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        isActive: true
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      avatar: agent.avatar,
      color: agent.color,
      description: agent.description,
      systemPrompt: agent.systemPrompt,
      capabilities: agent.capabilities.length > 0 ? agent.capabilities : [''],
      model: agent.model,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      isActive: agent.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (agent: AIAgent) => {
    if (confirm(`Are you sure you want to delete "${agent.name}"? This action cannot be undone.`)) {
      deleteAgent(agent.id);
      setAgents(getAllAgents());
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">AI Agents</h1>
          <p className="text-gray-text mt-2">Manage AI agents and their capabilities</p>
        </div>
        <button
          onClick={() => {
            setEditingAgent(null);
            setFormData({
              name: '',
              avatar: '',
              color: '#3B82F6',
              description: '',
              systemPrompt: '',
              capabilities: [''],
              model: 'gpt-4',
              temperature: 0.7,
              maxTokens: 2000,
              isActive: true
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Agent
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Agents</p>
              <p className="text-2xl font-bold text-navy">{agents.length}</p>
            </div>
            <Bot className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Active Agents</p>
              <p className="text-2xl font-bold text-navy">
                {agents.filter(a => a.isActive).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-text">Total Usage</p>
              <p className="text-2xl font-bold text-navy">
                {agents.reduce((sum, a) => sum + a.usageCount, 0)}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">{agent.name}</h3>
                  <p className="text-sm text-gray-text">{agent.model}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(agent)}
                  className="p-2 text-gray-text hover:text-primary hover:bg-bg-gray rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(agent)}
                  className="p-2 text-gray-text hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-text mb-4">{agent.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                {agent.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${agent.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {agent.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-text">
                <Settings className="w-4 h-4" />
                <span>Temp: {agent.temperature}</span>
                <span>•</span>
                <span>Tokens: {agent.maxTokens}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-text">
                <MessageSquare className="w-4 h-4" />
                <span>{agent.usageCount} conversations</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-navy">Capabilities:</h4>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((capability, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-bg-gray text-xs text-gray-text rounded-full"
                  >
                    {capability}
                  </span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="px-2 py-1 bg-bg-gray text-xs text-gray-text rounded-full">
                    +{agent.capabilities.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-semibold text-navy mb-6">
              {editingAgent ? 'Edit Agent' : 'New Agent'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Agent Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="e.g., GTM Strategist"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Avatar and Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Avatar Emoji *
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.avatar ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="🎯"
                  />
                  {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Color *
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AGENT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full transition-all ${
                          formData.color === color 
                            ? 'ring-4 ring-primary ring-offset-2' 
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.description ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Brief description of the agent's expertise..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  System Prompt *
                </label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.systemPrompt ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Detailed system prompt that defines the agent's behavior..."
                />
                {errors.systemPrompt && <p className="text-red-500 text-sm mt-1">{errors.systemPrompt}</p>}
              </div>

              {/* Capabilities */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Capabilities *
                </label>
                {formData.capabilities.map((capability, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={capability}
                      onChange={(e) => {
                        const newCapabilities = [...formData.capabilities];
                        newCapabilities[index] = e.target.value;
                        setFormData({ ...formData, capabilities: newCapabilities });
                      }}
                      className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Capability description"
                    />
                    {formData.capabilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newCapabilities = formData.capabilities.filter((_, i) => i !== index);
                          setFormData({ ...formData, capabilities: newCapabilities });
                        }}
                        className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, capabilities: [...formData.capabilities, ''] })}
                  className="text-sm text-primary hover:underline"
                >
                  + Add Capability
                </button>
                {errors.capabilities && <p className="text-red-500 text-sm mt-1">{errors.capabilities}</p>}
              </div>

              {/* Model and Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Model *
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    {AI_MODELS.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-text mt-1">{formData.temperature}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 2000 })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-navy">
                  Active Agent
                </label>
              </div>

              {/* Preview */}
              {formData.avatar && formData.name && (
                <div className="p-4 bg-bg-gray rounded-lg">
                  <p className="text-sm font-medium text-navy mb-3">Preview:</p>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{formData.name}</p>
                      <p className="text-sm text-gray-text">{formData.description || 'Description...'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-border text-navy rounded-lg hover:border-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingAgent ? 'Update Agent' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
