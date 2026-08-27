'use client';

import React, { useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Client runtime exception:', error);
  }, [error]);

  return (
    <main className="flex-1 py-20 sm:py-28 bg-white dark:bg-gray-950 flex items-center min-h-[70vh]">
      <Container size="narrow" className="text-center space-y-6">
        <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-red-200 dark:border-red-900">
          <FiAlertTriangle className="w-3.5 h-3.5" />
          <span>Application Error</span>
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl text-ink dark:text-gray-100 font-normal">
          Something went wrong
        </h1>

        <p className="text-sm sm:text-base text-warm-500 dark:text-gray-400 font-sans max-w-md mx-auto leading-relaxed">
          An unexpected error occurred while rendering this view. You can attempt to refresh the component state or return to the homepage.
        </p>

        {error.digest && (
          <p className="font-mono text-[11px] text-warm-400 dark:text-gray-400">
            Error Digest: <code>{error.digest}</code>
          </p>
        )}

        <div className="pt-4 flex items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
          >
            <span className="flex items-center gap-1.5">
              <FiRefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </span>
          </Button>
          <Button
            href="/"
            variant="secondary"
            size="md"
          >
            <span className="flex items-center gap-1.5">
              <FiHome className="w-4 h-4" />
              <span>Return Home</span>
            </span>
          </Button>
        </div>
      </Container>
    </main>
  );
}
