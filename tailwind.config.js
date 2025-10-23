module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      colors: {
        'navy': '#0F172A',
        'teal': '#33A7B5',
        'gray-text': '#6B7280',
        'border-gray': '#E5E7EB',
        'bg-gray': '#F3F4F6',
        'page-bg': '#F9FAFB',
      },
    },
  },
  plugins: [],
};
