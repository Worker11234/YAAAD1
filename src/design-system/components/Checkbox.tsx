import React, { forwardRef } from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Checkbox label
   */
  label: string;
  
  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={checkboxId} className="font-medium text-gray-700">
          {label}
        </label>
        {helperText && (
          <p className="text-gray-500">{helperText}</p>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';