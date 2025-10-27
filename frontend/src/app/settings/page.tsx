'use client';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Settings</h1>
          <p className="text-gray-text mt-2">Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-border rounded-lg p-8">
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">Settings coming soon</h3>
          <p className="text-gray-text mb-6">Account management features will be available soon</p>
        </div>
      </div>
    </div>
  );
}