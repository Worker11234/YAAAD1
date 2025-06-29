import React from 'react';
import { spacing } from '../tokens';

interface ContainerProps {
  /**
   * Container content
   */
  children: React.ReactNode;
  
  /**
   * Container size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Container padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Whether the container is centered
   */
  centered?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  padding = 'md',
  centered = true,
  className = '',
  ...props
}: ContainerProps) {
  // Size classes
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'px-0',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };
  
  return (
    <div
      className={`
        w-full
        ${sizeClasses[size]}
        ${paddingClasses[padding]}
        ${centered ? 'mx-auto' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}