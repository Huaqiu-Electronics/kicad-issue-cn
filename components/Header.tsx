'use client';

import Link from 'next/link';
import Navigation from './Navigation';

interface HeaderProps {
  isUserAdmin: boolean;
  lang: string;
}

export default function Header({ isUserAdmin, lang }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`} className="text-xl font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>KiCad Issue CN</span>
            </Link>
          </div>
          <Navigation isUserAdmin={isUserAdmin} lang={lang} />
        </div>
      </div>
    </header>
  );
}
