'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { useToast } from './ToastContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorBoundaryWrapper({ children }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryInner>
      {children}
    </ErrorBoundaryInner>
  );
}

function ErrorBoundaryInner({ children }: ErrorBoundaryProps) {
  const { addToast } = useToast();
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (hasError && error) {
      addToast(error.message || 'An unexpected error occurred', 'error');
    }
  }, [hasError, error, addToast]);

  return (
    <React.ErrorBoundary
      onError={(error: Error, errorInfo: ErrorInfo) => {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        setError(error);
        setHasError(true);
      }}
      fallback={
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-600">An error occurred. Please try again later.</p>
        </div>
      }
    >
      {children}
    </React.ErrorBoundary>
  );
}

export default ErrorBoundaryWrapper;
