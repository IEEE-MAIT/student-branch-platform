import React from 'react';

interface StatMetricProps {
  label: string;
  value: string;
  subtext?: string;
  className?: string;
}

export const StatMetric: React.FC<StatMetricProps> = ({
  label,
  value,
  subtext,
  className = '',
}) => {
  return (
    <div className={`flex flex-col py-4 px-6 border-r border-warm-200 last:border-r-0 ${className}`}>
      <span className="font-mono text-3xl sm:text-4xl font-normal text-ieee-blue tracking-tight mb-1">
        {value}
      </span>
      <span className="text-xs uppercase font-mono tracking-wider text-ink font-semibold">
        {label}
      </span>
      {subtext && (
        <span className="text-[11px] text-warm-400 mt-0.5">
          {subtext}
        </span>
      )}
    </div>
  );
};
