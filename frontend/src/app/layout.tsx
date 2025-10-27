'use client';

import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { ProductionErrorBoundary } from '@/components/shared/ProductionErrorBoundary'
import { TenantProvider } from '@/components/providers/TenantProvider'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { initializeStorage } from '@/lib/storage'
import { initializeAdminStorage } from '@/lib/admin-storage'
// import { setupGlobalErrorHandling, trackPerformance } from '@/lib/monitoring'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { refreshToken } = useAuthStore();

      useEffect(() => {
        // Initialize storage systems
        initializeStorage();
        initializeAdminStorage();
        
        // Initialize authentication on mount
        refreshToken();
        
        // Setup production monitoring
        // setupGlobalErrorHandling();
        // trackPerformance();
      }, [refreshToken]);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-background overflow-hidden`}>
        <TenantProvider>
          <ProductionErrorBoundary>
            <div className="flex h-screen w-screen">
              {/* Sidebar - Fixed Left */}
              <Sidebar />
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col ml-64 overflow-hidden">
                {/* TopBar - Sticky */}
                <TopBar />
                
                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                  {children}
                </main>
              </div>
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
          </ProductionErrorBoundary>
        </TenantProvider>
      </body>
    </html>
  )
}

