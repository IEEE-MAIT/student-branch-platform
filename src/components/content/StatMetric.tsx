import React from 'react';

/**
 * Props for StatMetric component.
 */
interface StatMetricProps {
  /** Metric label (e.g. 'Active Members', 'Years Active') */
  label: string;
  /** Monospaced statistical value (e.g. '150+', 'Since 2005') */
  value: string;
  /** Explanatory subtext */
  subtext?: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Monospaced Statistical Metric Counter Component.
 * Used inside horizontal ruled bars for at-a-glance branch statistics.
 */
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
        <span className="text-[11px] text-warm-400 mt-0.5 font-sans">
          {subtext}
        </span>
      )}
    </div>
  );
};
