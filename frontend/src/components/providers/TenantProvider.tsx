/**
 * Tenant Provider
 * Applies dynamic tenant branding (colors, fonts) to the entire application
 */

'use client';

import { useTenant } from '@/hooks/useTenant';
import { useEffect } from 'react';

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const tenant = useTenant();

  useEffect(() => {
    // Apply tenant CSS variables to document root
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', tenant.colors.primary);
    root.style.setProperty('--color-secondary', tenant.colors.secondary);
    root.style.setProperty('--color-accent', tenant.colors.accent);
    root.style.setProperty('--color-text', tenant.colors.text);
    root.style.setProperty('--color-background', tenant.colors.background);
    root.style.setProperty('--font-heading', tenant.fonts.heading);
    root.style.setProperty('--font-body', tenant.fonts.body);

    // Update page title and favicon
    document.title = `${tenant.displayName} - ${tenant.tagline}`;
    
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = `/favicons/${tenant.id}.ico`;
    }

    // Log tenant info for debugging
    console.log('[TenantProvider] Applied branding for:', tenant.name);
  }, [tenant]);

  return <>{children}</>;
}

