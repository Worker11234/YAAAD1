import React from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

type ActivityType = 'upload' | 'comment' | 'like' | 'join' | 'game' | 'view' | 'tag' | 'share';

interface ActivityFeedItemProps {
  /**
   * Activity type
   */
  type: ActivityType;
  
  /**
   * Actor who performed the activity
   */
  actor: {
    name: string;
    avatar?: string;
    relationship?: string;
  };
  
  /**
   * Activity content
   */
  content: string;
  
  /**
   * Activity timestamp
   */
  timestamp: string;
  
  /**
   * Related memory
   */
  memory?: {
    title: string;
    thumbnail?: string;
  };
  
  /**
   * Whether the activity is new/unread
   */
  isNew?: boolean;
  
  /**
   * Whether the activity is highlighted/pinned
   */
  isHighlighted?: boolean;
  
  /**
   * Function to call when the item is clicked
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ActivityFeedItem({
  type,
  actor,
  content,
  timestamp,
  memory,
  isNew = false,
  isHighlighted = false,
  onClick,
  className = '',
  ...props
}: ActivityFeedItemProps) {
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get activity icon
  const getActivityIcon = () => {
    switch (type) {
      case 'upload':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        );
      case 'comment':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'like':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'join':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'game':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        );
      case 'view':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'share':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        );
    }
  };
  
  // Get activity icon color
  const getActivityIconColor = () => {
    switch (type) {
      case 'upload':
        return 'bg-blue-100 text-blue-600';
      case 'comment':
        return 'bg-green-100 text-green-600';
      case 'like':
        return 'bg-red-100 text-red-600';
      case 'join':
        return 'bg-purple-100 text-purple-600';
      case 'game':
        return 'bg-orange-100 text-orange-600';
      case 'view':
        return 'bg-gray-100 text-gray-600';
      case 'tag':
        return 'bg-yellow-100 text-yellow-600';
      case 'share':
        return 'bg-indigo-100 text-indigo-600';
    }
  };
  
  return (
    <div
      className={`
        p-4 hover:bg-gray-50 transition-colors
        ${isNew ? 'bg-sage-50' : ''}
        ${isHighlighted ? 'border-l-4 border-l-sage-500' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {/* Actor Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {actor.avatar ? (
                <img 
                  src={actor.avatar} 
                  alt={actor.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getActivityIconColor()}`}>
              {getActivityIcon()}
            </div>
          </div>
        </div>
        
        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{actor.name}</span>
                {actor.relationship && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({actor.relationship})
                  </span>
                )}
                {' '}{content}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTimestamp(timestamp)}
              </p>
            </div>
            
            {isHighlighted && (
              <div className="flex-shrink-0 ml-2">
                <svg className="w-4 h-4 text-yellow-500 fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Memory Preview */}
          {memory && (
            <div className="mt-2 flex items-center space-x-3 bg-gray-50 p-2 rounded-lg">
              {memory.thumbnail ? (
                <img 
                  src={memory.thumbnail} 
                  alt={memory.title}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {memory.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}