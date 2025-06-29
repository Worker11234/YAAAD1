import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function BreadcrumbNavigation() {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard' }
    ];

    // Map path segments to readable labels
    const pathLabels: Record<string, string> = {
      dashboard: 'Dashboard',
      timeline: 'Memory Timeline',
      upload: 'Upload Memory',
      family: 'Family Members',
      games: 'Memory Games',
      search: 'Search Memories',
      settings: 'Settings',
      profile: 'My Profile',
      notifications: 'Notifications',
      memory: 'Memory Details',
      edit: 'Edit',
      invite: 'Invite Members'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm lg:text-base mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="text-gray-400 mx-2" />
            )}
            
            {crumb.href ? (
              <Link
                to={crumb.href}
                className="flex items-center space-x-1 text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                {index === 0 && <Home size={16} />}
                <span>{crumb.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-gray-900 font-semibold">
                {index === 0 && <Home size={16} />}
                <span>{crumb.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}