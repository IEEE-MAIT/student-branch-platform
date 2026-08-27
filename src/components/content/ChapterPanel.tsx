import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { ChapterSocialLinks } from './ChapterSocialLinks';
import { FiArrowRight } from 'react-icons/fi';

/**
 * Props for ChapterPanel component.
 */
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

/**
 * Reusable OrganizationUnit Chapter Panel Component.
 * Displays chapter summary, brand accents, tagline, statistics, parent society affiliation, social links, and direct link with react-icons.
 */
export const ChapterPanel: React.FC<ChapterPanelProps> = ({
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
  const isAffinityGroup = type.toLowerCase().includes('affinity') || slug === 'wie';
  
  // Resolve logo source with fallback to existing static logos for wie, eds, and sb
  const lightLogo =
    logoUrl ||
    (slug === 'eds'
      ? '/eds_mait_sb_light_mode_logo.png'
      : slug === 'wie'
      ? '/wie_mait_light_mode_logo.png'
      : slug === 'sb'
      ? '/ieee_mait_sb_light_mode_logo.png'
      : null);

  const darkLogo =
    slug === 'eds'
      ? '/eds_mait_sb_dark_mode_logo.png'
      : slug === 'wie'
      ? '/wie_mait_dark_mode_logo.png'
      : slug === 'sb'
      ? '/ieee_mait_sb_dark_mode_logo.png'
      : lightLogo;

  const ctaLabel = isAffinityGroup
    ? 'Join WIE'
    : slug === 'eds'
    ? 'Join EDS'
    : slug === 'sb'
    ? 'Join Branch'
    : 'Explore Unit';

  return (
    <div
      className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2px] flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-warm-300 dark:hover:border-gray-700 group relative"
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : undefined}
      aria-label={`${name} - ${type}`}
    >
      <div>
        {/* Header: Type Badge & Parent Society */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] ${
              isAffinityGroup
                ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'bg-ieee-subtle dark:bg-sky-950 text-ieee-blue dark:text-sky-400 border border-ieee-blue/20 dark:border-sky-800'
            }`}
          >
            {type}
          </span>
          {parentSociety && (
            <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">
              {parentSociety}
            </span>
          )}
        </div>

        {/* Logo or Text Heading */}
        {lightLogo ? (
          <div className="mb-3 flex items-center h-16">
            <Image
              src={lightLogo}
              alt={`${name} Logo`}
              width={260}
              height={80}
              className="w-auto max-h-14 object-contain dark:hidden"
              unoptimized={lightLogo.startsWith('/')}
            />
            {darkLogo && (
              <Image
                src={darkLogo}
                alt={`${name} Logo`}
                width={260}
                height={80}
                className="w-auto max-h-14 object-contain hidden dark:block"
                unoptimized={darkLogo.startsWith('/')}
              />
            )}
          </div>
        ) : (
          <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal mb-2 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
            {name}
          </h3>
        )}

        {/* Optional Tagline */}
        {tagline && (
          <p className="font-mono text-xs text-ieee-blue font-medium uppercase tracking-wider mb-2.5">
            {tagline}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-warm-400 dark:text-gray-300 leading-relaxed line-clamp-3 font-sans">
          {description}
        </p>
      </div>

      {/* Footer bar */}
      <div className="pt-6 border-t border-warm-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs font-mono text-warm-400 dark:text-gray-400">
          {memberCount !== undefined && memberCount !== null && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-ink dark:text-gray-100">{memberCount}</span> Members
            </span>
          )}
          {eventCount !== undefined && eventCount !== null && (
            <span className="flex items-center gap-1">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 uppercase tracking-wider transition-all duration-150 self-start sm:self-auto group-hover:translate-x-0.5"
        >
          <span>{ctaLabel}</span>
          <FiArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
