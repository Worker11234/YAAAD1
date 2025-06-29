import React from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../tokens';

interface MemoryCardProps {
  /**
   * Memory title
   */
  title: string;
  
  /**
   * Memory description
   */
  description?: string;
  
  /**
   * Memory type (photo, video, audio, story)
   */
  type: 'photo' | 'video' | 'audio' | 'story';
  
  /**
   * Memory thumbnail URL
   */
  thumbnail?: string;
  
  /**
   * Memory date
   */
  date: string;
  
  /**
   * Memory author
   */
  author: {
    name: string;
    avatar?: string;
    relationship?: string;
  };
  
  /**
   * Memory tags
   */
  tags?: string[];
  
  /**
   * Memory interactions
   */
  interactions?: {
    likes: number;
    comments: number;
    views: number;
  };
  
  /**
   * Whether the memory is liked by the current user
   */
  isLiked?: boolean;
  
  /**
   * Whether the memory is favorited by the current user
   */
  isFavorited?: boolean;
  
  /**
   * Function to call when the memory is clicked
   */
  onClick?: () => void;
  
  /**
   * Function to call when the like button is clicked
   */
  onLike?: () => void;
  
  /**
   * Function to call when the comment button is clicked
   */
  onComment?: () => void;
  
  /**
   * Function to call when the share button is clicked
   */
  onShare?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function MemoryCard({
  title,
  description,
  type,
  thumbnail,
  date,
  author,
  tags = [],
  interactions = { likes: 0, comments: 0, views: 0 },
  isLiked = false,
  isFavorited = false,
  onClick,
  onLike,
  onComment,
  onShare,
  className = '',
  ...props
}: MemoryCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get type icon and color
  const getTypeIcon = () => {
    switch (type) {
      case 'photo':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'story':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'photo':
        return 'bg-blue-100 text-blue-700';
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'audio':
        return 'bg-green-100 text-green-700';
      case 'story':
        return 'bg-orange-100 text-orange-700';
    }
  };
  
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden border border-gray-200
        hover:shadow-lg transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Media Section */}
      <div className="relative">
        {thumbnail ? (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400">
              {getTypeIcon()}
            </div>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
            {type}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{title}</h3>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-sage-100 text-sage-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span>{formatDate(date)}</span>
            <span>•</span>
            <span>{author.name}</span>
          </div>
          
          {/* Interactions */}
          {interactions && (
            <div className="flex items-center space-x-3">
              {/* Like Button */}
              {onLike && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike();
                  }}
                  className={`flex items-center space-x-1 ${isLiked ? 'text-red-600' : 'hover:text-red-600'}`}
                >
                  <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{interactions.likes}</span>
                </button>
              )}
              
              {/* Comment Button */}
              {onComment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComment();
                  }}
                  className="flex items-center space-x-1 hover:text-sage-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{interactions.comments}</span>
                </button>
              )}
              
              {/* Share Button */}
              {onShare && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                  className="hover:text-sage-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}