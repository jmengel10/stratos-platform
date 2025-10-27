'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  FolderOpen,
  MessageSquare,
  FileText,
  Calendar,
  BarChart3,
  Copy,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const navigation = [
  { name: 'Dashboard', href: '/home', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Files', href: '/files', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Templates', href: '/templates', icon: Copy },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white border-r border-border flex flex-col z-50 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        {!isCollapsed && <Logo />}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-text" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-text" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-text hover:bg-blue-50 hover:text-navy'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              SC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy truncate">Sarah Chen</p>
              <p className="text-xs text-gray-text truncate">sarah@stratos.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-text" />
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="p-4 border-t border-border flex justify-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
            SC
          </div>
        </div>
      )}
    </div>
  );
}
