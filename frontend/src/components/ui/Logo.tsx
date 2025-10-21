/**
 * Logo Component
 * Displays tenant-specific logo (temporary text-based until real logos are designed)
 */

'use client';

import { useTenant } from '@/hooks/useTenant';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const tenant = useTenant();
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2">
      {/* Temporary text logo until actual logos are designed */}
      <span 
        className={`${textSizes[size]} font-bold tracking-wide transition-colors`}
        style={{ 
          color: tenant.colors.primary,
          fontFamily: tenant.id === 'stratos' 
            ? '"Inter", sans-serif' 
            : '"Poppins", sans-serif',
          textTransform: tenant.id === 'stratos' ? 'uppercase' : 'capitalize',
          letterSpacing: tenant.id === 'stratos' ? '0.1em' : 'normal',
          fontWeight: tenant.id === 'stratos' ? '700' : '700'
        }}
      >
        {tenant.name}
      </span>
      {/* Fun emoji for Sparkworks */}
      {tenant.id === 'sparkworks' && (
        <span className={`${textSizes[size]}`} role="img" aria-label="spark">
          ✨
        </span>
      )}
    </div>
  );
}

