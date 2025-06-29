import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Edit3, Play, Volume2, Eye, 
  MoreHorizontal, Calendar, MapPin, User, Sparkles, ThumbsUp,
  Download, Flag, Copy, ExternalLink, Star, FileText
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Memory {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  date: string;
  location?: string;
  author: {
    name: string;
    avatar?: string;
    relationship?: string;
  };
  thumbnail?: string;
  fileUrl?: string;
  tags: string[];
  interactions: {
    likes: number;
    comments: number;
    views: number;
    isLiked: boolean;
    isFavorited?: boolean;
  };
  aiInsights?: {
    faces: string[];
    objects: string[];
    events: string[];
    connections: string[];
  };
  privacy: 'private' | 'family' | 'public';
}

interface MemoryCardProps {
  memory: Memory;
  onLike: (memoryId: string) => void;
  onComment: (memoryId: string) => void;
  onShare: (memoryId: string) => void;
  onEdit: (memoryId: string) => void;
  onView: (memoryId: string) => void;
  className?: string;
}

export function MemoryCard({ 
  memory, 
  onLike, 
  onComment, 
  onShare, 
  onEdit, 
  onView,
  className = '' 
}: MemoryCardProps) {
  const { isMobile } = useDeviceDetection();
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getTypeIcon = () => {
    switch (memory.type) {
      case 'video': return Play;
      case 'audio': return Volume2;
      case 'story': return FileText;
      default: return null;
    }
  };

  const getTypeColor = () => {
    switch (memory.type) {
      case 'photo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'audio': return 'bg-green-100 text-green-700 border-green-200';
      case 'story': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const TypeIcon = getTypeIcon();

  const menuItems = [
    { icon: Eye, label: 'View Details', action: () => onView(memory.id) },
    { icon: Edit3, label: 'Edit Memory', action: () => onEdit(memory.id) },
    { icon: Download, label: 'Download', action: () => {} },
    { icon: Copy, label: 'Copy Link', action: () => {} },
    { icon: ExternalLink, label: 'Share External', action: () => {} },
    { icon: Flag, label: 'Report', action: () => {}, danger: true }
  ];

  return (
    <article className={`bg-white rounded-2xl shadow-lg border border-sage-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
      {/* Media Section */}
      <div className="relative">
        {memory.thumbnail ? (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={memory.thumbnail}
              alt={memory.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-sage-100 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 bg-sage-200 rounded-full"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center">
            {TypeIcon ? (
              <TypeIcon className="w-16 h-16 text-sage-400" />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-sage-600 font-medium">Story</p>
              </div>
            )}
          </div>
        )}

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Play Button for Videos */}
          {memory.type === 'video' && (
            <TouchOptimized>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-colors">
                  <Play className="w-8 h-8 text-sage-700 ml-1" />
                </div>
              </button>
            </TouchOptimized>
          )}

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <TouchOptimized>
              <button
                onClick={() => onLike(memory.id)}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  memory.interactions.isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart size={18} className={memory.interactions.isLiked ? 'fill-current' : ''} />
              </button>
            </TouchOptimized>
            
            {memory.interactions.isFavorited && (
              <div className="p-2 rounded-full bg-yellow-500 text-white">
                <Star size={18} className="fill-current" />
              </div>
            )}
            
            <div className="relative">
              <TouchOptimized>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>
              </TouchOptimized>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                    {menuItems.map((item, index) => (
                      <TouchOptimized key={index}>
                        <button
                          onClick={() => {
                            item.action();
                            setShowMenu(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                            item.danger ? 'text-red-600' : 'text-gray-700'
                          }`}
                        >
                          <item.icon size={16} />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      </TouchOptimized>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor()}`}>
            {memory.type.charAt(0).toUpperCase() + memory.type.slice(1)}
          </span>
        </div>

        {/* AI Insights Badge */}
        {memory.aiInsights && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
              <Sparkles size={14} />
              <span className="text-xs font-medium">AI Enhanced</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <TouchOptimized>
              <h3 
                onClick={() => onView(memory.id)}
                className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-sage-700 transition-colors line-clamp-2"
              >
                {memory.title}
              </h3>
            </TouchOptimized>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <time dateTime={memory.date}>
                  {formatDate(memory.date)} at {formatTime(memory.date)}
                </time>
              </div>
              
              {memory.location && (
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
              {memory.author.avatar ? (
                <img 
                  src={memory.author.avatar} 
                  alt={memory.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-sage-600" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{memory.author.name}</p>
              {memory.author.relationship && (
                <p className="text-xs text-gray-500">{memory.author.relationship}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {memory.description && (
          <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
            {memory.description}
          </p>
        )}

        {/* Tags */}
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {memory.tags.slice(0, isMobile ? 3 : 5).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {memory.tags.length > (isMobile ? 3 : 5) && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{memory.tags.length - (isMobile ? 3 : 5)} more
              </span>
            )}
          </div>
        )}

        {/* AI Insights */}
        {memory.aiInsights && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">AI Insights</span>
            </div>
            <div className="space-y-2 text-sm">
              {memory.aiInsights.faces.length > 0 && (
                <p className="text-gray-700">
                  <span className="font-medium">People:</span> {memory.aiInsights.faces.join(', ')}
                </p>
              )}
              {memory.aiInsights.events.length > 0 && (
                <p className="text-gray-700">
                  <span className="font-medium">Event:</span> {memory.aiInsights.events[0]}
                </p>
              )}
              {memory.aiInsights.connections.length > 0 && (
                <p className="text-purple-700">
                  <span className="font-medium">Related:</span> {memory.aiInsights.connections[0]}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <TouchOptimized>
              <button
                onClick={() => onLike(memory.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  memory.interactions.isLiked
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <ThumbsUp size={18} className={memory.interactions.isLiked ? 'fill-current' : ''} />
                <span className="text-sm font-medium">{memory.interactions.likes}</span>
              </button>
            </TouchOptimized>

            <TouchOptimized>
              <button
                onClick={() => onComment(memory.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-sage-600 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="text-sm font-medium">{memory.interactions.comments}</span>
              </button>
            </TouchOptimized>

            <div className="flex items-center space-x-2 text-gray-500">
              <Eye size={18} />
              <span className="text-sm">{memory.interactions.views}</span>
            </div>
          </div>

          <TouchOptimized>
            <button
              onClick={() => onShare(memory.id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-sage-600 transition-colors"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
    </article>
  );
}