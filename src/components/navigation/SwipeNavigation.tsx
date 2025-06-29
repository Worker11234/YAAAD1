import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SwipeGestures } from '../ui/SwipeGestures';

interface SwipeNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function SwipeNavigation({ children, className = '' }: SwipeNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation order for swipe gestures
  const navigationOrder = [
    '/dashboard',
    '/timeline',
    '/upload',
    '/family',
    '/games',
    '/search'
  ];

  const handleSwipeLeft = () => {
    const currentIndex = navigationOrder.indexOf(location.pathname);
    if (currentIndex !== -1 && currentIndex < navigationOrder.length - 1) {
      navigate(navigationOrder[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = navigationOrder.indexOf(location.pathname);
    if (currentIndex > 0) {
      navigate(navigationOrder[currentIndex - 1]);
    }
  };

  return (
    <SwipeGestures
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      className={className}
      threshold={100} // Require more deliberate swipe for navigation
    >
      {children}
    </SwipeGestures>
  );
}