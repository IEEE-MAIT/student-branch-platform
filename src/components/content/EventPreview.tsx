import React from 'react';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { Badge } from '../ui/Badge';

/**
 * Props for EventPreview component.
 */
export interface EventPreviewProps {
  /** Event title */
  title: string;
  /** URL slug */
  slug: string;
  /** Formatted date string */
  date?: string | null;
  /** Time range */
  time?: string | null;
  /** Venue location */
  venue?: string | null;
  /** Organizing unit name */
  unit?: string | null;
  /** Event category tag */
  category?: string | null;
  /** Flagship / Chapter / Technical event classification */
  eventType?: string | null;
  /** Event status: upcoming | ongoing | past */
  status?: string | null;
  /** Whether event is actively live */
  isLive?: boolean;
  /** Official IEEE vTools verification link */
  vtoolsLink?: string | null;
  /** Short description */
  description?: string | null;
  /** Poster image URL */
  imageSrc?: string | null;
  /** Whether to render as featured next event hero card */
  isFeatured?: boolean;
  /** Registration URL */
  registrationLink?: string | null;
}

/**
 * Event Preview List Item & Featured Hero Component.
 * Supports both large featured event card layout and compact ruled list rows.
 */
export const EventPreview: React.FC<EventPreviewProps> = ({
  title,
  slug,
  date,
  time,
  venue,
  unit,
  category,
  eventType,
  status,
  isLive = false,
  vtoolsLink,
  description,
  imageSrc,
  isFeatured = false,
}) => {
  const isFlagship = eventType?.toLowerCase() === 'flagship' || category?.toLowerCase().includes('flagship');
  const isOngoing = isLive || status?.toLowerCase() === 'ongoing';

  if (isFeatured) {
    return (
      <div className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-stretch shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div>
            {/* Status, Flagship & Unit Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {isOngoing && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Now
                </span>
              )}
              {isFlagship && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-700 shadow-xs">
                  ⭐ Flagship Event
                </span>
              )}
              {category && <Badge variant="ieee">{category}</Badge>}
              {unit && <Badge variant="neutral">{unit}</Badge>}
              {vtoolsLink && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/80 text-ieee-blue dark:text-sky-300 font-mono text-[10px] font-medium border border-sky-200 dark:border-sky-800">
                  <span>vTools Verified</span>
                  <span className="text-[8px]">↗</span>
                </span>
              )}
            </div>

            <div className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-wider mb-2">
              {date} {time && `· ${time}`}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-gray-100 font-normal leading-tight mb-3">
              <Link href={`/events/${slug}`} className="hover:text-ieee-blue dark:hover:text-sky-400 transition-colors">
                {title}
              </Link>
            </h3>

            {description && (
              <p className="text-sm text-warm-500 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4 font-sans">
                {description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs text-warm-400 dark:text-gray-400 font-mono">
              📍 {venue}
            </div>

            <Link
              href={`/events/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 uppercase tracking-wider transition-colors"
            >
              <span>View Details & Register</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {imageSrc && (
          <div className="relative w-full lg:w-96 h-64 lg:h-auto min-h-[240px] bg-warm-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
            <Image 
              src={imageSrc} 
              alt={title} 
              fill 
              sizes="(max-width: 1024px) 100vw, 384px"
              className="object-cover" 
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-warm-200 dark:border-gray-800 hover:bg-warm-100/40 dark:hover:bg-gray-800/40 px-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase w-28 shrink-0">
          {date}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-sans font-medium text-base text-ink dark:text-gray-100">
              <Link href={`/events/${slug}`} className="hover:text-ieee-blue dark:hover:text-sky-400 transition-colors">
                {title}
              </Link>
            </h4>
            {isOngoing && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold uppercase animate-pulse border border-emerald-300 dark:border-emerald-800">
                Live
              </span>
            )}
            {isFlagship && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[9px] font-bold uppercase border border-amber-300 dark:border-amber-800">
                ⭐ Flagship
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-warm-400 dark:text-gray-400 mt-0.5 font-sans">
            <span>{unit}</span>
            <span>·</span>
            <span>{venue}</span>
            {vtoolsLink && (
              <>
                <span>·</span>
                <span className="text-ieee-blue dark:text-sky-400 font-mono text-[10px]">vTools</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/events/${slug}`}
        className="text-xs font-mono font-medium text-ieee-blue dark:text-sky-400 hover:underline shrink-0 self-end sm:self-center"
      >
        View →
      </Link>
    </div>
  );
};
