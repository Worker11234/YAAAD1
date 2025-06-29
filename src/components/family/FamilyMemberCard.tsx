import React from 'react';
import { User, Crown, Trash2, MessageCircle } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface FamilyMemberCardProps {
  id: string;
  name: string;
  relationship?: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  isCurrentUser: boolean;
  onPromote?: () => void;
  onRemove?: () => void;
  onMessage?: () => void;
  className?: string;
}

export function FamilyMemberCard({
  id,
  name,
  relationship,
  avatarUrl,
  role,
  joinedAt,
  isCurrentUser,
  onPromote,
  onRemove,
  onMessage,
  className = ''
}: FamilyMemberCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-sage-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                {role === 'admin' && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <Crown size={12} className="mr-1" />
                    Admin
                  </span>
                )}
                {isCurrentUser && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm text-gray-600">
                {relationship && (
                  <span>{relationship}</span>
                )}
                <span className="hidden sm:inline">•</span>
                <span>Joined {formatDate(joinedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {onMessage && (
              <TouchOptimized>
                <button
                  onClick={onMessage}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Message member"
                >
                  <MessageCircle size={18} />
                </button>
              </TouchOptimized>
            )}
            
            {onPromote && role !== 'admin' && (
              <TouchOptimized>
                <button
                  onClick={onPromote}
                  className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  aria-label="Promote to admin"
                >
                  <Crown size={18} />
                </button>
              </TouchOptimized>
            )}
            
            {onRemove && (
              <TouchOptimized>
                <button
                  onClick={onRemove}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={isCurrentUser ? "Leave family" : "Remove member"}
                >
                  <Trash2 size={18} />
                </button>
              </TouchOptimized>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}