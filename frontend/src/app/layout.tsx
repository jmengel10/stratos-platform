/**
 * Root Layout
 * 
 * Main layout with authentication provider and global styles
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'StratOS - AI-Powered Strategy Consulting Platform',
  description: 'Access specialized AI agents for strategy, operations, fundraising, product development, and data analysis. Transform your business with intelligent insights.',
  keywords: ['AI', 'strategy', 'consulting', 'OpenAI', 'GPT-4', 'business intelligence'],
  authors: [{ name: 'StratOS Team' }],
  openGraph: {
    title: 'StratOS - AI-Powered Strategy Consulting',
    description: 'Transform your business strategy with specialized AI agents',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StratOS - AI-Powered Strategy Consulting',
    description: 'Transform your business strategy with specialized AI agents',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

