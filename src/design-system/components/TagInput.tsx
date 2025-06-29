import React, { useState, useRef, useEffect } from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface TagInputProps {
  /**
   * Current tags
   */
  tags: string[];
  
  /**
   * Function to call when tags change
   */
  onChange: (tags: string[]) => void;
  
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Input placeholder
   */
  placeholder?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  
  /**
   * Maximum number of tags allowed
   */
  maxTags?: number;
  
  /**
   * Suggested tags to display
   */
  suggestions?: string[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  label,
  placeholder = 'Add a tag...',
  helperText,
  error,
  disabled = false,
  maxTags,
  suggestions = [],
  className = '',
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Filter suggestions based on input value
  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
      !tags.includes(suggestion)
    )
    .slice(0, 5);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Add a tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    
    if (
      trimmedTag && 
      !tags.includes(trimmedTag) && 
      (!maxTags || tags.length < maxTags)
    ) {
      onChange([...tags, trimmedTag]);
    }
    
    setInputValue('');
    inputRef.current?.focus();
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };
  
  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };
  
  // Determine border color based on error state
  const borderClasses = error
    ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500'
    : 'border-gray-300 focus-within:border-sage-500 focus-within:ring-sage-500';
  
  // Disabled state
  const disabledClasses = disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : '';
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div
        className={`
          flex flex-wrap items-center gap-2 p-2
          border rounded-lg
          focus-within:ring-2 focus-within:ring-opacity-50
          transition-colors duration-200
          ${borderClasses}
          ${disabledClasses}
        `}
      >
        {/* Tags */}
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-sage-100 text-sage-700 px-2 py-1 rounded-full text-sm"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                className="ml-1 text-sage-500 hover:text-sage-700 focus:outline-none"
                onClick={() => removeTag(tag)}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        
        {/* Input */}
        {(!maxTags || tags.length < maxTags) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 placeholder-gray-500 text-sm"
            disabled={disabled}
            {...props}
          />
        )}
      </div>
      
      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg border border-gray-200 z-10"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-sage-50 cursor-pointer"
              onClick={() => {
                addTag(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {/* Helper Text or Error */}
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
      
      {/* Max Tags Indicator */}
      {maxTags && (
        <p className="mt-1 text-xs text-gray-500">
          {tags.length} / {maxTags} tags
        </p>
      )}
    </div>
  );
}