import React from 'react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  gap?: number;
}

export function ResponsiveGrid({ 
  children, 
  className = '', 
  minItemWidth = 280,
  gap = 24 
}: ResponsiveGridProps) {
  const { isMobile, isTablet } = useDeviceDetection();

  const getGridClasses = () => {
    if (isMobile) {
      return 'grid-cols-1';
    } else if (isTablet) {
      return 'grid-cols-2';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  const getGapClass = () => {
    if (isMobile) {
      return 'gap-4';
    } else if (isTablet) {
      return 'gap-6';
    } else {
      return 'gap-8';
    }
  };

  return (
    <div 
      className={`
        grid ${getGridClasses()} ${getGapClass()}
        ${className}
      `}
      style={{
        gridTemplateColumns: isMobile ? '1fr' : `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`
      }}
    >
      {children}
    </div>
  );
}