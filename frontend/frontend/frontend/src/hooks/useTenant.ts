/**
 * Tenant Detection Hook
 * Automatically detects which brand to display based on hostname
 */

'use client';

import { useEffect, useState } from 'react';
import { TENANTS, TenantConfig, getTenantFromHostname, getDefaultTenant } from '@/config/tenants';

export function useTenant(): TenantConfig {
  const [tenant, setTenant] = useState<TenantConfig>(getDefaultTenant());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const detectedTenant = getTenantFromHostname(hostname);
      setTenant(detectedTenant);
      
      // Log for debugging
      console.log('[Tenant] Detected:', detectedTenant.name, 'from hostname:', hostname);
    }
  }, []);

  return tenant;
}

