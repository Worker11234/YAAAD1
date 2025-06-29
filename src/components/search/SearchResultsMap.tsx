import React, { useState, useEffect } from 'react';
import { MapPin, Maximize2, Minimize2, Search, X } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface SearchResult {
  id: string;
  title: string;
  thumbnail?: string;
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

interface SearchResultsMapProps {
  results: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResultsMap({
  results,
  onResultClick,
  className = ''
}: SearchResultsMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Filter results with location data
  const resultsWithLocation = results.filter(result => result.location?.coordinates);
  
  // In a real app, you would use a mapping library like Leaflet or Google Maps
  // For this example, we'll create a simplified map visualization
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (resultsWithLocation.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Location Data</h3>
        <p className="text-gray-600">
          None of the search results have location information
        </p>
      </div>
    );
  }
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 ${
        isExpanded ? 'fixed inset-4 z-50' : className
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-sage-600" />
          <h3 className="font-semibold text-gray-900">Location Map</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <TouchOptimized>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </TouchOptimized>
          
          {isExpanded && (
            <TouchOptimized>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </TouchOptimized>
          )}
        </div>
      </div>
      
      <div className={`relative ${isExpanded ? 'h-full' : 'h-64 sm:h-80'}`}>
        {/* Map Placeholder */}
        {!mapLoaded ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading map...</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-100">
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 p-4">
              {/* Simplified map visualization */}
              <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
                {/* Map background */}
                <div className="absolute inset-0 bg-opacity-20 bg-blue-100 grid grid-cols-8 grid-rows-8">
                  {Array.from({ length: 64 }).map((_, index) => (
                    <div key={index} className="border border-blue-200"></div>
                  ))}
                </div>
                
                {/* Location pins */}
                {resultsWithLocation.map((result) => {
                  const { lat, lng } = result.location!.coordinates;
                  
                  // Convert lat/lng to relative positions (0-100%)
                  // In a real map, you would use proper projection
                  const x = ((lng + 180) / 360) * 100;
                  const y = ((90 - lat) / 180) * 100;
                  
                  return (
                    <TouchOptimized key={result.id}>
                      <button
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                          selectedResult?.id === result.id
                            ? 'z-10'
                            : 'z-0'
                        }`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        onClick={() => {
                          setSelectedResult(result);
                          if (onResultClick) onResultClick(result);
                        }}
                      >
                        <div className={`
                          w-6 h-6 flex items-center justify-center rounded-full
                          ${selectedResult?.id === result.id
                            ? 'bg-sage-700 text-white'
                            : 'bg-white text-sage-700 border border-sage-700'
                          }
                        `}>
                          <MapPin size={14} />
                        </div>
                      </button>
                    </TouchOptimized>
                  );
                })}
                
                {/* Selected location info */}
                {selectedResult && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3">
                    {selectedResult.thumbnail ? (
                      <img
                        src={selectedResult.thumbnail}
                        alt={selectedResult.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{selectedResult.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{selectedResult.location?.name}</p>
                    </div>
                    <TouchOptimized>
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </TouchOptimized>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
          <TouchOptimized>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sage-600 hover:text-sage-700 text-sm font-medium"
            >
              View Full Map
            </button>
          </TouchOptimized>
        </div>
      )}
    </div>
  );
}