'use client';

import { Search, Bell, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { isAdmin } from '@/lib/admin-storage';

export function TopBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNavigation = (path: string) => {
    console.log(`TopBar navigation: ${path}`);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
    setShowUserMenu(false);
  };

  return (
    <div className="h-16 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-40 w-full">
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

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              SC
            </div>
            <span className="text-sm font-medium text-navy">Sarah Chen</span>
            <ChevronDown className="w-4 h-4 text-gray-text" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-bg-gray transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-bg-gray transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={() => handleNavigation('/subscription')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-bg-gray transition-colors"
                >
                  Subscription
                </button>
                <button
                  onClick={() => handleNavigation('/billing')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-bg-gray transition-colors"
                >
                  Billing
                </button>
                <button
                  onClick={() => handleNavigation('/help')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-bg-gray transition-colors"
                >
                  Help Center
                </button>
                {isAdmin() && (
                  <>
                    <div className="border-t border-border my-1"></div>
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Admin Portal
                    </button>
                  </>
                )}
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => {
                    // Handle logout
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
