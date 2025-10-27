import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'active' | 'in-progress' | 'planning' | 'completed' | 'role-owner' | 'role-admin' | 'role-member' | 'role-client' | 'role-viewer';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    active: 'bg-status-active text-white',
    'in-progress': 'bg-status-in-progress text-white',
    planning: 'bg-status-planning text-white',
    completed: 'bg-status-completed text-white',
    'role-owner': 'bg-role-owner text-white',
    'role-admin': 'bg-role-admin text-white',
    'role-member': 'bg-role-member text-white',
    'role-client': 'bg-role-client text-white',
    'role-viewer': 'bg-role-viewer text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
