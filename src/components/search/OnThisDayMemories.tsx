import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { SwipeGestures } from '../ui/SwipeGestures';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface OnThisDayMemory {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  date: string;
  yearsAgo: number;
  type: 'photo' | 'video' | 'audio' | 'story';
}

interface OnThisDayMemoriesProps {
  onViewAll?: () => void;
  className?: string;
}

export function OnThisDayMemories({ onViewAll, className = '' }: OnThisDayMemoriesProps) {
  const { isMobile } = useDeviceDetection();
  const [memories, setMemories] = useState<OnThisDayMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    fetchOnThisDayMemories();
  }, []);
  
  const fetchOnThisDayMemories = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get current date (month and day)
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Mock data - in a real app, this would come from your API
    const mockMemories: OnThisDayMemory[] = [
      {
        id: '1',
        title: 'Beach Vacation',
        description: 'Our family trip to Hawaii',
        thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
        date: `${today.getFullYear() - 1}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        yearsAgo: 1,
        type: 'photo'
      },
      {
        id: '2',
        title: 'Emma\'s Birthday Party',
        description: 'Emma turned 5 years old',
        thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        date: `${today.getFullYear() - 2}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        yearsAgo: 2,
        type: 'photo'
      },
      {
        id: '3',
        title: 'Family Dinner',
        description: 'Sunday dinner at Grandma\'s house',
        thumbnail: 'https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&w=400',
        date: `${today.getFullYear() - 3}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        yearsAgo: 3,
        type: 'photo'
      }
    ];
    
    setMemories(mockMemories);
    setLoading(false);
  };
  
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? memories.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev === memories.length - 1 ? 0 : prev + 1));
  };
  
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg animate-pulse">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        
        <div className="aspect-video bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (memories.length === 0) {
    return null;
  }
  
  const currentMemory = memories[currentIndex];
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">On This Day</h2>
            <p className="text-gray-600">Memories from this day in previous years</p>
          </div>
        </div>
        
        {memories.length > 1 && (
          <div className="flex items-center space-x-1">
            {memories.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <SwipeGestures
        onSwipeLeft={handleNext}
        onSwipeRight={handlePrevious}
      >
        <div className="relative">
          {/* Memory Content */}
          <div className="mb-4">
            <div className="relative">
              {currentMemory.thumbnail ? (
                <img
                  src={currentMemory.thumbnail}
                  alt={currentMemory.title}
                  className="w-full rounded-lg aspect-video object-cover"
                />
              ) : (
                <div className="w-full rounded-lg aspect-video bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {currentMemory.yearsAgo} {currentMemory.yearsAgo === 1 ? 'year' : 'years'} ago
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{currentMemory.title}</h3>
            
            {currentMemory.description && (
              <p className="text-gray-700 mb-2">{currentMemory.description}</p>
            )}
            
            <p className="text-sm text-gray-500">
              {new Date(currentMemory.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          {/* Navigation Arrows */}
          {memories.length > 1 && (
            <>
              <TouchOptimized>
                <button
                  onClick={handlePrevious}
                  className="absolute top-1/3 left-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleNext}
                  className="absolute top-1/3 right-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </TouchOptimized>
            </>
          )}
        </div>
      </SwipeGestures>
      
      <div className="mt-4 text-center">
        <TouchOptimized>
          <Link
            to={`/search?q=on%20this%20day`}
            onClick={() => onViewAll && onViewAll()}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>View All "On This Day" Memories</span>
            <ArrowRight size={16} />
          </Link>
        </TouchOptimized>
      </div>
    </div>
  );
}