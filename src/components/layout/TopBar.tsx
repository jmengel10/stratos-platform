'use client';

import { Search, Bell } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-white border-b border-[#E5E7EB] h-16 flex items-center justify-between px-6">
      {/* Left side - Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, projects, conversations..."
            className="w-96 pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg bg-[#F3F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#33A7B5] focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-[#6B7280] hover:text-[#0F172A] hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-sm font-medium">
            SC
          </div>
          <span className="text-sm font-medium text-[#0F172A]">Sarah Chen</span>
        </div>
      </div>
    </div>
  );
}
