import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Plus, Users, Settings } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from './TouchOptimized';
import { Dock } from './dock-two';

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

  const dockItems = navItems.map(item => ({
    icon: item.icon,
    label: item.name,
    onClick: () => window.location.href = item.href,
    className: item.isSpecial ? 'bg-sage-700 text-white p-3 rounded-full shadow-lg' : ''
  }));

  return (
    <Dock items={dockItems} className="safe-area-inset-bottom shadow-lg" />
  );
}