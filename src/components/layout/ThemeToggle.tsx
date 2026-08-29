'use client';

/**
 * @file src/components/layout/ThemeToggle.tsx
 * @description Accessible Theme Toggle button with micro-animations and variant styling.
 * 
 * Supports Light (Sun) and Dark (Moon) mode switches with high-contrast text labels.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC<{
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'footer' | 'nav';
}> = ({
  className = '',
  showLabel = false,
  variant = 'default',
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
        className={`border border-warm-200/80 dark:border-gray-800/80 text-warm-400 opacity-60 flex items-center justify-center ${
          variant === 'nav' 
            ? 'w-8 h-8 rounded-full' 
            : 'p-2 rounded-lg min-w-[36px] min-h-[34px]'
        } ${className}`}
        aria-label="Loading theme toggle"
      >
        <span className="w-3.5 h-3.5" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const variantStyles =
    variant === 'footer'
      ? 'px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border-white/15 text-gray-100 hover:text-white min-h-[34px]'
      : variant === 'nav'
      ? 'w-8 h-8 rounded-full border-warm-200/80 dark:border-gray-800/80 bg-warm-50/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 p-0'
      : 'px-2.5 py-1.5 rounded-lg border-warm-200 dark:border-gray-800 bg-warm-50/70 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-800 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 min-h-[34px]';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative border transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 flex items-center justify-center gap-1.5 cursor-pointer ${variantStyles} ${className}`}
      aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
    >
      {isDark ? (
        <FiSun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 group-hover:rotate-45 shrink-0" />
      ) : (
        <FiMoon className="w-3.5 h-3.5 text-sky-400 dark:text-gray-300 transition-transform duration-300 group-hover:-rotate-12 shrink-0" />
      )}

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide text-inherit select-none">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
