import React from 'react';
import Link from '@/components/ui/AppLink';
import {
  FiArrowRight,
  FiUsers,
  FiZap,
  FiAward,
  FiGlobe,
  FiCpu,
  FiLayers,
  FiBookOpen,
  FiCompass,
} from 'react-icons/fi';

/**
 * @file src/components/content/InitiativeCard.tsx
 * @description Card component for long-term chapter initiatives, mentorship circles, and outreach drives with react-icons.
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

const getInitiativeIcon = (iconName?: string | null) => {
  const name = (iconName || '').toLowerCase();
  switch (name) {
    case 'users':
      return FiUsers;
    case 'sparkles':
    case 'zap':
      return FiZap;
    case 'award':
      return FiAward;
    case 'globe':
      return FiGlobe;
    case 'cpu':
      return FiCpu;
    case 'layers':
      return FiLayers;
    case 'book':
    case 'bookopen':
      return FiBookOpen;
    case 'compass':
      return FiCompass;
    default:
      return FiZap;
  }
};

export const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  slug,
  description,
  status = 'Active',
  targetAudience,
  iconName,
  accentColor,
  actionHref = '/join',
  actionText = 'Get Involved',
}) => {
  const isActive = status.toLowerCase() === 'active';
  const IconComponent = getInitiativeIcon(iconName);

  return (
    <div 
      className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ieee-blue/40 dark:hover:border-sky-500/40 group"
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : undefined}
    >
      <div className="space-y-3.5">
        {/* Status Badge & Target Audience & Initiative Icon */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400 shrink-0">
              <IconComponent className="w-3.5 h-3.5" />
            </div>
            <span 
              className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-warm-100 dark:bg-gray-800 text-warm-500 dark:text-gray-400 border border-warm-200 dark:border-gray-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-warm-400'}`} />
              <span>{status}</span>
            </span>
          </div>
          {targetAudience && (
            <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">
              {targetAudience}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-normal text-ink dark:text-gray-100 group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-400 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action link */}
      <div className="pt-4 border-t border-warm-200 dark:border-gray-800 flex items-center justify-between">
        <span className="font-mono text-[11px] text-warm-400 dark:text-gray-400">
          Chapter Program
        </span>
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 uppercase tracking-wider transition-colors"
        >
          <span>{actionText}</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
