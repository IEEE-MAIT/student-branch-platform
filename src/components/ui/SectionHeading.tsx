import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  category?: string;
  align?: 'left' | 'center';
  className?: string;
}

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
        <p className="text-base sm:text-lg text-warm-400 max-w-2xl mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
