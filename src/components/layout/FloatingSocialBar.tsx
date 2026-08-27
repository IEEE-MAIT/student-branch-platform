'use client';

/**
 * @file src/components/layout/FloatingSocialBar.tsx
 * @description Fixed floating social media bar on the screen edge with official IEEE MAIT accounts.
 * 
 * Uses react-icons/fa6 for authentic brand icons.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState } from 'react';
import { FaLinkedinIn, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';

interface SocialItem {
  id: string;
  name: string;
  entity: string;
  handle: string;
  url: string;
  badgeLabel?: string;
  badgeColor?: string;
  colorClass: string;
  icon: React.ReactNode;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: 'sb-linkedin',
    name: 'IEEE MAIT on LinkedIn',
    entity: 'Student Branch',
    handle: 'company/ieee-mait',
    url: 'https://www.linkedin.com/company/ieee-mait',
    badgeLabel: 'SB',
    badgeColor: 'bg-[#00629B] text-white',
    colorClass: 'hover:bg-[#0A66C2] hover:text-white',
    icon: <FaLinkedinIn className="w-4 h-4" />,
  },
  {
    id: 'sb-instagram',
    name: 'IEEE MAIT on Instagram',
    entity: 'Student Branch',
    handle: '@ieeemait',
    url: 'https://www.instagram.com/ieeemait/',
    badgeLabel: 'SB',
    badgeColor: 'bg-[#DD2A7B] text-white',
    colorClass: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white',
    icon: <FaInstagram className="w-4 h-4" />,
  },
  {
    id: 'sb-x',
    name: 'IEEE MAIT on X (Twitter)',
    entity: 'Student Branch',
    handle: '@IEEE_MAIT',
    url: 'https://x.com/IEEE_MAIT',
    badgeLabel: 'SB',
    badgeColor: 'bg-black text-white',
    colorClass: 'hover:bg-black hover:text-white',
    icon: <FaXTwitter className="w-4 h-4" />,
  },
  {
    id: 'wie-instagram',
    name: 'IEEE WIE MAIT Instagram',
    entity: 'WIE Affinity Group',
    handle: '@wie.mait',
    url: 'https://www.instagram.com/wie.mait/',
    badgeLabel: 'WIE',
    badgeColor: 'bg-purple-600 text-white',
    colorClass: 'hover:bg-purple-600 hover:text-white',
    icon: (
      <div className="flex items-center justify-center font-bold font-sans text-[10px] tracking-tight">
        WIE
      </div>
    ),
  },
  {
    id: 'eds-instagram',
    name: 'IEEE EDS MAIT Instagram',
    entity: 'EDS Chapter',
    handle: '@ieee_eds_mait_official',
    url: 'https://www.instagram.com/ieee_eds_mait_official/',
    badgeLabel: 'EDS',
    badgeColor: 'bg-sky-600 text-white',
    colorClass: 'hover:bg-[#0284C7] hover:text-white',
    icon: (
      <div className="flex items-center justify-center font-bold font-sans text-[10px] tracking-tight">
        EDS
      </div>
    ),
  },
];

export const FloatingSocialBar: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      aria-label="Official Social Channels"
      className="hidden xl:flex fixed left-3.5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1.5 p-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-warm-200 dark:border-gray-800 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      {/* Top Header Label */}
      <div className="w-1.5 h-1.5 rounded-full bg-ieee-blue dark:bg-sky-400 my-1" />

      {/* Main Student Branch Social Channels */}
      {SOCIAL_ITEMS.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="relative flex items-center"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue ${item.colorClass}`}
          >
            {item.icon}
          </a>

          {/* Accessible Animated Flyout Tooltip */}
          {hoveredId === item.id && (
            <div
              role="tooltip"
              className="animate-tooltip absolute left-full ml-3 px-3 py-2 bg-gray-950 dark:bg-gray-900 text-white rounded-lg shadow-xl border border-gray-800 whitespace-nowrap z-50 pointer-events-none flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                  {item.badgeLabel}
                </span>
                <span className="font-semibold text-xs leading-tight text-white">{item.name}</span>
              </div>
              <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                <span>{item.handle}</span>
                <FiExternalLink className="w-2.5 h-2.5 text-gray-400" />
              </span>
              {/* Arrow */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950 dark:border-r-gray-900" />
            </div>
          )}
        </div>
      ))}

      {/* Subtle Group Divider */}
      <div className="w-5 h-[1px] bg-warm-200 dark:bg-gray-800 my-1" />

      {/* Chapter & Affinity Group Channels with Distinct Badges */}
      {SOCIAL_ITEMS.slice(3).map((item) => (
        <div
          key={item.id}
          className="relative flex items-center"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue ${item.colorClass}`}
          >
            {item.icon}
          </a>

          {/* Accessible Animated Flyout Tooltip */}
          {hoveredId === item.id && (
            <div
              role="tooltip"
              className="animate-tooltip absolute left-full ml-3 px-3 py-2 bg-gray-950 dark:bg-gray-900 text-white rounded-lg shadow-xl border border-gray-800 whitespace-nowrap z-50 pointer-events-none flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                  {item.badgeLabel}
                </span>
                <span className="font-semibold text-xs leading-tight text-white">{item.name}</span>
              </div>
              <span className="text-[10px] text-purple-300 dark:text-sky-400 font-mono flex items-center gap-1">
                <span>{item.handle}</span>
                <FiExternalLink className="w-2.5 h-2.5 text-gray-400" />
              </span>
              {/* Arrow */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950 dark:border-r-gray-900" />
            </div>
          )}
        </div>
      ))}

      {/* Bottom Dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-ieee-blue dark:bg-sky-400 my-1" />
    </aside>
  );
};
