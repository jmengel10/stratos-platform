'use client';
import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    console.log('Root page: Redirecting to /home');
    if (typeof window !== 'undefined') {
      window.location.href = '/home';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary animate-pulse mx-auto mb-4"></div>
        <p className="text-gray-text">Loading...</p>
        <p className="text-sm text-gray-text mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
