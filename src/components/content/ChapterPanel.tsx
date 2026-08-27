/**
 * @file src/components/content/ChapterPanel.tsx
 * @description Modern, High-End Card Component for IEEE MAIT Communities & Chartered Units.
 * 
 * FEATURES:
 * - Robust dual-mode static logo resolution for Student Branch (sb), EDS Chapter (eds), and WIE AG (wie).
 * - Premium aesthetics: Soft rounded-2xl geometry, subtle border elevation, and refined dark/light contrast.
 * - Monospace meta pills, chapter taglines, descriptive summaries, and activity metrics.
 * - Integrated social media icon triggers and directional CTA buttons.
 * - 100% WCAG AA compliant typography and contrast tokens.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { memo } from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { ChapterSocialLinks } from './ChapterSocialLinks';
import { FiArrowRight } from 'react-icons/fi';

export interface ChapterPanelProps {
  /** Name of the chapter or affinity group */
  name: string;
  /** URL slug matching `/chapters/[slug]` */
  slug: string;
  /** Unit classification type (e.g. 'Affinity Group', 'Technical Chapter') */
  type: string;
  /** Short punchy one-liner subtitle */
  tagline?: string | null;
  /** Overview summary description */
  description?: string | null;
  /** Logo image URL (Cloudinary or local static path) */
  logoUrl?: string | null;
  /** Chapter brand accent color (e.g. '#7C3AED' for WIE, '#00629B' for EDS) */
  accentColor?: string | null;
  /** Chapter Instagram URL */
  instagramUrl?: string | null;
  /** Chapter LinkedIn URL */
  linkedinUrl?: string | null;
  /** Chapter GitHub URL */
  githubUrl?: string | null;
  /** Current active member count */
  memberCount?: number | string | null;
  /** Total events organized count */
  eventCount?: number | string | null;
  /** Global IEEE parent society (e.g. 'IEEE Women in Engineering') */
  parentSociety?: string | null;
  /** Established year string */
  establishedYear?: string | null;
}

const LOCAL_CHAPTER_LOGOS: Record<string, { light: string; dark: string }> = {
  eds: {
    light: '/eds_mait_sb_light_mode_logo.png',
    dark: '/eds_mait_sb_dark_mode_logo.png',
  },
  wie: {
    light: '/wie_mait_light_mode_logo.png',
    dark: '/wie_mait_dark_mode_logo.png',
  },
  sb: {
    light: '/ieee_mait_sb_light_mode_logo.png',
    dark: '/ieee_mait_sb_dark_mode_logo.png',
  },
};

function getChapterLogos(slug: string, logoUrl?: string | null) {
  const normSlug = slug.toLowerCase().trim();
  const matched = LOCAL_CHAPTER_LOGOS[normSlug];
  if (matched) {
    return matched;
  }
  if (
    logoUrl &&
    !logoUrl.includes('main_student_branch') &&
    !logoUrl.includes('wie_ag_mait') &&
    !logoUrl.includes('eds_mait_logo')
  ) {
    return { light: logoUrl, dark: logoUrl };
  }
  return { light: null, dark: null };
}

export const ChapterPanel: React.FC<ChapterPanelProps> = memo(({
  name,
  slug,
  type,
  tagline,
  description,
  logoUrl,
  accentColor,
  instagramUrl,
  linkedinUrl,
  githubUrl,
  memberCount,
  eventCount,
  parentSociety,
}) => {
  const isStudentBranch = slug === 'sb' || type.toLowerCase().includes('student branch') || type.toLowerCase().includes('parent');
  const isAffinityGroup = type.toLowerCase().includes('affinity') || slug === 'wie';
  const displayType = isStudentBranch ? 'Student Branch' : type;
  const logos = getChapterLogos(slug, logoUrl);

  const badgeClass = isStudentBranch
    ? 'bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-300 border-ieee-blue/20 dark:border-sky-800'
    : isAffinityGroup
    ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    : 'bg-warm-100/90 dark:bg-gray-800 text-warm-700 dark:text-gray-300 border-warm-200/80 dark:border-gray-700/80';

  const ctaLabel = isAffinityGroup
    ? 'Join WIE'
    : slug === 'eds'
    ? 'Join EDS'
    : slug === 'sb'
    ? 'Join Branch'
    : 'Explore Unit';

  return (
    <div
      className="bg-white dark:bg-gray-900 border border-warm-200/90 dark:border-gray-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-xl hover:border-warm-300 dark:hover:border-gray-700 hover:-translate-y-1.5 transition-all duration-300 ease-out group relative backdrop-blur-xs h-full"
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: '3px' } : undefined}
      aria-label={`${name} - ${displayType}`}
    >
      <div className="space-y-4">
        {/* Header: Unit Type Badge & Parent Society */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}
          >
            {displayType}
          </span>
          {parentSociety && (
            <span className="font-mono text-[10px] text-warm-400 dark:text-gray-400">
              {parentSociety}
            </span>
          )}
        </div>

        {/* Logo Presentation Area */}
        {logos.light ? (
          <div className="h-14 sm:h-16 flex items-center pt-1">
            <Image
              src={logos.light}
              alt={`${name} Logo`}
              width={260}
              height={70}
              className="w-auto max-h-12 sm:max-h-14 object-contain dark:hidden transition-transform duration-300 group-hover:scale-102"
              unoptimized
            />
            {logos.dark && (
              <Image
                src={logos.dark}
                alt={`${name} Logo`}
                width={260}
                height={70}
                className="w-auto max-h-12 sm:max-h-14 object-contain hidden dark:block transition-transform duration-300 group-hover:scale-102"
                unoptimized
              />
            )}
          </div>
        ) : (
          <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-medium group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
            {name}
          </h3>
        )}

        {/* Tagline */}
        {tagline && (
          <p className="font-mono text-[11px] text-ieee-blue dark:text-sky-400 font-semibold uppercase tracking-wider leading-snug">
            {tagline}
          </p>
        )}

        {/* Overview Description */}
        {description && (
          <p className="text-xs text-warm-500 dark:text-gray-400 leading-relaxed line-clamp-3 font-sans">
            {description}
          </p>
        )}
      </div>

      {/* Footer Meta & Social Actions Bar */}
      <div className="pt-4 border-t border-warm-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3.5 text-xs font-mono text-warm-400 dark:text-gray-400">
          {memberCount !== undefined && memberCount !== null && (
            <span className="flex items-center gap-1 text-[11px]">
              <span className="font-semibold text-ink dark:text-gray-100">{memberCount}</span> Members
            </span>
          )}
          {eventCount !== undefined && eventCount !== null && (
            <span className="flex items-center gap-1 text-[11px]">
              <span className="font-semibold text-ink dark:text-gray-100">{eventCount}</span> Events
            </span>
          )}
          <ChapterSocialLinks
            instagram={instagramUrl}
            linkedin={linkedinUrl}
            github={githubUrl}
            size="sm"
          />
        </div>

        <Link
          href={`/chapters/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 uppercase tracking-wider transition-all duration-150 group-hover:translate-x-0.5"
        >
          <span>{ctaLabel}</span>
          <FiArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
});

ChapterPanel.displayName = 'ChapterPanel';
