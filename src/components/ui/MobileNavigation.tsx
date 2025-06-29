import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Plus, Users, Search, Settings, Gamepad2, Heart } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from './TouchOptimized';
import { Dock } from './dock-two';
import { useNavigate } from 'react-router-dom';

export function MobileNavigation() {
  const { isMobile } = useDeviceDetection();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isMobile) return null;

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      onClick: () => navigate('/dashboard')
    },
    { 
      icon: Calendar, 
      label: 'Timeline', 
      onClick: () => navigate('/timeline')
    },
    { 
      icon: Plus, 
      label: 'Upload', 
      onClick: () => navigate('/upload')
    },
    { 
      icon: Users, 
      label: 'Family', 
      onClick: () => navigate('/family')
    },
    { 
      icon: Gamepad2, 
      label: 'Games', 
      onClick: () => navigate('/games')
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      onClick: () => navigate('/settings')
    },
  ];

  return (
    <Dock items={navItems} className="safe-area-inset-bottom" />
  );
}