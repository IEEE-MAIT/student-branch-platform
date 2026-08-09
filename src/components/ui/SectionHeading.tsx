import React from 'react';

/**
 * Props for the SectionHeading component.
 */
interface SectionHeadingProps {
  /** Main section title rendered in Instrument Serif */
  title: string;
  /** Subtitle or explanatory narrative text */
  subtitle?: string;
  /** Monospaced category prefix label */
  category?: string;
  /** Text alignment */
  align?: 'left' | 'center';
  /** Custom CSS classes */
  className?: string;
}

/**
 * Editorial Section Heading Component.
 * Pairs Instrument Serif display typography with uppercase monospaced category tags and an accent line.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  category,
  align = 'left',
  className = '',
}) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col mb-8 sm:mb-12 ${alignment} ${className}`}>
      {category && (
        <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest mb-2">
          {category}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight">
        {title}
      </h2>
      <div className="accent-rule my-3" />
      {subtitle && (
        <p className="text-base sm:text-lg text-warm-400 max-w-2xl mt-1 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};
