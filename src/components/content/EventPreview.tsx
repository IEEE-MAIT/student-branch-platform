import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '../ui/Badge';

/**
 * Props for EventPreview component.
 */
interface EventPreviewProps {
  /** Event title */
  title: string;
  /** URL slug */
  slug: string;
  /** Formatted date string */
  date: string;
  /** Time range */
  time?: string;
  /** Venue location */
  venue: string;
  /** Organizing unit name */
  unit: string;
  /** Event category tag */
  category: string;
  /** Short description */
  description?: string;
  /** Poster image URL */
  imageSrc?: string;
  /** Whether to render as featured next event hero card */
  isFeatured?: boolean;
  /** Registration URL */
  registrationLink?: string;
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
  description,
  imageSrc,
  isFeatured = false,
}) => {
  if (isFeatured) {
    return (
      <div className="border border-warm-200 bg-white rounded-[2px] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="ieee">{category}</Badge>
              <Badge variant="neutral">{unit}</Badge>
            </div>

            <div className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider mb-2">
              {date} {time && `· ${time}`}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight mb-3">
              <Link href={`/events/${slug}`} className="hover:text-ieee-blue transition-colors">
                {title}
              </Link>
            </h3>

            {description && (
              <p className="text-sm text-warm-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                {description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-warm-200 flex items-center justify-between">
            <div className="text-xs text-warm-400 font-mono">
              📍 {venue}
            </div>

            <Link
              href={`/events/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ieee-blue hover:text-ieee-dark uppercase tracking-wider transition-colors"
            >
              <span>View Details & Register</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {imageSrc && (
          <div className="relative w-full lg:w-96 h-64 lg:h-auto min-h-[240px] bg-warm-100 rounded-[2px] overflow-hidden flex-shrink-0">
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-warm-200 hover:bg-warm-100/40 px-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className="font-mono text-xs font-semibold text-ieee-blue uppercase w-28 flex-shrink-0">
          {date}
        </div>
        <div>
          <h4 className="font-sans font-medium text-base text-ink">
            <Link href={`/events/${slug}`} className="hover:text-ieee-blue transition-colors">
              {title}
            </Link>
          </h4>
          <div className="flex items-center gap-2 text-xs text-warm-400 mt-0.5 font-sans">
            <span>{unit}</span>
            <span>·</span>
            <span>{venue}</span>
          </div>
        </div>
      </div>

      <Link
        href={`/events/${slug}`}
        className="text-xs font-mono font-medium text-ieee-blue hover:underline flex-shrink-0 self-end sm:self-center"
      >
        View →
      </Link>
    </div>
  );
};
