import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { SwipeGestures } from '../ui/SwipeGestures';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface MemoryCollection {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  count: number;
  searchQuery: string;
}

interface AIMemoryCollectionsProps {
  onViewCollection?: (collection: MemoryCollection) => void;
  className?: string;
}

export function AIMemoryCollections({ onViewCollection, className = '' }: AIMemoryCollectionsProps) {
  const { isMobile } = useDeviceDetection();
  const [collections, setCollections] = useState<MemoryCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    fetchCollections();
  }, []);
  
  const fetchCollections = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API
    const mockCollections: MemoryCollection[] = [
      {
        id: 'summer-memories',
        title: 'Summer Memories',
        description: 'Your family\'s best summer moments from the past few years',
        thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
        count: 24,
        searchQuery: 'summer vacation beach'
      },
      {
        id: 'emma-growth',
        title: 'Emma\'s Growth',
        description: 'See how Emma has grown over the years',
        thumbnail: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400',
        count: 42,
        searchQuery: 'Emma milestones growth'
      },
      {
        id: 'family-gatherings',
        title: 'Family Gatherings',
        description: 'Special moments when everyone came together',
        thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
        count: 18,
        searchQuery: 'family reunion gathering'
      },
      {
        id: 'holiday-celebrations',
        title: 'Holiday Celebrations',
        description: 'Christmas, Thanksgiving, and other holiday memories',
        thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400',
        count: 36,
        searchQuery: 'holiday christmas thanksgiving'
      }
    ];
    
    setCollections(mockCollections);
    setLoading(false);
  };
  
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? collections.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev === collections.length - 1 ? 0 : prev + 1));
  };
  
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-lg animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-80"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (collections.length === 0) {
    return null;
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Suggested Collections</h2>
            <p className="text-gray-600">Personalized memory collections created just for you</p>
          </div>
        </div>
      </div>
      
      {isMobile ? (
        // Mobile: Single collection with swipe
        <SwipeGestures
          onSwipeLeft={handleNext}
          onSwipeRight={handlePrevious}
        >
          <div className="relative">
            <TouchOptimized>
              <div 
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden border border-purple-100 hover:shadow-md transition-shadow"
                onClick={() => onViewCollection && onViewCollection(collections[currentIndex])}
              >
                <div className="aspect-video relative">
                  <img
                    src={collections[currentIndex].thumbnail}
                    alt={collections[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-semibold text-lg">{collections[currentIndex].title}</h3>
                      <p className="text-sm text-white/90">{collections[currentIndex].count} memories</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">{collections[currentIndex].description}</p>
                  <Link
                    to={`/search?q=${encodeURIComponent(collections[currentIndex].searchQuery)}`}
                    className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>View Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </TouchOptimized>
            
            {/* Navigation Dots */}
            <div className="flex justify-center space-x-1 mt-4">
              {collections.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            {collections.length > 1 && (
              <>
                <TouchOptimized>
                  <button
                    onClick={handlePrevious}
                    className="absolute top-1/4 left-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={handleNext}
                    className="absolute top-1/4 right-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </TouchOptimized>
              </>
            )}
          </div>
        </SwipeGestures>
      ) : (
        // Desktop: Grid of collections
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <TouchOptimized key={collection.id}>
              <div 
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden border border-purple-100 hover:shadow-md transition-shadow"
                onClick={() => onViewCollection && onViewCollection(collection)}
              >
                <div className="aspect-video relative">
                  <img
                    src={collection.thumbnail}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-semibold text-lg">{collection.title}</h3>
                      <p className="text-sm text-white/90">{collection.count} memories</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">{collection.description}</p>
                  <Link
                    to={`/search?q=${encodeURIComponent(collection.searchQuery)}`}
                    className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>View Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </TouchOptimized>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <TouchOptimized>
          <Link
            to="/search/collections"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <span>View All AI Collections</span>
            <ArrowRight size={16} />
          </Link>
        </TouchOptimized>
      </div>
    </div>
  );
}