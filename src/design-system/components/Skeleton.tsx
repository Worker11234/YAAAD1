import React from 'react';
import { colors, spacing, borderRadius } from '../tokens';

interface SkeletonProps {
  /**
   * Skeleton variant
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar' | 'button';
  
  /**
   * Skeleton width
   */
  width?: string | number;
  
  /**
   * Skeleton height
   */
  height?: string | number;
  
  /**
   * Whether the skeleton should animate
   */
  animate?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animate = true,
  className = '',
  ...props
}: SkeletonProps) {
  // Variant classes
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-xl h-32',
    avatar: 'rounded-full h-10 w-10',
    button: 'rounded-lg h-10',
  };
  
  // Animation classes
  const animationClasses = animate ? 'animate-pulse' : '';
  
  // Style for custom width and height
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={`
        bg-gray-200
        ${variantClasses[variant]}
        ${animationClasses}
        ${className}
      `}
      style={style}
      {...props}
    />
  );
}