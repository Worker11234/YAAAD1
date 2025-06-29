import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, Camera, Award, Sparkles, 
  ChevronLeft, ChevronRight, Share2, MessageCircle, Eye, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { SwipeGestures } from '../ui/SwipeGestures';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Highlight {
  id: string;
  title: string;
  description: string;
  type: 'memory' | 'milestone' | 'activity' | 'anniversary';
  date: string;
  image?: string;
  link: string;
  stats?: {
    views: number;
    likes: number;
    comments: number;
  };
}

interface FamilyHighlightsProps {
  familyId: string;
  limit?: number;
  className?: string;
}

export function FamilyHighlights({
  familyId,
  limit = 5,
  className = ''
}: FamilyHighlightsProps) {
  const { isMobile } = useDeviceDetection();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch highlights
  useEffect(() => {
    fetchHighlights();
  }, [familyId, limit]);

  const fetchHighlights = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockHighlights: Highlight[] = [
      {
        id: '1',
        title: 'Most Viewed Memory This Week',
        description: 'The Christmas morning photos have been viewed 42 times by your family!',
        type: 'memory',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        image: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '/memory/1',
        stats: {
          views: 42,
          likes: 15,
          comments: 8
        }
      },
      {
        id: '2',
        title: 'Family Anniversary',
        description: 'Today marks 35 years since Grandma and Grandpa\'s wedding!',
        type: 'anniversary',
        date: new Date().toISOString(), // Today
        image: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '/timeline?date=1989-06-15',
        stats: {
          views: 28,
          likes: 22,
          comments: 12
        }
      },
      {
        id: '3',
        title: 'Memory Milestone',
        description: 'Your family has shared 100 memories together!',
        type: 'milestone',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        link: '/dashboard',
        stats: {
          views: 35,
          likes: 18,
          comments: 5
        }
      },
      {
        id: '4',
        title: 'Active Family Member',
        description: 'Mom has been the most active family member this month, adding 15 new memories!',
        type: 'activity',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        link: '/family',
        stats: {
          views: 20,
          likes: 12,
          comments: 3
        }
      },
      {
        id: '5',
        title: 'Memory Collection Complete',
        description: 'The "Summer Vacation 2024" collection now has 25 memories!',
        type: 'memory',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '/collection/summer-2024',
        stats: {
          views: 38,
          likes: 24,
          comments: 10
        }
      }
    ];
    
    // Apply limit
    const limitedHighlights = mockHighlights.slice(0, limit);
    
    setHighlights(limitedHighlights);
    setLoading(false);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? highlights.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === highlights.length - 1 ? 0 : prev + 1));
  };

  const getHighlightIcon = (type: Highlight['type']) => {
    switch (type) {
      case 'memory': return Camera;
      case 'milestone': return Award;
      case 'activity': return User;
      case 'anniversary': return Calendar;
      default: return Heart;
    }
  };

  const getHighlightColor = (type: Highlight['type']) => {
    switch (type) {
      case 'memory': return 'bg-blue-600';
      case 'milestone': return 'bg-purple-600';
      case 'activity': return 'bg-green-600';
      case 'anniversary': return 'bg-red-600';
      default: return 'bg-sage-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No highlights yet</h3>
          <p className="text-gray-600 mb-4">
            As your family adds more memories, we'll show highlights here.
          </p>
        </div>
      </div>
    );
  }

  const currentHighlight = highlights[currentIndex];
  const HighlightIcon = getHighlightIcon(currentHighlight.type);

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">Family Highlights</h3>
          </div>
          
          {highlights.length > 1 && (
            <div className="flex items-center space-x-1">
              {highlights.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-sage-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <SwipeGestures
        onSwipeLeft={handleNext}
        onSwipeRight={handlePrevious}
      >
        <div className="relative">
          {/* Highlight Content */}
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className={`p-2 rounded-lg ${getHighlightColor(currentHighlight.type)} text-white`}>
                <HighlightIcon size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {formatDate(currentHighlight.date)}
              </span>
            </div>
            
            {currentHighlight.image && (
              <div className="mb-4">
                <img
                  src={currentHighlight.image}
                  alt={currentHighlight.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {currentHighlight.title}
            </h4>
            
            <p className="text-gray-600 mb-4">
              {currentHighlight.description}
            </p>
            
            {currentHighlight.stats && (
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{currentHighlight.stats.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={14} />
                  <span>{currentHighlight.stats.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle size={14} />
                  <span>{currentHighlight.stats.comments}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Link
                to={currentHighlight.link}
                className="text-sage-600 hover:text-sage-700 font-medium text-sm"
              >
                View Details
              </Link>
              
              <TouchOptimized>
                <button
                  onClick={() => {
                    // In a real app, this would open a share dialog
                    console.log('Share highlight');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </TouchOptimized>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          {highlights.length > 1 && (
            <>
              <TouchOptimized>
                <button
                  onClick={handlePrevious}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </TouchOptimized>
            </>
          )}
        </div>
      </SwipeGestures>
    </div>
  );
}