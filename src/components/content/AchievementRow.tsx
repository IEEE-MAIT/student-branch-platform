import React from 'react';

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
  className = '',
}) => {
  return (
    <div className={`py-5 border-b border-warm-200 flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}>
      <div className="flex items-start gap-6">
        <span className="font-mono text-sm font-semibold text-ieee-blue w-16 flex-shrink-0 pt-0.5">
          {year}
        </span>

        <div>
          <h4 className="font-serif text-lg text-ink font-normal leading-snug">
            {title}
          </h4>
          <p className="text-xs text-warm-400 font-sans mt-0.5">
            {conferredBy}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-warm-400 self-start md:self-center pl-22 md:pl-0">
        {unitOrTeam && <span>{unitOrTeam}</span>}
        {category && (
          <span className="bg-warm-100 border border-warm-200 px-2 py-0.5 rounded-[2px] uppercase text-[10px]">
            {category}
          </span>
        )}
      </div>
    </div>
  );
};
