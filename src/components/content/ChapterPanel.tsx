import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Props for ChapterPanel component.
 */
interface ChapterPanelProps {
  /** Name of the chapter or affinity group */
  name: string;
  /** URL slug matching `/chapters/[slug]` */
  slug: string;
  /** Unit classification type (e.g. 'Affinity Group', 'Technical Chapter') */
  type: string;
  /** Overview summary description */
  description?: string | null;
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
 * Displays chapter summary, statistics, parent society affiliation, and direct link to chapter detail route.
 */
export const ChapterPanel: React.FC<ChapterPanelProps> = ({
  name,
  slug,
  type,
  description,
  memberCount,
  eventCount,
  parentSociety,
}) => {
  return (
    <div className="border border-warm-200 bg-white p-6 sm:p-8 rounded-[2px] flex flex-col justify-between space-y-6">
      <div>
        <div className="flex items-center justify-between gap-2 mb-5">
          <span className="font-mono text-xs uppercase tracking-wider text-ieee-blue font-semibold">
            {type}
          </span>
          {parentSociety && (
            <span className="font-mono text-[11px] text-warm-300">
              {parentSociety}
            </span>
          )}
        </div>

        {slug === 'eds' || slug === 'wie' ? (
          <div className="mb-4 flex items-center h-20">
            <Image 
              src={slug === 'eds' ? "/eds_mait_logo.png" : "/wie_ag_mait_logo.png"} 
              alt={`${name} Logo`} 
              width={300} 
              height={100} 
              className="w-auto max-h-16 object-contain"
            />
          </div>
        ) : (
          <h3 className="font-serif text-2xl text-ink font-normal mb-3">
            {name}
          </h3>
        )}

        <p className="text-sm text-warm-400 leading-relaxed line-clamp-3 font-sans">
          {description}
        </p>
      </div>

      <div className="pt-6 border-t border-warm-200 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-mono text-warm-400">
          {memberCount && <span>{memberCount} Members</span>}
          {eventCount && <span>{eventCount} Events</span>}
        </div>

        <Link
          href={`/chapters/${slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-ieee-blue hover:text-ieee-dark uppercase tracking-wider transition-colors"
        >
          <span>Explore Chapter</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
