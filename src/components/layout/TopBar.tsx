'use client';

import { Search, Bell, User } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface TopBarProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function TopBar({ breadcrumbs }: TopBarProps) {
  return (
    <div className="bg-white border-b border-border h-16 flex items-center justify-between px-6">
      {/* Left side - Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, projects, conversations..."
            className="w-96 pl-10 pr-4 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3">
          <Avatar name="Sarah Chen" size="sm" />
          <span className="text-sm font-medium text-gray-900">Sarah Chen</span>
        </div>
      </div>
    </div>
  );
}
