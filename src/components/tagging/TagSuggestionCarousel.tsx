import React, { useState } from 'react';
import { Sparkles, Check, X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface TagSuggestion {
  id: string;
  name: string;
  category: 'people' | 'objects' | 'locations' | 'events' | 'emotions';
  confidence: number;
}

interface TagSuggestionCarouselProps {
  suggestions: TagSuggestion[];
  onAccept: (suggestion: TagSuggestion) => void;
  onReject: (suggestion: TagSuggestion) => void;
  className?: string;
}

export function TagSuggestionCarousel({
  suggestions,
  onAccept,
  onReject,
  className = ''
}: TagSuggestionCarouselProps) {
  const { isMobile } = useDeviceDetection();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

  if (suggestions.length === 0) {
    return null;
  }

  const handleNext = () => {
    setAnimationDirection('left');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % suggestions.length);
      setAnimationDirection(null);
    }, 300);
  };

  const handlePrevious = () => {
    setAnimationDirection('right');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      setAnimationDirection(null);
    }, 300);
  };

  const handleAccept = (suggestion: TagSuggestion) => {
    onAccept(suggestion);
    handleNext();
  };

  const handleReject = (suggestion: TagSuggestion) => {
    onReject(suggestion);
    handleNext();
  };

  const getCategoryColor = (category: TagSuggestion['category']) => {
    switch (category) {
      case 'people': return 'bg-blue-100 text-blue-700';
      case 'objects': return 'bg-yellow-100 text-yellow-700';
      case 'locations': return 'bg-green-100 text-green-700';
      case 'events': return 'bg-orange-100 text-orange-700';
      case 'emotions': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const currentSuggestion = suggestions[currentIndex];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-sage-100 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">AI Tag Suggestions</h3>
          </div>
          <span className="text-sm text-purple-700">
            {currentIndex + 1} of {suggestions.length}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div 
          className={`transition-all duration-300 ${
            animationDirection === 'left' 
              ? 'transform -translate-x-10 opacity-0' 
              : animationDirection === 'right'
              ? 'transform translate-x-10 opacity-0'
              : 'transform translate-x-0 opacity-100'
          }`}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Tag className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h4 className="text-xl font-bold text-gray-900">{currentSuggestion.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentSuggestion.category)}`}>
                {currentSuggestion.category}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Sparkles className={`w-4 h-4 ${getConfidenceColor(currentSuggestion.confidence)}`} />
              <span className={`text-sm ${getConfidenceColor(currentSuggestion.confidence)}`}>
                {getConfidenceLabel(currentSuggestion.confidence)} confidence
              </span>
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Does this tag accurately describe this memory?
          </p>
          
          <div className="flex justify-center space-x-4">
            <TouchOptimized>
              <button
                onClick={() => handleReject(currentSuggestion)}
                className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
              >
                <X size={24} />
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => handleAccept(currentSuggestion)}
                className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 hover:bg-green-200 transition-colors"
              >
                <Check size={24} />
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t border-gray-200 bg-gray-50">
        <TouchOptimized>
          <button
            onClick={handlePrevious}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Previous suggestion"
          >
            <ChevronLeft size={20} />
          </button>
        </TouchOptimized>
        
        <div className="flex space-x-1">
          {suggestions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <TouchOptimized>
          <button
            onClick={handleNext}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Next suggestion"
          >
            <ChevronRight size={20} />
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
}