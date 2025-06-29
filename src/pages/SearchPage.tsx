import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Grid, List, Mic, Filter, 
  Sparkles, Calendar, MapPin, X, Save, Download, 
  Share2, ArrowLeft, Layers, Bookmark, Clock, Star
} from 'lucide-react';
import SearchComponent from '../components/ui/animated-glowing-search-bar';
import { SearchFilters } from '../components/search/SearchFilters';
import { SearchResults } from '../components/search/SearchResults';
import { OnThisDayMemories } from '../components/search/OnThisDayMemories';
import { AIMemoryCollections } from '../components/search/AIMemoryCollections';
import { SearchSuggestions } from '../components/search/SearchSuggestions';
import { SavedSearches } from '../components/search/SavedSearches';
import { VoiceSearchOverlay } from '../components/search/VoiceSearchOverlay';
import { SearchResultsMap } from '../components/search/SearchResultsMap';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

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
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

interface SearchFilters {
  dateRange: {
    start: string;
    end: string;
    preset: 'custom' | 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all';
  };
  familyMembers: string[];
  locations: string[];
  tags: string[];
  eventTypes: string[];
  mediaTypes: ('photo' | 'video' | 'audio' | 'story')[];
  sortBy: 'relevance' | 'date' | 'likes' | 'views';
  sortOrder: 'asc' | 'desc';
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: string;
}

