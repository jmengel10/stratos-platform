'use client';

import { Search, Bell } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-white border-b border-border h-16 flex items-center justify-between px-6">
      {/* Left side - Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, projects, conversations..."
            className="w-96 pl-10 pr-4 py-2 border border-border rounded-lg bg-bg-gray text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-text hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
            SC
          </div>
          <span className="text-sm font-medium text-navy">Sarah Chen</span>
        </div>
      </div>
    </div>
  );
}
