import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from Figma designs
        primary: '#33A7B5',
        navy: '#0F172A',
        background: '#F9FAFB',
        border: '#E5E7EB',
        
        // Status colors
        'status-active': '#10B981',
        'status-in-progress': '#3B82F6',
        'status-planning': '#F59E0B',
        'status-completed': '#6B7280',
        
        // Role colors
        'role-owner': '#8B5CF6',
        'role-admin': '#33A7B5',
        'role-member': '#10B981',
        'role-client': '#F97316',
        'role-viewer': '#6B7280',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
export default config

