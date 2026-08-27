'use client';

/**
 * @file src/components/content/ShareWidget.tsx
 * @description Interactive social share and copy link widget for articles and publications.
 * 
 * FEATURES:
 * - Direct share links for LinkedIn, X/Twitter, and WhatsApp.
 * - 1-Click "Copy Link" button with animated feedback state.
 * - Fully accessible and compliant with light/dark theme tokens.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState } from 'react';

interface ShareWidgetProps {
  url: string;
  title: string;
  className?: string;
}

export const ShareWidget: React.FC<ShareWidgetProps> = ({ url, title, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy URL', err);
    }
  };

  const shareTitle = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className={`flex items-center justify-between flex-wrap gap-4 py-8 border-b border-warm-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-semibold text-warm-400 dark:text-gray-400 uppercase tracking-wider">
          Share Publication:
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
        {/* Copy Link Button with Reactive Toast State */}
        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
            copied
              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
              : 'bg-white dark:bg-gray-800 border-warm-200 dark:border-gray-700 text-ink dark:text-gray-200 hover:bg-warm-50 dark:hover:bg-gray-700'
          }`}
          aria-label="Copy Publication URL to Clipboard"
        >
          <span>{copied ? '✓ Copied Link' : '🔗 Copy Link'}</span>
        </button>

        {/* LinkedIn Share */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-50 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors flex items-center gap-1"
        >
          <span>LinkedIn</span>
          <span className="text-[10px]">↗</span>
        </a>

        {/* X / Twitter Share */}
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-50 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors flex items-center gap-1"
        >
          <span>X / Twitter</span>
          <span className="text-[10px]">↗</span>
        </a>

        {/* WhatsApp Share */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-warm-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-warm-50 dark:hover:bg-gray-700 text-ink dark:text-gray-200 transition-colors flex items-center gap-1"
        >
          <span>WhatsApp</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  );
};
