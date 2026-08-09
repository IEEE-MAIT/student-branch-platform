import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

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
