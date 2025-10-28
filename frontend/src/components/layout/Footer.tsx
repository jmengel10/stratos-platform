'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-white">
              <Logo />
            </div>
            <p className="text-gray-300 text-xs md:text-sm">
              © {currentYear} Stratos. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-gray-300">
            <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">All systems operational</span>
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
