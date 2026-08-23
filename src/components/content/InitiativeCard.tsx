import React from 'react';
import Link from '@/components/ui/AppLink';

/**
 * @file src/components/content/InitiativeCard.tsx
 * @description Card component for long-term chapter initiatives, mentorship circles, and outreach drives.
 * 
 * Used on the WIE Affinity Group portal, EDS Chapter portal, and Student Branch pages.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

export interface InitiativeCardProps {
  /** Title of the strategic initiative */
  title: string;
  /** Slug identifier */
  slug: string;
  /** Narrative description */
  description: string;
  /** Status ('Active', 'Upcoming', 'Completed') */
  status?: string;
  /** Target audience tag (e.g. '1st & 2nd Year Women in STEM') */
  targetAudience?: string | null;
  /** Optional icon identifier */
  iconName?: string | null;
  /** Optional accent color hex override */
  accentColor?: string | null;
  /** Action button destination */
  actionHref?: string;
  /** Action button text */
  actionText?: string;
}

export const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  slug,
  description,
  status = 'Active',
  targetAudience,
  iconName,
  accentColor,
  actionHref = '/join',
  actionText = 'Get Involved →',
}) => {
  const isActive = status.toLowerCase() === 'active';

  return (
    <div 
      className="border border-warm-200 bg-white rounded-[2px] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-warm-300 group"
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : undefined}
    >
      <div className="space-y-3.5">
        {/* Status Badge & Target Audience */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span 
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] ${
              isActive 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-warm-100 text-warm-500 border border-warm-200'
            }`}
          >
            ● {status}
          </span>
          {targetAudience && (
            <span className="font-mono text-[11px] text-warm-400">
              {targetAudience}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-normal text-ink group-hover:text-ieee-blue transition-colors leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-warm-400 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action link */}
      <div className="pt-4 border-t border-warm-200 flex items-center justify-between">
        <span className="font-mono text-[11px] text-warm-400">
          Chapter Program
        </span>
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-ieee-blue hover:text-ieee-dark uppercase tracking-wider transition-colors"
        >
          <span>{actionText}</span>
        </Link>
      </div>
    </div>
  );
};
