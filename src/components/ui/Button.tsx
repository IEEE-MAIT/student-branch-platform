import React from 'react';
import Link from './AppLink';

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
 * Structured Button & Link CTA Component with Light and Dark Theme Compatibility.
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
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue focus-visible:ring-offset-2';

  const variantStyles = {
    primary: 'bg-ieee-blue hover:bg-ieee-dark dark:bg-[#007CBD] dark:hover:bg-[#00629B] text-white font-semibold border border-transparent shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-transparent text-ink dark:text-gray-200 border border-warm-200 dark:border-gray-800 hover:bg-warm-100 dark:hover:bg-gray-800 hover:border-warm-300 dark:hover:border-gray-700',
    accent: 'bg-mait-warm hover:bg-red-900 dark:bg-rose-700 dark:hover:bg-rose-800 text-white font-semibold border border-transparent shadow-sm active:scale-[0.98]',
    ghost: 'bg-transparent text-ieee-blue dark:text-sky-400 hover:bg-ieee-subtle dark:hover:bg-gray-800 border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-2.5 gap-2.5 h-12',
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
