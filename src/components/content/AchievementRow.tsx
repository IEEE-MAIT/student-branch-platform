import React from 'react';
import Link from '@/components/ui/AppLink';

/**
 * Props for AchievementRow component.
 */
interface AchievementRowProps {
  /** Year award or recognition was conferred */
  year: string;
  /** Title of achievement */
  title: string;
  /** Conferring organization */
  conferredBy?: string | null;
  /** Associated branch unit or student team */
  unitOrTeam?: string | null;
  /** Category classification tag */
  category?: string | null;
  /** Cover photo URL */
  imageSrc?: string;
  /** Gallery of photos */
  images?: string[];
  /** Achievement Database ID for linking */
  id: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Chronological Ledger Row Component for Achievements.
 * Formatted as a ruled table entry with year marker column, title, and conferred entity.
 */
export const AchievementRow: React.FC<AchievementRowProps> = ({
  year,
  title,
  conferredBy,
  unitOrTeam,
  category,
  imageSrc,
  images = [],
  id,
  className = '',
}) => {
  return (
    <Link href={`/achievements/${id}`} className={`py-5 border-b border-warm-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:bg-warm-50/50 dark:hover:bg-gray-900/50 transition-colors px-2 -mx-2 rounded-lg ${className}`}>
      <div className="flex items-start gap-6">
        <span className="font-mono text-sm font-semibold text-ieee-blue dark:text-sky-400 w-16 shrink-0 pt-0.5">
          {year}
        </span>

        <div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {imageSrc && (
              <img src={imageSrc} alt={title} className="w-16 h-16 object-cover rounded-md border border-warm-200 dark:border-gray-700 shrink-0" />
            )}
            <div>
              <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal leading-snug group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                {title}
              </h4>
              <p className="text-xs text-warm-400 dark:text-gray-400 font-sans mt-0.5">
                {conferredBy}
              </p>
            </div>
          </div>
          
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <img key={idx} src={img} alt={`${title} gallery ${idx + 1}`} className="h-12 w-auto object-cover rounded-md border border-warm-200 dark:border-gray-700" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-warm-400 dark:text-gray-400 self-start md:self-center pl-22 md:pl-0">
        {unitOrTeam && <span>{unitOrTeam}</span>}
        {category && (
          <span className="bg-warm-100 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 px-2 py-0.5 rounded-md uppercase text-[10px] text-ink dark:text-gray-300">
            {category}
          </span>
        )}
        <span className="text-ieee-blue dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 hidden sm:inline-block">
          View Details →
        </span>
      </div>
    </Link>
  );
};
