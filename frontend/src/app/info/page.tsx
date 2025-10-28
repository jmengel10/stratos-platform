'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, X, Info as InfoIcon, Shield } from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

interface InfoContent {
  title: string;
  description: string;
  features: string[];
  lastUpdated: string;
  version: string;
}

const defaultInfo: InfoContent = {
  title: 'About StratOS',
  description: 'StratOS is a comprehensive strategic consulting platform powered by AI. We help businesses make data-driven decisions and achieve sustainable growth through advanced analytics, intelligent insights, and collaborative tools.',
  features: [
    'AI-powered strategic analysis and recommendations',
    'Real-time collaboration and team management',
    'Comprehensive project and client management',
    'Advanced reporting and analytics dashboard',
    'Secure, enterprise-grade data protection',
    'Customizable workflows and templates'
  ],
  lastUpdated: new Date().toISOString(),
  version: '2.1.0'
};

export default function InfoPage() {
  const [info, setInfo] = useState<InfoContent>(defaultInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [editInfo, setEditInfo] = useState<InfoContent>(defaultInfo);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin (in a real app, this would come from auth context)
    // For now, we'll check localStorage or a simple condition
    const userRole = localStorage.getItem('userRole') || 'user';
    setIsAdmin(userRole === 'admin');
  }, []);

  const handleEdit = () => {
    setEditInfo({ ...info });
    setIsEditing(true);
  };

  const handleSave = () => {
    setInfo({
      ...editInfo,
      lastUpdated: new Date().toISOString()
    });
    setIsEditing(false);
    // In a real app, this would save to the backend
    console.log('Info updated:', editInfo);
  };

  const handleCancel = () => {
    setEditInfo({ ...info });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof InfoContent, value: string | string[]) => {
    setEditInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    setEditInfo(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setEditInfo(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setEditInfo(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Info' }
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <InfoIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-4xl font-serif font-bold text-navy">Platform Information</h1>
            <p className="text-gray-text mt-2">Learn about StratOS and its capabilities</p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Edit Info'}
          </button>
        )}
      </div>

      {/* Admin Notice */}
      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Admin Mode</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">You can edit this information. Changes will be visible to all users.</p>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        {/* Title and Description */}
        <div className="bg-white border border-border rounded-lg p-8">
          <h2 className="text-2xl font-serif font-semibold text-navy mb-4">Platform Overview</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editInfo.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editInfo.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">{info.title}</h3>
              <p className="text-gray-700 leading-relaxed">{info.description}</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-white border border-border rounded-lg p-8">
          <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Key Features</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              {editInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter feature description"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addFeature}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                + Add Feature
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {info.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Version Info */}
        <div className="bg-white border border-border rounded-lg p-8">
          <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Version Information</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                <input
                  type="text"
                  value={editInfo.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Current Version</label>
                <p className="text-lg font-semibold text-navy">{info.version}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-lg font-semibold text-navy">
                  {new Date(info.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
