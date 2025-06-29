import React, { useState } from 'react';
import { 
  Filter, Calendar, MapPin, Tag, User, Image, Video, 
  FileText, Volume2, X, ChevronDown, ChevronUp, Search,
  Check, RefreshCw, ArrowRight
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
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

export function SearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  isOpen,
  onToggle,
  className = ''
}: SearchFiltersProps) {
  const { isMobile } = useDeviceDetection();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'date', 'mediaTypes', 'familyMembers', 'tags'
  ]);
  const [tagSearch, setTagSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [familyMemberSearch, setFamilyMemberSearch] = useState('');
  const [eventTypeSearch, setEventTypeSearch] = useState('');
  
  // Mock data for available filter options
  const availableTags = [
    'Family', 'Christmas', 'Birthday', 'Vacation', 'Beach', 'Summer', 
    'Winter', 'Holiday', 'School', 'Graduation', 'Wedding', 'Anniversary',
    'Party', 'Travel', 'Sports', 'Music', 'Art', 'Food', 'Pets', 'Friends'
  ];
  
  const availableLocations = [
    'Home', 'Living Room', 'Backyard', 'Grandma\'s House', 'Beach', 
    'School', 'Park', 'Vacation Home', 'Hawaii', 'New York', 'Disney World'
  ];
  
  const availableFamilyMembers = [
    'Mom', 'Dad', 'Grandma', 'Grandpa', 'Emma', 'Jake', 
    'Uncle John', 'Aunt Sarah', 'Cousin Mike'
  ];
  
  const availableEventTypes = [
    'Birthday', 'Holiday', 'Vacation', 'School Event', 'Sports Game',
    'Graduation', 'Wedding', 'Anniversary', 'Family Reunion', 'Party'
  ];
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  const isSectionExpanded = (section: string) => {
    return expandedSections.includes(section);
  };
  
  const handleDateRangePresetChange = (preset: SearchFilters['dateRange']['preset']) => {
    const now = new Date();
    let start = '';
    let end = '';
    
    switch (preset) {
      case 'today':
        start = now.toISOString().split('T')[0];
        end = start;
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        start = yesterday.toISOString().split('T')[0];
        end = start;
        break;
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        start = weekAgo.toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        start = monthAgo.toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'year':
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        start = yearAgo.toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'all':
      default:
        start = '';
        end = '';
        break;
    }
    
    onFilterChange({
      dateRange: {
        start,
        end,
        preset
      }
    });
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.familyMembers.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.eventTypes.length > 0) count++;
    if (filters.mediaTypes.length > 0) count++;
    return count;
  };
  
  // Filter available options based on search
  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );
  
  const filteredLocations = availableLocations.filter(location => 
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );
  
  const filteredFamilyMembers = availableFamilyMembers.filter(member => 
    member.toLowerCase().includes(familyMemberSearch.toLowerCase())
  );
  
  const filteredEventTypes = availableEventTypes.filter(event => 
    event.toLowerCase().includes(eventTypeSearch.toLowerCase())
  );
  
  // If filters are not open, show a compact summary
  if (!isOpen) {
    return (
      <div className={`mb-4 ${className}`}>
        <TouchOptimized>
          <button
            onClick={onToggle}
            className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-sage-600" />
              <span className="font-medium text-gray-900">Search Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-sage-700 text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </button>
        </TouchOptimized>
        
        {/* Active Filters Summary */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.dateRange.preset !== 'all' && (
              <div className="flex items-center bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm">
                <Calendar size={14} className="mr-1" />
                <span>
                  {filters.dateRange.preset === 'today' ? 'Today' :
                   filters.dateRange.preset === 'yesterday' ? 'Yesterday' :
                   filters.dateRange.preset === 'week' ? 'Last 7 Days' :
                   filters.dateRange.preset === 'month' ? 'Last 30 Days' :
                   filters.dateRange.preset === 'year' ? 'Last 12 Months' :
                   `${filters.dateRange.start} to ${filters.dateRange.end}`}
                </span>
                <TouchOptimized>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange({
                        dateRange: { start: '', end: '', preset: 'all' }
                      });
                    }}
                    className="ml-2 text-sage-500 hover:text-sage-700"
                  >
                    <X size={14} />
                  </button>
                </TouchOptimized>
              </div>
            )}
            
            {filters.mediaTypes.length > 0 && (
              <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <Layers size={14} className="mr-1" />
                <span>
                  {filters.mediaTypes.length === 1 
                    ? filters.mediaTypes[0].charAt(0).toUpperCase() + filters.mediaTypes[0].slice(1) + 's'
                    : `${filters.mediaTypes.length} Media Types`}
                </span>
                <TouchOptimized>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange({ mediaTypes: [] });
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </TouchOptimized>
              </div>
            )}
            
            {filters.familyMembers.length > 0 && (
              <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <User size={14} className="mr-1" />
                <span>
                  {filters.familyMembers.length === 1 
                    ? filters.familyMembers[0]
                    : `${filters.familyMembers.length} People`}
                </span>
                <TouchOptimized>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange({ familyMembers: [] });
                    }}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    <X size={14} />
                  </button>
                </TouchOptimized>
              </div>
            )}
            
            {filters.tags.length > 0 && (
              <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <Tag size={14} className="mr-1" />
                <span>
                  {filters.tags.length === 1 
                    ? filters.tags[0]
                    : `${filters.tags.length} Tags`}
                </span>
                <TouchOptimized>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange({ tags: [] });
                    }}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X size={14} />
                  </button>
                </TouchOptimized>
              </div>
            )}
            
            {/* Clear All Button */}
            {getActiveFilterCount() > 1 && (
              <TouchOptimized>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFilters();
                  }}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  Clear All
                </button>
              </TouchOptimized>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Filter className="w-6 h-6 text-sage-600" />
          <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
          {getActiveFilterCount() > 0 && (
            <span className="bg-sage-700 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <TouchOptimized>
              <button
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Clear All
              </button>
            </TouchOptimized>
          )}
          
          <TouchOptimized>
            <button
              onClick={onToggle}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Date Range Section */}
        <div className="border-b border-gray-200 pb-6">
          <TouchOptimized>
            <button
              onClick={() => toggleSection('date')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">Date Range</h3>
              </div>
              {isSectionExpanded('date') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('date') && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: 'week', label: 'Last 7 Days' },
                  { id: 'month', label: 'Last 30 Days' },
                  { id: 'year', label: 'Last 12 Months' }
                ].map((preset) => (
                  <TouchOptimized key={preset.id}>
                    <button
                      onClick={() => handleDateRangePresetChange(preset.id as any)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.dateRange.preset === preset.id
                          ? 'bg-sage-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  </TouchOptimized>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => onFilterChange({
                      dateRange: { ...filters.dateRange, start: e.target.value, preset: 'custom' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => onFilterChange({
                      dateRange: { ...filters.dateRange, end: e.target.value, preset: 'custom' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Media Types Section */}
        <div className="border-b border-gray-200 pb-6">
          <TouchOptimized>
            <button
              onClick={() => toggleSection('mediaTypes')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">Media Types</h3>
              </div>
              {isSectionExpanded('mediaTypes') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('mediaTypes') && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'photo', label: 'Photos', icon: Image },
                { id: 'video', label: 'Videos', icon: Video },
                { id: 'audio', label: 'Audio', icon: Volume2 },
                { id: 'story', label: 'Stories', icon: FileText }
              ].map((type) => (
                <TouchOptimized key={type.id}>
                  <button
                    onClick={() => {
                      const mediaTypes = filters.mediaTypes.includes(type.id as any)
                        ? filters.mediaTypes.filter(t => t !== type.id)
                        : [...filters.mediaTypes, type.id as any];
                      onFilterChange({ mediaTypes });
                    }}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      filters.mediaTypes.includes(type.id as any)
                        ? 'border-sage-500 bg-sage-50 text-sage-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <type.icon size={18} />
                    <span className="text-sm">{type.label}</span>
                  </button>
                </TouchOptimized>
              ))}
            </div>
          )}
        </div>
        
        {/* Family Members Section */}
        <div className="border-b border-gray-200 pb-6">
          <TouchOptimized>
            <button
              onClick={() => toggleSection('familyMembers')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">People</h3>
              </div>
              {isSectionExpanded('familyMembers') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('familyMembers') && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={familyMemberSearch}
                  onChange={(e) => setFamilyMemberSearch(e.target.value)}
                  placeholder="Search people..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-1 p-1">
                {filteredFamilyMembers.map((member) => (
                  <TouchOptimized key={member}>
                    <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.familyMembers.includes(member)}
                        onChange={() => {
                          const familyMembers = filters.familyMembers.includes(member)
                            ? filters.familyMembers.filter(m => m !== member)
                            : [...filters.familyMembers, member];
                          onFilterChange({ familyMembers });
                        }}
                        className="rounded text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-sm text-gray-700">{member}</span>
                    </label>
                  </TouchOptimized>
                ))}
                
                {filteredFamilyMembers.length === 0 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    No people found matching "{familyMemberSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Tags Section */}
        <div className="border-b border-gray-200 pb-6">
          <TouchOptimized>
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">Tags</h3>
              </div>
              {isSectionExpanded('tags') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('tags') && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {filteredTags.map((tag) => (
                  <TouchOptimized key={tag}>
                    <button
                      onClick={() => {
                        const tags = filters.tags.includes(tag)
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag];
                        onFilterChange({ tags });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-sage-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  </TouchOptimized>
                ))}
                
                {filteredTags.length === 0 && (
                  <div className="text-center py-2 text-sm text-gray-500 w-full">
                    No tags found matching "{tagSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Locations Section */}
        <div className="border-b border-gray-200 pb-6">
          <TouchOptimized>
            <button
              onClick={() => toggleSection('locations')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">Locations</h3>
              </div>
              {isSectionExpanded('locations') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('locations') && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-1 p-1">
                {filteredLocations.map((location) => (
                  <TouchOptimized key={location}>
                    <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.locations.includes(location)}
                        onChange={() => {
                          const locations = filters.locations.includes(location)
                            ? filters.locations.filter(l => l !== location)
                            : [...filters.locations, location];
                          onFilterChange({ locations });
                        }}
                        className="rounded text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  </TouchOptimized>
                ))}
                
                {filteredLocations.length === 0 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    No locations found matching "{locationSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Event Types Section */}
        <div className="border-b border-gray-200 pb-6">
          <TouchOptimized>
            <button
              onClick={() => toggleSection('eventTypes')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">Event Types</h3>
              </div>
              {isSectionExpanded('eventTypes') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('eventTypes') && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={eventTypeSearch}
                  onChange={(e) => setEventTypeSearch(e.target.value)}
                  placeholder="Search event types..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-1 p-1">
                {filteredEventTypes.map((event) => (
                  <TouchOptimized key={event}>
                    <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.eventTypes.includes(event)}
                        onChange={() => {
                          const eventTypes = filters.eventTypes.includes(event)
                            ? filters.eventTypes.filter(e => e !== event)
                            : [...filters.eventTypes, event];
                          onFilterChange({ eventTypes });
                        }}
                        className="rounded text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-sm text-gray-700">{event}</span>
                    </label>
                  </TouchOptimized>
                ))}
                
                {filteredEventTypes.length === 0 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    No event types found matching "{eventTypeSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Sort Options */}
        <div>
          <TouchOptimized>
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-5 h-5 text-sage-600" />
                <h3 className="font-medium text-gray-900">Sort Options</h3>
              </div>
              {isSectionExpanded('sort') ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </TouchOptimized>
          
          {isSectionExpanded('sort') && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="likes">Likes</option>
                  <option value="views">Views</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <TouchOptimized>
                  <button
                    onClick={() => onFilterChange({ sortOrder: 'desc' })}
                    className={`flex-1 flex items-center justify-center space-x-1 p-2 rounded-lg border transition-colors ${
                      filters.sortOrder === 'desc'
                        ? 'border-sage-500 bg-sage-50 text-sage-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <ChevronDown size={16} />
                    <span className="text-sm">Descending</span>
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={() => onFilterChange({ sortOrder: 'asc' })}
                    className={`flex-1 flex items-center justify-center space-x-1 p-2 rounded-lg border transition-colors ${
                      filters.sortOrder === 'asc'
                        ? 'border-sage-500 bg-sage-50 text-sage-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <ChevronUp size={16} />
                    <span className="text-sm">Ascending</span>
                  </button>
                </TouchOptimized>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Apply Filters Button (Mobile Only) */}
      {isMobile && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <TouchOptimized>
            <button
              onClick={() => {
                onApplyFilters();
                onToggle();
              }}
              className="w-full bg-sage-700 text-white py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors"
            >
              Apply Filters
            </button>
          </TouchOptimized>
        </div>
      )}
    </div>
  );
}