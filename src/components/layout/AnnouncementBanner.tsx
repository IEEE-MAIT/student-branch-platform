'use client';

/**
 * @file src/components/layout/AnnouncementBanner.tsx
 * @description Site-wide dismissable announcement banner for active recruitment drives, hackathons, or flagship events.
 * 
 * SPECIFICATIONS:
 * - Positioned at top of root layout above header navigation.
 * - Dismissable dismiss action (`useState`) with persistent local visibility.
 * - IEEE Blue background with high-contrast white text and action CTA link.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Props for AnnouncementBanner component.
 */
interface AnnouncementBannerProps {
  /** Announcement text message */
  message?: string;
  /** Action link text */
  linkText?: string;
  /** Action link target URL */
  linkHref?: string;
}

/**
 * Site-wide Announcement Banner Component.
 */
export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message = "Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.",
  linkText = "Register Now →",
  linkHref = "/join",
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-ieee-blue text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-ieee-dark">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="bg-white/20 font-bold px-2 py-0.5 rounded-[2px] uppercase text-[10px]">
          Announcement
        </span>
        <span className="font-sans font-medium text-white">{message}</span>
        <Link href={linkHref} className="underline hover:text-ieee-subtle font-semibold tracking-wide">
          {linkText}
        </Link>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-white/80 hover:text-white font-mono text-sm ml-4 focus:outline-none transition-colors"
        aria-label="Dismiss Announcement"
      >
        ✕
      </button>
    </div>
  );
};
