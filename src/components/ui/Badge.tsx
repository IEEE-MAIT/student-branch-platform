import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ieee' | 'mait' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

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
