import React from 'react';

/**
 * Props for the Badge component.
 */
interface BadgeProps {
  /** Badge text or icon content */
  children: React.ReactNode;
  /** Visual variant: ieee (IEEE Blue subtle), mait (MAIT Warm subtle), neutral (warm gray), outline */
  variant?: 'ieee' | 'mait' | 'neutral' | 'outline';
  /** Size scale */
  size?: 'sm' | 'md';
  /** Custom CSS classes */
  className?: string;
}

/**
 * Monospaced uppercase category badge indicator.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-mono uppercase tracking-wider rounded-[2px] border';

  const variantStyles = {
    ieee: 'bg-ieee-subtle text-ieee-blue border-ieee-blue/20',
    mait: 'bg-mait-subtle text-mait-warm border-mait-warm/20',
    neutral: 'bg-warm-100 text-ink-muted border-warm-200',
    outline: 'bg-transparent text-ink border-warm-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
