import React from 'react';
import { Save, X, ArrowRight, Calendar, Tag, User, Layers } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    dateRange: {
      start: string;
      end: string;
      preset: string;
    };
    familyMembers: string[];
    tags: string[];
    mediaTypes: string[];
    // Other filter properties
  };
  createdAt: string;
}

interface SavedSearchesProps {
  searches: SavedSearch[];
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (id: string) => void;
  className?: string;
}

export function SavedSearches({
  searches,
  onLoadSearch,
  onDeleteSearch,
  className = ''
}: SavedSearchesProps) {
  if (searches.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Save className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Searches</h3>
        <p className="text-gray-600">
          Save your searches to quickly access them later
        </p>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Save className="w-5 h-5 text-sage-600" />
        <h3 className="font-semibold text-gray-900">Saved Searches</h3>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {searches.map((search) => (
          <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{search.name}</p>
              <p className="text-sm text-gray-600 truncate">{search.query}</p>
              
              {/* Filter Summary */}
              <div className="flex flex-wrap gap-1 mt-1">
                {search.filters.dateRange.preset !== 'all' && (
                  <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    <Calendar size={10} className="mr-1" />
                    <span>
                      {search.filters.dateRange.preset === 'today' ? 'Today' :
                       search.filters.dateRange.preset === 'yesterday' ? 'Yesterday' :
                       search.filters.dateRange.preset === 'week' ? 'Last 7 Days' :
                       search.filters.dateRange.preset === 'month' ? 'Last 30 Days' :
                       search.filters.dateRange.preset === 'year' ? 'Last 12 Months' :
                       'Custom Date'}
                    </span>
                  </div>
                )}
                
                {search.filters.tags.length > 0 && (
                  <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    <Tag size={10} className="mr-1" />
                    <span>{search.filters.tags.length} tags</span>
                  </div>
                )}
                
                {search.filters.familyMembers.length > 0 && (
                  <div className="flex items-center bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                    <User size={10} className="mr-1" />
                    <span>{search.filters.familyMembers.length} people</span>
                  </div>
                )}
                
                {search.filters.mediaTypes.length > 0 && (
                  <div className="flex items-center bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                    <Layers size={10} className="mr-1" />
                    <span>{search.filters.mediaTypes.length} media types</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              <TouchOptimized>
                <button
                  onClick={() => onLoadSearch(search)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Load search"
                >
                  <ArrowRight size={18} />
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={() => onDeleteSearch(search.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete search"
                >
                  <X size={18} />
                </button>
              </TouchOptimized>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}