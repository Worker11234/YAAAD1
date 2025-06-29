import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../tokens';

interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Card variant
   */
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  
  /**
   * Whether the card is interactive (clickable)
   */
  isInteractive?: boolean;
  
  /**
   * Optional header content
   */
  header?: React.ReactNode;
  
  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Optional onClick handler
   */
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  isInteractive = false,
  header,
  footer,
  className = '',
  onClick,
  ...props
}: CardProps) {
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-sage-200',
    interactive: 'bg-white border border-gray-200 hover:border-sage-300 hover:shadow-md',
  };
  
  // Interactive props
  const interactiveProps = isInteractive || onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick && onClick();
          }
        },
      }
    : {};
  
  // Interactive classes
  const interactiveClasses = isInteractive || onClick
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-opacity-50'
    : '';
  
  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${interactiveClasses}
        rounded-xl overflow-hidden
        ${className}
      `}
      {...interactiveProps}
      {...props}
    >
      {header && (
        <div className="border-b border-gray-200 p-4">
          {header}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 p-4">
          {footer}
        </div>
      )}
    </div>
  );
}