import React from 'react';

/**
 * Props for the Container layout component.
 */
interface ContainerProps {
  /** Page or section content */
  children: React.ReactNode;
  /** Optional custom CSS classes */
  className?: string;
  /** Width constraint variant: default (1200px), narrow (720px), wide (1400px), full (100%) */
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

/**
 * Responsive layout container wrapper.
 * Enforces maximum width boundaries and gutter margins across desktop, tablet, and mobile.
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'default',
}) => {
  const sizeClasses = {
    narrow: 'max-w-[720px]',
    default: 'max-w-[1200px]',
    wide: 'max-w-[1400px]',
    full: 'w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
