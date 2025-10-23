'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { 
  Home, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Settings, 
  BarChart3,
  Shield,
  DollarSign
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', href: '/home', icon: Home },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Console', href: '/console', icon: MessageSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Files', href: '/files', icon: FileText },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const adminItems = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'Billing', href: '/admin/billing', icon: DollarSign },
    { name: 'Configuration', href: '/admin/config', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/home' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Logo size="sm" />
      </div>
      
      {/* Main Navigation */}
      <nav className="mt-6 px-3">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </h3>
        </div>
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-[#EFF6FF] text-[#33A7B5] border-r-2 border-[#33A7B5]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Navigation */}
      <nav className="mt-8 px-3">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Administration
          </h3>
        </div>
        <ul className="space-y-1">
          {adminItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-[#FEF3C7] text-[#D97706] border-r-2 border-[#D97706]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
