import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { ChapterSocialLinks } from './ChapterSocialLinks';

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
 * Displays chapter summary, brand accents, tagline, statistics, parent society affiliation, social links, and direct link.
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
  const resolvedLogo =
    logoUrl ||
    (slug === 'eds'
      ? '/eds_mait_logo.png'
      : slug === 'wie'
      ? '/wie_ag_mait_logo.png'
      : slug === 'sb'
      ? '/main_student_branch_logo.png'
      : null);

  const ctaLabel = isAffinityGroup
    ? 'Join WIE →'
    : slug === 'eds'
    ? 'Join EDS →'
    : slug === 'sb'
    ? 'Join Branch →'
    : 'Explore Unit →';

  return (
    <div
      className="border border-warm-200 bg-white p-6 sm:p-8 rounded-[2px] flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-warm-300 group relative"
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : undefined}
      aria-label={`${name} - ${type}`}
    >
      <div>
        {/* Header: Type Badge & Parent Society */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] ${
              isAffinityGroup
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-ieee-subtle text-ieee-blue border border-ieee-blue/20'
            }`}
          >
            {type}
          </span>
          {parentSociety && (
            <span className="font-mono text-[11px] text-warm-400">
              {parentSociety}
            </span>
          )}
        </div>

        {/* Logo or Text Heading */}
        {resolvedLogo ? (
          <div className="mb-3 flex items-center h-16">
            <Image
              src={resolvedLogo}
              alt={`${name} Logo`}
              width={260}
              height={80}
              className="w-auto max-h-14 object-contain"
              unoptimized={resolvedLogo.startsWith('/')}
            />
          </div>
        ) : (
          <h3 className="font-serif text-2xl text-ink font-normal mb-2 group-hover:text-ieee-blue transition-colors">
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
        <p className="text-sm text-warm-400 leading-relaxed line-clamp-3 font-sans">
          {description}
        </p>
      </div>

      {/* Footer bar */}
      <div className="pt-6 border-t border-warm-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs font-mono text-warm-400">
          {memberCount !== undefined && memberCount !== null && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-ink">{memberCount}</span> Members
            </span>
          )}
          {eventCount !== undefined && eventCount !== null && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-ink">{eventCount}</span> Events
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ieee-blue hover:text-ieee-dark uppercase tracking-wider transition-all duration-150 self-start sm:self-auto group-hover:translate-x-0.5"
        >
          <span>{ctaLabel}</span>
          <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

