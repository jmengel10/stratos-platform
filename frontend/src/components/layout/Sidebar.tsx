'use client';

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
  ChevronDown
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const navigation = [
  { name: 'Dashboard', href: '/home', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Conversations', href: '/console', icon: MessageSquare },
  { name: 'Files', href: '/files', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Templates', href: '/templates', icon: Copy },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-[#E5E7EB] flex flex-col z-50">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
        <Logo />
        <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
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
                  ? 'bg-[#33A7B5] text-white'
                  : 'text-[#6B7280] hover:bg-blue-50 hover:text-[#0F172A]'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#33A7B5] rounded-full flex items-center justify-center text-white text-sm font-medium">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0F172A] truncate">Sarah Chen</p>
            <p className="text-xs text-[#6B7280] truncate">sarah@stratos.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6B7280]" />
        </div>
      </div>
    </div>
  );
}
