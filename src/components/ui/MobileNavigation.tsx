import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Plus, Users, Search, Settings } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from './TouchOptimized';

export function MobileNavigation() {
  const { isMobile } = useDeviceDetection();
  const location = useLocation();

  if (!isMobile) return null;

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Timeline', href: '/timeline', icon: Calendar },
    { name: 'Upload', href: '/upload', icon: Plus, isSpecial: true },
    { name: 'Family', href: '/family', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sage-100 z-50 safe-area-inset-bottom shadow-lg"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          if (item.isSpecial) {
            return (
              <TouchOptimized key={item.name}>
                <Link
                  to={item.href}
                  className="flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-lg"
                  aria-label={`${item.name} - Upload new memory`}
                >
                  <div className="bg-sage-700 p-3 rounded-full shadow-lg hover:bg-sage-800 transition-colors mb-1">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-sage-700 truncate">
                    {item.name}
                  </span>
                </Link>
              </TouchOptimized>
            );
          }
          
          return (
            <TouchOptimized key={item.name}>
              <Link
                to={item.href}
                className={`
                  flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative
                  ${isActive 
                    ? 'text-sage-700' 
                    : 'text-gray-500 hover:text-sage-600'
                  }
                  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-lg
                `}
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={22} className="mb-1" />
                <span className="text-xs font-medium truncate">{item.name}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sage-700 rounded-full"></div>
                )}
              </Link>
            </TouchOptimized>
          );
        })}
      </div>
    </nav>
  );
}