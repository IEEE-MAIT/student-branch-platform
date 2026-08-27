import React from 'react';

/**
 * Props for the Badge component.
 */
interface BadgeProps {
  /** Badge text or icon content */
  children: React.ReactNode;
  /** Visual variant: ieee, mait, wie, eds, sig, neutral / default, outline */
  variant?: 'ieee' | 'mait' | 'wie' | 'eds' | 'sig' | 'neutral' | 'outline' | 'default';
  /** Size scale */
  size?: 'sm' | 'md';
  /** Custom CSS classes */
  className?: string;
}

/**
 * Monospaced uppercase category badge indicator with full Light/Dark mode support.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-mono uppercase tracking-wider rounded-[2px] border transition-colors duration-150';

  const selectedVariant = variant === 'default' ? 'neutral' : variant;

  const variantStyles = {
    ieee: 'bg-ieee-subtle text-ieee-blue border-ieee-blue/20',
    mait: 'bg-mait-subtle text-mait-warm border-mait-warm/20',
    wie: 'bg-wie-subtle text-wie-purple border-wie-purple/20',
    eds: 'bg-eds-subtle text-eds-blue border-eds-blue/20',
    sig: 'bg-amber-50 dark:bg-amber-950/40 text-sig-amber border-sig-amber/20',
    neutral: 'bg-warm-100 text-ink-muted border-warm-200',
    outline: 'bg-transparent text-ink border-warm-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[selectedVariant] || variantStyles.neutral} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
