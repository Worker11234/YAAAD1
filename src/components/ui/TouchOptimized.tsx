import React, { useState, useRef } from 'react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface TouchOptimizedProps {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

export function TouchOptimized({ 
  children, 
  className = '', 
  onTap, 
  onLongPress, 
  disabled = false 
}: TouchOptimizedProps) {
  const { isTouchDevice } = useDeviceDetection();
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handleTouchStart = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    if (onTap) {
      onTap();
    }
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const touchProps = isTouchDevice ? {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  } : {
    onClick: onTap,
  };

  return (
    <div
      className={`
        ${className}
        ${isTouchDevice ? 'touch-manipulation' : ''}
        ${isPressed ? 'scale-95 opacity-80' : ''}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        transition-all duration-150 ease-out
        select-none
      `}
      {...touchProps}
    >
      {children}
    </div>
  );
}