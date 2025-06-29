import React from 'react';
import { 
  Image, Video, FileText, Volume2, MapPin, 
  Calendar, User, Eye, Heart, MessageCircle, 
  ArrowRight, Download, Share2, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  thumbnail?: string;
  date: string;
  location?: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  relevanceScore?: number;
  highlights?: {
    field: string;
    text: string;
  }[];
  interactions?: {
    views: number;
    likes: number;
    comments: number;
  };
}

interface SearchResultsProps {
  results: SearchResult[];
  viewMode: 'grid' | 'list';
  onResultClick?: (result: SearchResult) => void;
  onSaveResult?: (result: SearchResult) => void;
  onShareResult?: (result: SearchResult) => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchResults({
  results,
  viewMode,
  onResultClick,
  onSaveResult,
  onShareResult,
  isLoading = false,
  className = ''
}: SearchResultsProps) {
  const { isMobile } = useDeviceDetection();
  
  const getMediaTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'photo': return Image;
      case 'video': return Video;
      case 'audio': return Volume2;
      case 'story': return FileText;
    }
  };
  
  const getMediaTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'photo': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'story': return 'bg-orange-100 text-orange-700';
    }
  };
  
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
        }>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
              {viewMode === 'grid' ? (
                <>
                  <div className="w-full aspect-video bg-gray-200" />
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </>
              ) : (
                <div className="flex">
                  <div className="w-32 sm:w-48 h-24 sm:h-32 bg-gray-200" />
                  <div className="flex-1 p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-8 text-center ${className}`}>
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-4"
      }>
        {results.map((result) => {
          const MediaTypeIcon = getMediaTypeIcon(result.type);
          
          return viewMode === 'grid' ? (
            // Grid View
            <TouchOptimized key={result.id}>
              <div 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                onClick={() => onResultClick && onResultClick(result)}
              >
                <div className="relative">
                  {result.thumbnail ? (
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                      <MediaTypeIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMediaTypeColor(result.type)}`}>
                      {result.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{result.title}</h3>
                  
                  {result.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {result.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {result.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{result.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(result.date).toLocaleDateString()}</span>
                    <span>{result.author.name}</span>
                  </div>
                  
                  {/* Interactions */}
                  {result.interactions && (
                    <div className="flex items-center space-x-3 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{result.interactions.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart size={12} />
                        <span>{result.interactions.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={12} />
                        <span>{result.interactions.comments}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TouchOptimized>
          ) : (
            // List View
            <TouchOptimized key={result.id}>
              <div 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                onClick={() => onResultClick && onResultClick(result)}
              >
                <div className="flex">
                  <div className="w-32 sm:w-48 flex-shrink-0">
                    {result.thumbnail ? (
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <MediaTypeIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{result.title}</h3>
                        
                        {result.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                        )}
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMediaTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.tags.slice(0, 5).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {result.tags.length > 5 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{result.tags.length - 5}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                        </div>
                        
                        {result.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={12} />
                            <span>{result.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <User size={12} />
                        <span>{result.author.name}</span>
                      </div>
                    </div>
                    
                    {/* Interactions */}
                    {result.interactions && (
                      <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{result.interactions.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart size={12} />
                          <span>{result.interactions.likes} likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={12} />
                          <span>{result.interactions.comments} comments</span>
                        </div>
                        
                        <div className="ml-auto flex space-x-2">
                          {onSaveResult && (
                            <TouchOptimized>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSaveResult(result);
                                }}
                                className="p-1 text-gray-500 hover:text-sage-600 rounded transition-colors"
                              >
                                <Star size={14} />
                              </button>
                            </TouchOptimized>
                          )}
                          
                          {onShareResult && (
                            <TouchOptimized>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShareResult(result);
                                }}
                                className="p-1 text-gray-500 hover:text-sage-600 rounded transition-colors"
                              >
                                <Share2 size={14} />
                              </button>
                            </TouchOptimized>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TouchOptimized>
          );
        })}
      </div>
    </div>
  );
}