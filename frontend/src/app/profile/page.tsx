'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Sarah Chen',
    email: 'sarah@stratos.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Strategic consultant with 10+ years of experience helping businesses leverage AI and data analytics for growth.',
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    // Delete account logic
    alert('Account deletion requested. You will receive a confirmation email.');
    setShowDeleteModal(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy mb-2">My Profile</h1>
        <p className="text-gray-text">Manage your personal information and account settings</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal to-navy flex items-center justify-center text-white text-4xl font-bold">
              SC
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-teal hover:bg-teal/90 flex items-center justify-center text-white shadow-lg transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy mb-1">{formData.name}</h2>
            <p className="text-gray-text mb-2">{formData.email}</p>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal/10 text-teal">
              Professional Plan
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">Profile Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-teal hover:text-teal/80 text-sm font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                />
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="w-full px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-xl font-bold text-navy mb-4">Security</h3>
            <button className="w-full px-6 py-3 border border-gray-200 text-navy rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
              <Lock className="w-5 h-5" />
              Change Password
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Right Column - Activity Stats */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-navy mb-4">Activity Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-text">Conversations</span>
                <span className="text-2xl font-bold text-navy">127</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-text">Projects</span>
                <span className="text-2xl font-bold text-navy">43</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-text">Clients</span>
                <span className="text-2xl font-bold text-navy">18</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-text">Last Login</span>
                <span className="text-sm font-medium text-navy">2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-teal to-navy rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-white/80 mb-4">
              Visit our support center for assistance
            </p>
            <button className="w-full px-4 py-2 bg-white text-teal rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Get Support
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-navy mb-4">Delete Account?</h3>
            <p className="text-gray-text mb-6">
              This action cannot be undone. All your data, including projects, conversations, and files will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-navy rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
