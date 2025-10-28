'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (pathname === '/home' || pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(segment => segment);
  
  const breadcrumbs = [
    { label: 'Home', href: '/home' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return { label, href };
    }),
  ];

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-text mb-6">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isHome = index === 0;
        
        return (
          <div key={crumb.href} className="flex items-center gap-2">
            {isHome && <Home className="w-4 h-4" />}
            {isLast ? (
              <span className="text-navy font-medium">{crumb.label}</span>
            ) : (
              <>
                <Link href={crumb.href} className="hover:text-navy transition-colors">
                  {crumb.label}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}

