import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../tokens';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface ToastProps {
  /**
   * Toast content
   */
  children: React.ReactNode;
  
  /**
   * Toast variant
   */
  variant?: ToastVariant;
  
  /**
   * Toast title
   */
  title?: string;
  
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the toast is visible
   */
  isVisible?: boolean;
  
  /**
   * Function to call when the toast is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Toast position
   */
  position?: ToastPosition;
  
  /**
   * Duration in milliseconds before the toast auto-dismisses (0 for no auto-dismiss)
   */
  duration?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Toast({
  children,
  variant = 'info',
  title,
  icon,
  isVisible = true,
  onDismiss,
  position = 'bottom-right',
  duration = 5000,
  className = '',
  ...props
}: ToastProps) {
  const [isShowing, setIsShowing] = useState(isVisible);
  
  // Auto-dismiss
  useEffect(() => {
    setIsShowing(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (onDismiss) {
          setTimeout(onDismiss, 300); // Wait for exit animation
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);
  
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
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };
  
  if (!isShowing) return null;
  
  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        max-w-sm w-full
        ${variantClasses[variant]}
        p-4 rounded-lg border shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isShowing ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        ${className}
      `}
      role="alert"
      aria-live="assertive"
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
        
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`
                  inline-flex rounded-md p-1.5
                  ${iconColorClasses[variant]} hover:bg-opacity-20 hover:bg-gray-500
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant === 'info' ? 'blue' : variant === 'success' ? 'green' : variant === 'warning' ? 'yellow' : 'red'}-500
                `}
                onClick={() => {
                  setIsShowing(false);
                  setTimeout(onDismiss, 300); // Wait for exit animation
                }}
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