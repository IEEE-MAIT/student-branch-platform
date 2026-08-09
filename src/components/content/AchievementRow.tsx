import React from 'react';

interface AchievementRowProps {
  year: string;
  title: string;
  conferredBy: string;
  unitOrTeam?: string;
  category?: string;
  className?: string;
}

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
