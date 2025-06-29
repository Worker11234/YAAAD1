import React from 'react';
import { Users, Heart, Shield, Calendar, Settings, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';

interface FamilyCardProps {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  privacyLevel: string;
  isAdmin: boolean;
  onDelete?: (id: string) => void;
  onSettings?: (id: string) => void;
  className?: string;
}

export function FamilyCard({
  id,
  name,
  description,
  memberCount,
  createdAt,
  privacyLevel,
  isAdmin,
  onDelete,
  onSettings,
  className = ''
}: FamilyCardProps) {
  const getPrivacyLabel = () => {
    switch (privacyLevel) {
      case 'private': return 'Private';
      case 'family-only': return 'Family Only';
      case 'extended': return 'Extended Family';
      default: return 'Family Only';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-sage-700" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users size={14} className="inline" />
                <span>{memberCount} members</span>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex items-center space-x-1">
              {onSettings && (
                <TouchOptimized>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onSettings(id);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Family settings"
                  >
                    <Settings size={18} />
                  </button>
                </TouchOptimized>
              )}
              
              {onDelete && (
                <TouchOptimized>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDelete(id);
                    }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete family"
                  >
                    <Trash2 size={18} />
                  </button>
                </TouchOptimized>
              )}
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-sage-50 px-3 py-1 rounded-lg flex items-center space-x-1 text-sm">
            <Shield size={14} className="text-sage-600" />
            <span className="text-gray-700">{getPrivacyLabel()}</span>
          </div>
          
          <div className="bg-gray-50 px-3 py-1 rounded-lg flex items-center space-x-1 text-sm">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-700">Created {formatDate(createdAt)}</span>
          </div>
          
          {isAdmin && (
            <div className="bg-purple-50 px-3 py-1 rounded-lg text-sm text-purple-700">
              Admin
            </div>
          )}
        </div>
        
        <Link
          to={`/family/${id}`}
          className="inline-flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium"
        >
          <span>View Family</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}