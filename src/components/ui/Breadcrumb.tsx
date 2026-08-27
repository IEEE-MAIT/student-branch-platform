/**
 * @file src/components/ui/Breadcrumb.tsx
 * @description Breadcrumb navigation component per design spec with react-icons.
 * Used on all sub-pages except the Homepage.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import Link from './AppLink';
import { FiChevronRight } from 'react-icons/fi';

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
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-warm-400 dark:text-gray-400">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <FiChevronRight className="w-3 h-3 text-warm-300 dark:text-gray-600 select-none" aria-hidden />
              )}
              {isLast || !item.href ? (
                <span className="text-ink dark:text-gray-100 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-ieee-blue dark:hover:text-sky-400 transition-colors"
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
