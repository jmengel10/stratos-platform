'use client';
import Link from 'next/link';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-full opacity-20"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-serif font-bold text-navy mb-4">404</h1>
          <h2 className="text-2xl font-serif font-semibold text-navy mb-2">Page Not Found</h2>
          <p className="text-gray-text">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link
              href="/help"
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <Search className="w-4 h-4" />
              Get Help
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-gray-text mb-4">Looking for something specific?</p>
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
            Still can't find what you're looking for?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
