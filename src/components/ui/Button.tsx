import React from 'react';
import Link from 'next/link';

/**
 * Props for the Button UI component.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant: primary (IEEE Blue), secondary (outline), accent (MAIT Warm), ghost (text-only) */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  /** Button scale size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional link target URL */
  href?: string;
  /** Whether link opens in a new tab */
  external?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Structured Button & Link CTA Component.
 * Implements 2px border radius, sharp focus rings, and explicit IEEE brand variants.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  external,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-150 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-ieee-blue focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-ieee-blue text-white hover:bg-ieee-dark border border-ieee-blue',
    secondary: 'bg-transparent text-ink border border-warm-200 hover:bg-warm-100 hover:border-warm-300',
    accent: 'bg-mait-warm text-white hover:bg-red-900 border border-mait-warm',
    ghost: 'bg-transparent text-ieee-blue hover:bg-ieee-subtle border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