export function SearchPage() {
  const { isMobile } = useDeviceDetection();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(isMobile ? 'list' : 'grid');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: {
      start: '',
      end: '',
      preset: 'all'
    },
    familyMembers: [],
    locations: [],
    tags: [],
    eventTypes: [],
    mediaTypes: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  
  // Load initial search if query is present in URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    
    // Load saved searches
    loadSavedSearches();
  }, [initialQuery]);
  
  const loadSavedSearches = () => {
    // In a real app, this would come from your API or local storage
    const mockSavedSearches: SavedSearch[] = [
      {
        id: '1',
        name: 'Summer Vacation Photos',
        query: 'summer vacation beach',
        filters: {
          dateRange: {
            start: '2024-06-01',
            end: '2024-08-31',
            preset: 'custom'
          },
          familyMembers: [],
          locations: ['Beach', 'Hawaii'],
          tags: ['Summer', 'Vacation'],
          eventTypes: [],
          mediaTypes: ['photo'],
          sortBy: 'date',
          sortOrder: 'desc'
        },
        createdAt: '2024-12-01T12:00:00Z'
      },
      {
        id: '2',
        name: 'Family Christmas Memories',
        query: 'christmas family',
        filters: {
          dateRange: {
            start: '',
            end: '',
            preset: 'all'
          },
          familyMembers: ['Mom', 'Dad', 'Emma', 'Jake'],
          locations: [],
          tags: ['Christmas', 'Holiday'],
          eventTypes: [],
          mediaTypes: [],
          sortBy: 'relevance',
          sortOrder: 'desc'
        },
        createdAt: '2024-11-15T10:30:00Z'
      },
      {
        id: '3',
        name: 'Grandma\'s Stories',
        query: 'grandma stories',
        filters: {
          dateRange: {
            start: '',
            end: '',
            preset: 'all'
          },
          familyMembers: ['Grandma'],
          locations: [],
          tags: ['Stories', 'History'],
          eventTypes: [],
          mediaTypes: ['audio', 'story'],
          sortBy: 'date',
          sortOrder: 'asc'
        },
        createdAt: '2024-10-20T15:45:00Z'
      }
    ];
    
    setSavedSearches(mockSavedSearches);
  };
  
  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setLoading(true);
    setQuery(searchQuery);
    
    // Update URL with search query
    setSearchParams({ q: searchQuery });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock search results - in a real app, this would come from your API
    const mockResults: SearchResult[] = [
          {
            id: '1',
            title: 'Christmas Morning 2024',
            description: 'Opening presents around the tree',
            type: 'photo',
            thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '2024-12-25',
            tags: ['Christmas', 'Family', 'Holiday', 'Morning'],
            author: {
              name: 'Mom',
              avatar: undefined
            },
            interactions: {
              views: 42,
              likes: 15,
              comments: 8
            },
            location: {
              name: 'Living Room, Home',
              coordinates: {
                lat: 40.7128,
                lng: -74.0060
              }
            }
          },
          {
            id: '2',
            title: 'Family Reunion Group Photo',
            description: 'Everyone together at Grandma\'s house',
            type: 'photo',
            thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '2024-07-15',
            tags: ['Family', 'Reunion', 'Summer', 'Group Photo'],
            author: {
              name: 'Uncle John',
              avatar: undefined
            },
            interactions: {
              views: 78,
              likes: 24,
              comments: 12
            },
            location: {
              name: 'Grandma\'s House',
              coordinates: {
                lat: 40.7282,
                lng: -73.7949
              }
            }
          },
          {
            id: '3',
            title: 'Beach Vacation',
            description: 'Our trip to Hawaii last summer',
            type: 'video',
            thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '2024-08-10',
            tags: ['Vacation', 'Beach', 'Hawaii', 'Summer', 'Ocean'],
            author: {
              name: 'Dad',
              avatar: undefined
            },
            interactions: {
              views: 56,
              likes: 18,
              comments: 6
            },
            location: {
              name: 'Maui, Hawaii',
              coordinates: {
                lat: 20.7984,
                lng: -156.3319
              }
            }
          },
          {
            id: '4',
            title: 'Grandma\'s Birthday Celebration',
            description: 'Grandma\'s 80th birthday party',
            type: 'photo',
            thumbnail: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '2024-06-15',
            tags: ['Birthday', 'Grandma', 'Celebration', 'Family', 'Party'],
            author: {
              name: 'Sarah',
              avatar: undefined
            },
            interactions: {
              views: 64,
              likes: 22,
              comments: 10
            },
            location: {
              name: 'Backyard, Home',
              coordinates: {
                lat: 40.7129,
                lng: -74.0061
              }
            }
          },
          {
            id: '5',
            title: 'Grandpa\'s War Stories',
            description: 'Grandpa sharing his experiences from the war',
            type: 'audio',
            date: '2024-05-20',
            tags: ['Grandpa', 'Stories', 'History', 'War', 'Family History'],
            author: {
              name: 'Jake',
              avatar: undefined
            },
            interactions: {
              views: 32,
              likes: 14,
              comments: 5
            },
            location: {
              name: 'Living Room, Home',
              coordinates: {
                lat: 40.7128,
                lng: -74.0060
              }
            }
          },
          {
            id: '6',
            title: 'Emma\'s First Day of School',
            description: 'Emma\'s first day of kindergarten',
            type: 'photo',
            thumbnail: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '2024-09-01',
            tags: ['School', 'Kids', 'Milestone'],
            author: {
              name: 'Mom',
              avatar: undefined
            },
            interactions: {
              views: 48,
              likes: 20,
              comments: 8
            },
            location: {
              name: 'Elementary School',
              coordinates: {
                lat: 40.7200,
                lng: -74.0100
              }
            }
          }
        ];

        // Filter results based on search query
        const filteredResults = mockResults.filter(result => {
          const searchLower = searchQuery.toLowerCase();
          return (
            result.title.toLowerCase().includes(searchLower) ||
            (result.description && result.description.toLowerCase().includes(searchLower)) ||
            result.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            result.location.name.toLowerCase().includes(searchLower) ||
            result.author.name.toLowerCase().includes(searchLower)
          );
        });

        setResults(filteredResults);
        setLoading(false);
        setHasSearched(true);
        setShowSuggestions(false);
        setIsSearching(false);
      };
  
  const handleSearch = (searchQuery: string) => {
    performSearch(searchQuery);
  };
  
  const handleVoiceSearchResult = (transcript: string) => {
    setShowVoiceSearch(false);
    performSearch(transcript);
  };
  
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      dateRange: {
        start: '',
        end: '',
        preset: 'all'
      },
      familyMembers: [],
      locations: [],
      tags: [],
      eventTypes: [],
      mediaTypes: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };
  
  const handleSaveSearch = () => {
    // In a real app, this would save to your API or local storage
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: `Search: ${query}`,
      query,
      filters,
      createdAt: new Date().toISOString()
    };
    
    setSavedSearches(prev => [newSavedSearch, ...prev]);
    
    // Show confirmation
    alert('Search saved successfully!');
  };
  
  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };
  
  const handleLoadSavedSearch = (search: SavedSearch) => {
    setQuery(search.query);
    setFilters(search.filters);
    performSearch(search.query);
    setShowSavedSearches(false);
  };
  
  const handleSelectSuggestion = (suggestion: any) => {
    performSearch(suggestion.text);
    setShowSuggestions(false);
  };
  
  const handleResultClick = (result: SearchResult) => {
    // In a real app, this would navigate to the memory detail page
    navigate(`/memory/${result.id}`);
  };
  
  // Generate search suggestions based on query
  const getSearchSuggestions = () => {
    if (!query) return [];
    
    return [
      { text: `${query} family photos`, type: 'ai' },
      { text: `${query} vacation`, type: 'ai' },
      { text: `${query} with grandma`, type: 'ai' },
      { text: 'Christmas morning', type: 'recent' },
      { text: 'Summer vacation', type: 'recent' },
      { text: 'Birthday parties', type: 'popular' },
      { text: 'Family reunions', type: 'popular' },
      { text: 'Photos with Mom', type: 'person' },
      { text: 'Videos from Hawaii', type: 'location' },
      { text: 'Memories from 2023', type: 'date' }
    ];
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search & Discover</h1>
            <p className="text-lg text-gray-600">
              Find your family's precious memories
            </p>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <SearchComponent />
        
        {/* Voice Search Button */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <TouchOptimized>
            <button
              onClick={() => setShowVoiceSearch(true)}
              className="p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-full transition-colors"
              aria-label="Voice search"
            >
              <Mic size={20} />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${
                showFilters
                  ? 'bg-sage-700 text-white'
                  : 'text-sage-600 hover:text-sage-700 hover:bg-sage-50'
              }`}
              aria-label="Search filters"
            >
              <Filter size={20} />
            </button>
          </TouchOptimized>
        </div>
        
        {/* Search Suggestions */}
        {showSuggestions && query && !isSearching && (
          <div className="absolute z-10 left-0 right-0 mt-2">
            <SearchSuggestions
              suggestions={getSearchSuggestions()}
              onSelectSuggestion={handleSelectSuggestion}
            />
          </div>
        )}
      </div>
      
      {/* Quick Action Buttons */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <TouchOptimized>
          <button
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
          >
            <Bookmark size={16} className="text-sage-600" />
            <span className="text-sm font-medium text-gray-700">Saved Searches</span>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => navigate('/search/on-this-day')}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
          >
            <Calendar size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">On This Day</span>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => navigate('/search/collections')}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
          >
            <Sparkles size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI Collections</span>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => setShowMapView(!showMapView)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border shadow-sm hover:shadow-md transition-shadow whitespace-nowrap ${
              showMapView
                ? 'bg-sage-700 text-white border-sage-700'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <MapPin size={16} className={showMapView ? 'text-white' : 'text-orange-600'} />
            <span className="text-sm font-medium">Map View</span>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => navigate('/search/recent')}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
          >
            <Clock size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Recent Searches</span>
          </button>
        </TouchOptimized>
      </div>
      
      {/* Saved Searches */}
      {showSavedSearches && (
        <div className="mb-6">
          <SavedSearches
            searches={savedSearches}
            onLoadSearch={handleLoadSavedSearch}
            onDeleteSearch={handleDeleteSavedSearch}
          />
        </div>
      )}
      
      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyFilters={() => {
          // Re-run search with current filters
          performSearch(query);
        }}
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
        className="mb-6"
      />
      
      {/* Search Results */}
      {hasSearched && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Searching...' : `Results for "${query}"`}
            </h2>
            
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
                <TouchOptimized>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${
                      viewMode === 'grid'
                        ? 'bg-sage-700 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={16} />
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${
                      viewMode === 'list'
                        ? 'bg-sage-700 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </TouchOptimized>
              </div>
              
              {/* Save Search Button */}
              {results.length > 0 && (
                <TouchOptimized>
                  <button
                    onClick={handleSaveSearch}
                    className="p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
                    aria-label="Save search"
                  >
                    <Save size={18} />
                  </button>
                </TouchOptimized>
              )}
              
              {/* Export Results Button */}
              {results.length > 0 && (
                <TouchOptimized>
                  <button
                    onClick={() => {
                      // In a real app, this would export the results
                      alert('Export functionality would go here');
                    }}
                    className="p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
                    aria-label="Export results"
                  >
                    <Download size={18} />
                  </button>
                </TouchOptimized>
              )}
              
              {/* Share Results Button */}
              {results.length > 0 && (
                <TouchOptimized>
                  <button
                    onClick={() => {
                      // In a real app, this would share the results
                      alert('Share functionality would go here');
                    }}
                    className="p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
                    aria-label="Share results"
                  >
                    <Share2 size={18} />
                  </button>
                </TouchOptimized>
              )}
            </div>
          </div>
          
          {/* Results Count */}
          {!loading && (
            <p className="text-gray-600 mb-4">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          )}
          
          {/* Map View */}
          {showMapView && results.length > 0 && (
            <div className="mb-6">
              <SearchResultsMap
                results={results}
                onResultClick={handleResultClick}
              />
            </div>
          )}
          
          {/* Results Grid/List */}
          <SearchResults
            results={results}
            viewMode={viewMode}
            onResultClick={handleResultClick}
            isLoading={loading}
          />
        </div>
      )}
      
      {/* Discovery Sections - Only show if no search has been performed */}
      {!hasSearched && (
        <div className="space-y-8">
          <OnThisDayMemories />
          
          <AIMemoryCollections />
          
          {/* Recent Searches Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Searches</h2>
                <p className="text-gray-600">Your recent search activity</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Christmas photos', 'Summer vacation', 'Grandma\'s birthday', 'Beach memories', 'Family dinner', 'School events'].map((search, index) => (
                <TouchOptimized key={index}>
                  <button
                    onClick={() => performSearch(search)}
                    className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="font-medium text-gray-900">{search}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}
                    </p>
                  </button>
                </TouchOptimized>
              ))}
            </div>
          </div>
          
          {/* Popular Searches */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Popular in Your Family</h2>
                <p className="text-gray-600">Trending searches among family members</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {['Family reunions', 'Holiday celebrations', 'Vacation memories', 'Birthday parties', 'School events', 'Grandparents', 'Childhood photos', 'Family recipes'].map((search, index) => (
                <TouchOptimized key={index}>
                  <button
                    onClick={() => performSearch(search)}
                    className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full text-gray-900 transition-colors"
                  >
                    {search}
                  </button>
                </TouchOptimized>
              ))}
            </div>
          </div>
          
          {/* Search Tips */}
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl p-6 border border-sage-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-sage-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Search Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Natural Language Search</h3>
                <p className="text-gray-700 text-sm">
                  Try phrases like "photos from last Christmas" or "videos with Grandma"
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Search by Person</h3>
                <p className="text-gray-700 text-sm">
                  Type a family member's name to find memories featuring them
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Location Search</h3>
                <p className="text-gray-700 text-sm">
                  Search for places like "beach vacation" or "grandma's house"
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Time-Based Search</h3>
                <p className="text-gray-700 text-sm">
                  Try "summer 2023" or "last Christmas" to find memories from specific times
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Voice Search Overlay */}
      <VoiceSearchOverlay
        isActive={showVoiceSearch}
        onClose={() => setShowVoiceSearch(false)}
        onResult={handleVoiceSearchResult}
      />
    </div>
  );
}