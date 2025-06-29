import React, { forwardRef } from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Select options
   */
  options: SelectOption[];
  
  /**
   * Select label
   */
  label?: string;
  
  /**
   * Helper text to display below the select
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
   * Select size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  label,
  helperText,
  error,
  leftIcon,
  size = 'md',
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine border color based on error state
  const borderClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-sage-500 focus:ring-sage-500';
  
  // Padding classes based on icon
  const paddingClasses = leftIcon ? 'pl-10' : '';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg',
  };
  
  // Disabled state
  const disabledClasses = disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : '';
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 ${sizeClasses[size]}
            ${paddingClasses}
            ${borderClasses}
            ${disabledClasses}
            border rounded-lg
            focus:outline-none focus:ring-2
            transition-colors duration-200
            text-gray-900
            appearance-none
            bg-white
          `}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';