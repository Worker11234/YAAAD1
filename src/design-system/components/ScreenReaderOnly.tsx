import React from 'react';

interface ScreenReaderOnlyProps {
  /**
   * Content that should only be visible to screen readers
   */
  children: React.ReactNode;
  
  /**
   * Whether the content should be focusable
   */
  focusable?: boolean;
}

export function ScreenReaderOnly({
  children,
  focusable = false,
  ...props
}: ScreenReaderOnlyProps) {
  return (
    <span
      className={`
        absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0
        ${!focusable ? 'clip-path-inset-50' : ''}
      `}
      {...props}
    >
      {children}
    </span>
  );
}