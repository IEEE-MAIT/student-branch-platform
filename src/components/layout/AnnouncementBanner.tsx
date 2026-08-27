'use client';

/**
 * @file src/components/layout/AnnouncementBanner.tsx
 * @description Site-wide dismissable announcement banner for active recruitment drives, hackathons, or flagship events.
 * 
 * SPECIFICATIONS:
 * - Positioned at top of root layout above header navigation.
 * - Dismissable dismiss action with persistent sessionStorage visibility check.
 * - High-contrast styling with action CTA link and smooth fade-in.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import Link from '@/components/ui/AppLink';

export const AnnouncementBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Check if dismissed in current session
    try {
      const isDismissed = sessionStorage.getItem('ieee_announcement_dismissed');
      if (isDismissed === 'true') {
        setLoading(false);
        return;
      }
    } catch {}

    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data: any) => {
        if (!data.error && data.announcementActive && data.announcementMessage) {
          setSettings(data);
          setVisible(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem('ieee_announcement_dismissed', 'true');
    } catch {}
  };

  if (loading || !visible || !settings || !settings.announcementMessage) return null;

  return (
    <aside
      aria-label="Important Announcement"
      className="bg-ieee-blue dark:bg-sky-950 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-ieee-dark dark:border-sky-900/50 transition-colors"
    >
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="bg-white/20 dark:bg-sky-800/60 font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider">
          Notice
        </span>
        <span className="font-sans font-medium text-white dark:text-sky-100">{settings.announcementMessage}</span>
        {settings.announcementLinkHref && settings.announcementLinkText && (
          <Link
            href={settings.announcementLinkHref}
            className="underline hover:text-sky-200 font-semibold tracking-wide ml-1 inline-flex items-center gap-0.5"
          >
            <span>{settings.announcementLinkText}</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="text-white/80 hover:text-white dark:text-sky-300 dark:hover:text-white p-1 ml-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
        aria-label="Dismiss Announcement"
        title="Dismiss Announcement"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </aside>
  );
};
