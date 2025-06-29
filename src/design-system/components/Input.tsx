import React, { forwardRef } from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the input is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine border color based on error state
  const borderClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-sage-500 focus:ring-sage-500';
  
  // Padding classes based on icons
  const paddingClasses = leftIcon && rightIcon
    ? 'pl-10 pr-10'
    : leftIcon
    ? 'pl-10'
    : rightIcon
    ? 'pr-10'
    : '';
  
  // Disabled state
  const disabledClasses = disabled || isLoading
    ? 'bg-gray-100 cursor-not-allowed'
    : '';
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 
            ${paddingClasses}
            ${borderClasses}
            ${disabledClasses}
            border rounded-lg
            focus:outline-none focus:ring-2
            transition-colors duration-200
            text-gray-900 placeholder-gray-500
          `}
          disabled={disabled || isLoading}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';