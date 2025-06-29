import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, Upload, Users, Gamepad2, Search, Settings, 
  User, Bell, Archive, ChevronDown, ChevronRight, Heart,
  Sparkles, Tag, Layers, MessageCircle, Shield
} from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { TouchOptimized } from '../ui/TouchOptimized';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description?: string;
  badge?: number;
  children?: NavItem[];
}

export function NavigationMenu({ isOpen, onClose, className = '' }: NavigationMenuProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview & quick actions'
    },
    {
      id: 'timeline',
      name: 'Memory Timeline',
      href: '/timeline',
      icon: Calendar,
      description: 'Browse memories by date'
    },
    {
      id: 'upload',
      name: 'Upload Memory',
      href: '/upload',
      icon: Upload,
      description: 'Add photos, videos & stories'
    },
    {
      id: 'tagging',
      name: 'AI Tagging',
      href: '/tagging',
      icon: Sparkles,
      description: 'Smart organization & tagging',
      badge: 5
    },
    {
      id: 'family',
      name: 'Family Members',
      href: '/family',
      icon: Users,
      description: 'Manage family access',
      children: [
        { id: 'view', name: 'View Members', href: '/family', icon: Users },
        { id: 'invite', name: 'Invite Members', href: '/family/invite', icon: Users },
        { id: 'roles', name: 'Member Roles', href: '/family/roles', icon: Users }
      ]
    },
    {
      id: 'games',
      name: 'Memory Games',
      href: '/games',
      icon: Gamepad2,
      description: 'Cognitive wellness activities'
    },
    {
      id: 'search',
      name: 'Search Memories',
      href: '/search',
      icon: Search,
      description: 'Find memories quickly'
    },
    {
      id: 'activity',
      name: 'Family Activity',
      href: '/activity',
      icon: Bell,
      description: 'View family updates',
      badge: 3
    },
    {
      id: 'messaging',
      name: 'Messaging',
      href: '/messaging',
      icon: MessageCircle,
      description: 'Chat with family members',
      badge: 2
    },
    {
      id: 'archive',
      name: 'Archive',
      href: '/archive',
      icon: Archive,
      description: 'Organized memory categories',
      children: [
        { id: 'year', name: 'By Year', href: '/archive/year', icon: Calendar },
        { id: 'person', name: 'By Person', href: '/archive/person', icon: User },
        { id: 'event', name: 'By Event', href: '/archive/event', icon: Heart }
      ]
    }
  ];

  const secondaryItems: NavItem[] = [
    {
      id: 'profile',
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Your account settings'
    },
    {
      id: 'privacy',
      name: 'Privacy & Data',
      href: '/privacy',
      icon: Shield,
      description: 'Control your privacy',
      badge: 1
    },
    {
      id: 'notifications',
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      description: 'Family activity updates',
      badge: 3
    },
    {
      id: 'settings',
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'App preferences & privacy'
    }
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (item: NavItem) => {
    if (isItemActive(item.href)) return true;
    return item.children?.some(child => isItemActive(child.href)) || false;
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = isParentActive(item);
    const isChildActive = level > 0 && isItemActive(item.href);

    return (
      <div key={item.name}>
        {hasChildren ? (
          <TouchOptimized>
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${level === 0 ? 'mb-1' : 'mb-0.5 ml-4'}
                ${isActive 
                  ? 'bg-sage-100 text-sage-800 shadow-sm border-2 border-sage-200' 
                  : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700 border-2 border-transparent'
                }
                focus:outline-none focus:ring-2 focus:ring-sage-500
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <item.icon 
                    size={level === 0 ? 20 : 18} 
                    className={isActive ? 'text-sage-700' : 'text-gray-500'} 
                  />
                  {item.badge && <NotificationBadge count={item.badge} />}
                </div>
                <div className="text-left">
                  <p className={`text-base font-semibold ${isActive ? 'text-sage-800' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  {item.description && level === 0 && (
                    <p className={`text-sm ${isActive ? 'text-sage-600' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
          </TouchOptimized>
        ) : (
          <TouchOptimized>
            <Link
              to={item.href}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${level === 0 ? 'mb-1' : 'mb-0.5 ml-4'}
                ${isChildActive || (level === 0 && isActive)
                  ? 'bg-sage-100 text-sage-800 shadow-sm border-2 border-sage-200' 
                  : 'text-gray-700 hover:bg-sage-50 hover:text-sage-700 border-2 border-transparent'
                }
                focus:outline-none focus:ring-2 focus:ring-sage-500
              `}
            >
              <div className="relative">
                <item.icon 
                  size={level === 0 ? 20 : 18} 
                  className={isChildActive || (level === 0 && isActive) ? 'text-sage-700' : 'text-gray-500'} 
                />
                {item.badge && <NotificationBadge count={item.badge} />}
              </div>
              <div className="flex-1">
                <p className={`text-base font-semibold ${
                  isChildActive || (level === 0 && isActive) ? 'text-sage-800' : 'text-gray-900'
                }`}>
                  {item.name}
                </p>
                {item.description && level === 0 && (
                  <p className={`text-sm ${
                    isChildActive || (level === 0 && isActive) ? 'text-sage-600' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          </TouchOptimized>
        )}

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`space-y-1 ${className} sidebar-nav`} role="navigation" aria-label="Main navigation">
      {/* Main Navigation */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
          Main Navigation
        </h3>
        {navigationItems.map(item => renderNavItem(item))}
      </div>

      {/* Secondary Navigation */}
      <div className="pt-6 mt-6 border-t border-sage-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
          Account
        </h3>
        <div className="space-y-1">
          {secondaryItems.map(item => renderNavItem(item))}
        </div>
      </div>
    </nav>
  );
}