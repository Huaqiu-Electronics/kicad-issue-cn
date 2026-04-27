'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import ThemeApplier from '../ThemeApplier';

interface ClientProvidersProps {
  children: ReactNode;
  user: any;
}

export default function ClientProviders({ children, user }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider initialUser={user}>
          <ThemeApplier>
            {children}
          </ThemeApplier>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
