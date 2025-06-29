import React from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../tokens';

interface FamilyMemberCardProps {
  /**
   * Family member name
   */
  name: string;
  
  /**
   * Family member relationship
   */
  relationship?: string;
  
  /**
   * Family member avatar URL
   */
  avatar?: string;
  
  /**
   * Family member role
   */
  role?: 'admin' | 'member' | 'guest';
  
  /**
   * Whether the family member is the current user
   */
  isCurrentUser?: boolean;
  
  /**
   * Function to call when the card is clicked
   */
  onClick?: () => void;
  
  /**
   * Actions to display
   */
  actions?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function FamilyMemberCard({
  name,
  relationship,
  avatar,
  role = 'member',
  isCurrentUser = false,
  onClick,
  actions,
  className = '',
  ...props
}: FamilyMemberCardProps) {
  // Role badge classes
  const roleBadgeClasses = {
    admin: 'bg-purple-100 text-purple-800',
    member: 'bg-blue-100 text-blue-800',
    guest: 'bg-gray-100 text-gray-800',
  };
  
  // Default avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200
        hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                <span className="text-sage-700 font-medium text-lg">{getInitials(name)}</span>
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
              {isCurrentUser && (
                <span className="ml-2 px-2 py-0.5 bg-sage-100 text-sage-700 rounded-full text-xs">
                  You
                </span>
              )}
            </div>
            
            <div className="flex items-center mt-1">
              {relationship && (
                <p className="text-sm text-gray-500 truncate">{relationship}</p>
              )}
              
              {role && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${roleBadgeClasses[role]}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="flex-shrink-0 ml-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}