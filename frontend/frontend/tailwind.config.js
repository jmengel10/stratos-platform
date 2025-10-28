/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#33A7B5',
        navy: '#0F172A',
        background: '#F9FAFB',
        border: '#E5E7EB',
        'border-gray': '#E5E7EB',
        'gray-text': '#6B7280',
        'bg-gray': '#F3F4F6',
        teal: '#33A7B5',
        // Additional colors for proper styling
        'text-navy': '#0F172A',
        'text-primary': '#33A7B5',
        'text-gray-600': '#6B7280',
        'text-gray-500': '#9CA3AF',
        'text-green-600': '#059669',
        'text-red-600': '#DC2626',
        'bg-white': '#FFFFFF',
        'bg-gray-50': '#F9FAFB',
        'bg-gray-100': '#F3F4F6',
        'border-gray-200': '#E5E7EB',
        'border-gray-300': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}