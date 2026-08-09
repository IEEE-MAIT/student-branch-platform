'use client';

/**
 * @file src/components/ui/Pagination.tsx
 * @description Clean, monospaced pagination control matching IEEE design system spec (Section 52).
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-warm-200 pt-6 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="font-mono text-xs font-semibold text-ieee-blue disabled:text-warm-300 disabled:cursor-not-allowed hover:underline"
      >
        ← Previous Page
      </button>

      <span className="font-mono text-xs text-warm-400">
        Page <span className="font-bold text-ink">{currentPage}</span> of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="font-mono text-xs font-semibold text-ieee-blue disabled:text-warm-300 disabled:cursor-not-allowed hover:underline"
      >
        Next Page →
      </button>
    </div>
  );
}
