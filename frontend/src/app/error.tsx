'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle, Bug } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-400 rounded-full opacity-20"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-4">Something went wrong</h1>
          <p className="text-gray-text mb-4">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
          </p>
          
          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <div className="flex gap-3 justify-center">
            <Link
              href="/home"
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <Bug className="w-4 h-4" />
              Report Bug
            </Link>
          </div>
        </div>

        {/* Helpful Information */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-navy mb-3">What you can do:</h3>
          <ul className="text-sm text-gray-text space-y-2 text-left">
            <li>• Try refreshing the page</li>
            <li>• Check your internet connection</li>
            <li>• Clear your browser cache</li>
            <li>• Try again in a few minutes</li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="mt-8">
          <p className="text-sm text-gray-text">
            If the problem persists, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>{' '}
            and include the error details above.
          </p>
        </div>
      </div>
    </div>
  );
}
