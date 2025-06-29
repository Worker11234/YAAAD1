import React from 'react';
import { 
  Clock, Tag, User, MapPin, Sparkles, 
  Calendar, Image, Video, Volume2, FileText
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'ai' | 'tag' | 'person' | 'location' | 'date' | 'media';
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
  className?: string;
}

export function SearchSuggestions({
  suggestions,
  onSelectSuggestion,
  className = ''
}: SearchSuggestionsProps) {
  const getIconForType = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) {
      return suggestion.icon;
    }
    
    switch (suggestion.type) {
      case 'recent':
        return Clock;
      case 'popular':
        return Star;
      case 'ai':
        return Sparkles;
      case 'tag':
        return Tag;
      case 'person':
        return User;
      case 'location':
        return MapPin;
      case 'date':
        return Calendar;
      case 'media':
        if (suggestion.text.toLowerCase().includes('photo')) return Image;
        if (suggestion.text.toLowerCase().includes('video')) return Video;
        if (suggestion.text.toLowerCase().includes('audio')) return Volume2;
        if (suggestion.text.toLowerCase().includes('story')) return FileText;
        return Image;
      default:
        return Search;
    }
  };
  
  const getColorForType = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return 'text-gray-500';
      case 'popular':
        return 'text-yellow-600';
      case 'ai':
        return 'text-purple-600';
      case 'tag':
        return 'text-green-600';
      case 'person':
        return 'text-blue-600';
      case 'location':
        return 'text-orange-600';
      case 'date':
        return 'text-red-600';
      case 'media':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-2">
        {suggestions.map((suggestion, index) => {
          const Icon = getIconForType(suggestion);
          const iconColor = getColorForType(suggestion.type);
          
          return (
            <TouchOptimized key={index}>
              <button
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <Icon size={18} className={iconColor} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{suggestion.text}</p>
                  <p className="text-xs text-gray-500 capitalize">{suggestion.type}</p>
                </div>
              </button>
            </TouchOptimized>
          );
        })}
      </div>
    </div>
  );
}