'use client';

/**
 * @file src/components/layout/ThemeToggle.tsx
 * @description Accessible Theme Toggle button with micro-animations.
 * 
 * Supports Light (Sun) and Dark (Moon) mode switches using react-icons.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
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
        <FiSun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <FiMoon className="w-4 h-4 text-slate-700 dark:text-gray-300 transition-transform duration-300 group-hover:-rotate-12" />
      )}

      {showLabel && (
        <span className="text-xs font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
