import React from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  /**
   * Badge content
   */
  children: React.ReactNode;
  
  /**
   * Badge variant
   */
  variant?: BadgeVariant;
  
  /**
   * Badge size
   */
  size?: BadgeSize;
  
  /**
   * Whether the badge is rounded (pill shape)
   */
  rounded?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}: BadgeProps) {
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-sage-100 text-sage-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses}
        inline-flex items-center font-medium
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}