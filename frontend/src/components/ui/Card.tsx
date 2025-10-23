import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white border border-border rounded-lg shadow-sm',
        hover && 'hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
}