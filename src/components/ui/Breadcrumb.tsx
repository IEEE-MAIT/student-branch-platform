/**
 * @file src/components/ui/Breadcrumb.tsx
 * @description Breadcrumb navigation component per design spec (Section 52, 53).
 * Used on all sub-pages except the Homepage.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation with path arrows.
 * The last item is always rendered as plain text (current page), not a link.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-warm-300">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span className="text-warm-200 select-none" aria-hidden>›</span>
              )}
              {isLast || !item.href ? (
                <span className="text-ink font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-ieee-blue transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
