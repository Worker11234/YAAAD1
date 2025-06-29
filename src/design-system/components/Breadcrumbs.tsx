import React from 'react';
import { colors, typography, spacing } from '../tokens';

interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Separator between breadcrumb items
   */
  separator?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Breadcrumbs({
  items,
  separator = '/',
  className = '',
  ...props
}: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb" {...props}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">{separator}</span>
            )}
            
            {item.href && !item.isCurrent ? (
              <a
                href={item.href}
                className={`
                  flex items-center text-sm font-medium
                  ${item.isCurrent ? 'text-gray-700' : 'text-sage-600 hover:text-sage-700'}
                `}
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <span
                className={`
                  flex items-center text-sm font-medium
                  ${item.isCurrent ? 'text-gray-700' : 'text-gray-500'}
                `}
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}