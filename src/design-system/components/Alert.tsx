import React from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  /**
   * Alert content
   */
  children: React.ReactNode;
  
  /**
   * Alert variant
   */
  variant?: AlertVariant;
  
  /**
   * Alert title
   */
  title?: string;
  
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the alert is dismissible
   */
  dismissible?: boolean;
  
  /**
   * Function to call when the alert is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Alert({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}: AlertProps) {
  // Variant classes
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  
  // Icon color classes
  const iconColorClasses = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };
  
  return (
    <div
      className={`
        ${variantClasses[variant]}
        p-4 rounded-lg border
        ${className}
      `}
      role="alert"
      {...props}
    >
      <div className="flex">
        {icon && (
          <div className={`flex-shrink-0 ${iconColorClasses[variant]}`}>
            {icon}
          </div>
        )}
        
        <div className={`${icon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`
                  inline-flex rounded-md p-1.5
                  ${iconColorClasses[variant]} hover:bg-opacity-20 hover:bg-gray-500
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant === 'info' ? 'blue' : variant === 'success' ? 'green' : variant === 'warning' ? 'yellow' : 'red'}-500
                `}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}