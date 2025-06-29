import React, { forwardRef } from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Radio label
   */
  label: string;
  
  /**
   * Helper text to display below the radio
   */
  helperText?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className="w-4 h-4 text-sage-600 border-gray-300 focus:ring-sage-500"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={radioId} className="font-medium text-gray-700">
          {label}
        </label>
        {helperText && (
          <p className="text-gray-500">{helperText}</p>
        )}
      </div>
    </div>
  );
});

Radio.displayName = 'Radio';