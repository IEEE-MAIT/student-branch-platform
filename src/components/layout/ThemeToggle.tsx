'use client';

/**
 * @file src/components/layout/ThemeToggle.tsx
 * @description Accessible Theme Toggle button with micro-animations.
 * 
 * Supports Light (Sun) and Dark (Moon) mode switches.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = false,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`p-2 rounded-lg border border-warm-200 dark:border-gray-800 text-warm-400 opacity-60 min-w-[40px] min-h-[40px] flex items-center justify-center ${className}`}
        aria-label="Loading theme toggle"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative p-2 rounded-lg border border-warm-200 dark:border-gray-800 bg-warm-50/70 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-800 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue min-w-[40px] min-h-[40px] flex items-center justify-center gap-2 ${className}`}
      aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
    >
      {isDark ? (
        // Sun Icon
        <svg
          className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon Icon
        <svg
          className="w-4 h-4 text-slate-700 dark:text-gray-300 transition-transform duration-300 group-hover:-rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}

      {showLabel && (
        <span className="text-xs font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
