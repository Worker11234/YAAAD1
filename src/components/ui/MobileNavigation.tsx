import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Search, Settings } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from './TouchOptimized';
import { Dock } from './dock-two';

export function MobileNavigation() {
  const { isMobile } = useDeviceDetection();
  const location = useLocation();

  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Calendar, label: 'Timeline', href: '/timeline' },
    { icon: Users, label: 'Family', href: '/family' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const dockItems = navItems.map(item => ({
    icon: item.icon,
    label: item.label,
    onClick: () => {},
  }));

  return (
    <Dock 
      items={dockItems.map((item, index) => ({
        ...item,
        onClick: () => {
          window.location.href = navItems[index].href;
        }
      }))}
      className="safe-area-inset-bottom"
    />
  );
}