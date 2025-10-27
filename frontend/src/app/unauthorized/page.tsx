'use client';
import Link from 'next/link';
import { Lock, ArrowLeft, Shield, Mail } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center">
        {/* Lock Icon */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-400 rounded-full opacity-20"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        {/* Access Denied Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-4">Access Denied</h1>
          <p className="text-gray-text mb-4">
            You don't have permission to access this page. This could be because:
          </p>
          
          <ul className="text-sm text-gray-text space-y-2 text-left mb-6">
            <li>• You're not logged in</li>
            <li>• Your account doesn't have the required permissions</li>
            <li>• The page requires admin access</li>
            <li>• Your session has expired</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>

          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <Shield className="w-4 h-4" />
              Sign In
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              Request Access
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-navy mb-3">Need help?</h3>
          <div className="space-y-2 text-sm text-gray-text">
            <p>
              If you believe you should have access to this page, please contact your administrator or{' '}
              <Link href="/contact" className="text-primary hover:underline">
                our support team
              </Link>.
            </p>
            <p>
              Make sure you're signed in with the correct account that has the necessary permissions.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <p className="text-sm text-gray-text mb-3">Quick access to:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/clients" className="text-primary hover:underline text-sm">
              Clients
            </Link>
            <Link href="/projects" className="text-primary hover:underline text-sm">
              Projects
            </Link>
            <Link href="/conversations" className="text-primary hover:underline text-sm">
              Conversations
            </Link>
            <Link href="/settings" className="text-primary hover:underline text-sm">
              Settings
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8">
          <p className="text-sm text-gray-text">
            Still having trouble?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
