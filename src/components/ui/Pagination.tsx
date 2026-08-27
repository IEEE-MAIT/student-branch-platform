'use client';

/**
 * @file src/components/ui/Pagination.tsx
 * @description Clean, monospaced pagination control matching IEEE design system spec with react-icons.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-warm-200 dark:border-gray-800 pt-6 mt-8 w-full">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 disabled:text-warm-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed hover:underline flex items-center gap-1 cursor-pointer"
      >
        <FiChevronLeft className="w-4 h-4" />
        <span>Previous Page</span>
      </button>

      <span className="font-mono text-xs text-warm-400 dark:text-gray-400">
        Page <span className="font-bold text-ink dark:text-gray-100">{currentPage}</span> of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 disabled:text-warm-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed hover:underline flex items-center gap-1 cursor-pointer"
      >
        <span>Next Page</span>
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
