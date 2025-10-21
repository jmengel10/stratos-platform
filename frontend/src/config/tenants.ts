/**
 * Multi-Tenant Configuration
 * Defines branding for StratOS (Consulting) and Sparkworks (Venture Studio)
 */

export interface TenantConfig {
  id: 'stratos' | 'sparkworks';
  name: string;
  displayName: string;
  domain: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  tagline: string;
  supportEmail: string;
  aesthetic: string;
}

export const TENANTS: Record<string, TenantConfig> = {
  stratos: {
    id: 'stratos',
    name: 'StratOS',
    displayName: 'StratOS',
    domain: 'stratos.com',
    logo: '/logos/stratos-logo.svg',
    colors: {
      primary: '#0F172A',      // Deep Navy - authority, trust
      secondary: '#33A7B5',    // Sky Blue - clarity, transformation
      accent: '#EEEEEE',       // Silver Gray - precision, neutrality
      text: '#16181B',         // Charcoal
      background: '#FFFFFF',   // White
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Inter", sans-serif',
    },
    tagline: 'Strategy at the speed of transformation',
    supportEmail: 'support@stratos.com',
    aesthetic: 'boutique consulting - minimal, sophisticated, authoritative'
  },
  sparkworks: {
    id: 'sparkworks',
    name: 'Sparkworks',
    displayName: 'Sparkworks',
    domain: 'sparkworks.io',
    logo: '/logos/sparkworks-logo.svg',
    colors: {
      primary: '#FF6B35',      // Electric Orange - energy, creativity
      secondary: '#FFD23F',    // Bright Yellow - optimism, fun
      accent: '#6A0DAD',       // Deep Purple - innovation, imagination
      text: '#16181B',         // Charcoal
      background: '#F9FAFB',   // Off-white
    },
    fonts: {
      heading: '"Poppins", sans-serif',
      body: '"Inter", sans-serif',
    },
    tagline: 'Where ideas hatch into ventures',
    supportEmail: 'hello@sparkworks.io',
    aesthetic: 'venture studio - vibrant, playful, energetic'
  }
};

/**
 * Helper function to get current tenant based on hostname
 */
export function getTenantFromHostname(hostname: string): TenantConfig {
  // Check for Sparkworks domains
  if (hostname.includes('sparkworks')) {
    return TENANTS.sparkworks;
  }
  
  // Default to StratOS
  return TENANTS.stratos;
}

/**
 * Helper function to get tenant from environment variable (for development)
 */
export function getDefaultTenant(): TenantConfig {
  const defaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'stratos';
  return TENANTS[defaultTenantId] || TENANTS.stratos;
}

