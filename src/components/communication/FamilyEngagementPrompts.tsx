import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, RefreshCw, ThumbsUp, ThumbsDown, 
  Share2, Calendar, Sparkles, ArrowRight, Heart, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface EngagementPrompt {
  id: string;
  title: string;
  description: string;
  type: 'question' | 'activity' | 'memory' | 'challenge';
  actionText: string;
  actionLink: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface FamilyEngagementPromptsProps {
  familyId: string;
  className?: string;
}

export function FamilyEngagementPrompts({
  familyId,
  className = ''
}: FamilyEngagementPromptsProps) {
  const { isMobile } = useDeviceDetection();
  const [prompts, setPrompts] = useState<EngagementPrompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<EngagementPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch prompts
  useEffect(() => {
    fetchPrompts();
  }, [familyId]);

  const fetchPrompts = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockPrompts: EngagementPrompt[] = [
      {
        id: '1',
        title: 'Memory Conversation Starter',
        description: 'What was your favorite family vacation and why? Share a memory that made it special.',
        type: 'question',
        actionText: 'Share Your Answer',
        actionLink: '/upload?type=story'
      },
      {
        id: '2',
        title: 'Weekly Memory Challenge',
        description: 'This week\'s challenge: Find and upload a photo from a family celebration that happened more than 10 years ago.',
        type: 'challenge',
        actionText: 'Accept Challenge',
        actionLink: '/upload?type=photo'
      },
      {
        id: '3',
        title: 'Family History Question',
        description: 'Ask Grandma about her childhood home. What was her favorite room and why?',
        type: 'activity',
        actionText: 'Record Story',
        actionLink: '/upload?type=audio'
      },
      {
        id: '4',
        title: 'Memory Throwback',
        description: 'It\'s been 5 years since your family reunion in 2019. Why not revisit those memories today?',
        type: 'memory',
        actionText: 'View Memories',
        actionLink: '/timeline?year=2019&tag=reunion'
      },
      {
        id: '5',
        title: 'Upcoming Family Event',
        description: 'Dad\'s birthday is coming up next week. Create a collaborative memory collection for everyone to add to!',
        type: 'activity',
        actionText: 'Create Collection',
        actionLink: '/collections/new'
      }
    ];
    
    setPrompts(mockPrompts);
    setCurrentPrompt(mockPrompts[Math.floor(Math.random() * mockPrompts.length)]);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get a different prompt
    const availablePrompts = prompts.filter(p => p.id !== currentPrompt?.id);
    if (availablePrompts.length > 0) {
      setCurrentPrompt(availablePrompts[Math.floor(Math.random() * availablePrompts.length)]);
    }
    
    setRefreshing(false);
  };

  const handleLike = () => {
    if (!currentPrompt) return;
    
    setCurrentPrompt(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        isDisliked: false
      };
    });
  };

  const handleDislike = () => {
    if (!currentPrompt) return;
    
    setCurrentPrompt(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isDisliked: !prev.isDisliked,
        isLiked: false
      };
    });
    
    // Get a new prompt after disliking
    setTimeout(handleRefresh, 500);
  };

  const getPromptIcon = (type: EngagementPrompt['type']) => {
    switch (type) {
      case 'question': return MessageSquare;
      case 'activity': return Calendar;
      case 'memory': return Heart;
      case 'challenge': return Award;
      default: return Sparkles;
    }
  };

  const getPromptColor = (type: EngagementPrompt['type']) => {
    switch (type) {
      case 'question': return 'bg-blue-600';
      case 'activity': return 'bg-green-600';
      case 'memory': return 'bg-red-600';
      case 'challenge': return 'bg-purple-600';
      default: return 'bg-sage-600';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!currentPrompt) {
    return (
      <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No prompts available</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any engagement prompts for your family right now.
          </p>
          <TouchOptimized>
            <button
              onClick={fetchPrompts}
              className="text-sage-600 hover:text-sage-700 font-medium"
            >
              Try Again
            </button>
          </TouchOptimized>
        </div>
      </div>
    );
  }

  const PromptIcon = getPromptIcon(currentPrompt.type);

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">Memory Prompt</h3>
          </div>
          
          <TouchOptimized>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors ${
                refreshing ? 'animate-spin' : ''
              }`}
              aria-label="Get new prompt"
            >
              <RefreshCw size={18} />
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className={`p-2 rounded-lg ${getPromptColor(currentPrompt.type)} text-white`}>
            <PromptIcon size={16} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {currentPrompt.title}
          </span>
        </div>
        
        <p className="text-gray-700 mb-6 text-base">
          {currentPrompt.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TouchOptimized>
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  currentPrompt.isLiked
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                }`}
                aria-label="Like this prompt"
              >
                <ThumbsUp size={18} />
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handleDislike}
                className={`p-2 rounded-full transition-colors ${
                  currentPrompt.isDisliked
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
                aria-label="Dislike this prompt"
              >
                <ThumbsDown size={18} />
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => {
                  // In a real app, this would open a share dialog
                  console.log('Share prompt');
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share this prompt"
              >
                <Share2 size={18} />
              </button>
            </TouchOptimized>
          </div>
          
          <TouchOptimized>
            <Link
              to={currentPrompt.actionLink}
              className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
            >
              <span>{currentPrompt.actionText}</span>
              <ArrowRight size={16} />
            </Link>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}