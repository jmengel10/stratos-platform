/**
 * Root Layout
 * 
 * Main layout with authentication provider, error boundary, tenant provider, and global styles
 */

'use client';

import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { TenantProvider } from '@/components/providers/TenantProvider'
import { Navigation } from '@/components/shared/Navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on mount
    refreshToken();
  }, [refreshToken]);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <TenantProvider>
          <ErrorBoundary>
            <div className="flex h-screen overflow-hidden">
              <Navigation />
              <main className="flex-1 ml-64 overflow-y-auto">
                {children}
              </main>
            </div>
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
          </ErrorBoundary>
        </TenantProvider>
      </body>
    </html>
  )
}

