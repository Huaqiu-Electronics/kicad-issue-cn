'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeProvider } from './ThemeContext';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import ThemeApplier from '../ThemeApplier';

interface ClientProvidersProps {
  children: ReactNode;
  user: any;
  isUserAdmin: boolean;
  lang: string;
}

export default function ClientProviders({ children, user, isUserAdmin, lang }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider initialUser={user}>
          <ThemeApplier>
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
            <main>
              {children}
            </main>
          </ThemeApplier>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

// Import Navigation here to avoid server/client import issues
import Navigation from '../Navigation';
