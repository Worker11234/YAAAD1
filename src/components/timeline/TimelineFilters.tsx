import React, { useState } from 'react';
import { Calendar, Filter, Tag, User, X, Search, ChevronDown } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { SwipeGestures } from '../ui/SwipeGestures';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  memoryTypes: string[];
  familyMembers: string[];
  tags: string[];
  sortBy: 'date' | 'relevance' | 'family-member';
  sortOrder: 'desc' | 'asc';
}

interface TimelineFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
  availableMembers: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export function TimelineFilters({ 
  filters, 
  onFiltersChange, 
  availableTags, 
  availableMembers,
  isOpen,
  onToggle 
}: TimelineFiltersProps) {
  const { isMobile } = useDeviceDetection();
  const [tagSearch, setTagSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  const memoryTypes = [
    { id: 'photo', label: 'Photos', color: 'bg-blue-100 text-blue-700' },
    { id: 'video', label: 'Videos', color: 'bg-purple-100 text-purple-700' },
    { id: 'audio', label: 'Audio', color: 'bg-green-100 text-green-700' },
    { id: 'story', label: 'Stories', color: 'bg-orange-100 text-orange-700' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'relevance', label: 'Relevance' },
    { value: 'family-member', label: 'Family Member' }
  ];

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleMemoryType = (type: string) => {
    const updated = filters.memoryTypes.includes(type)
      ? filters.memoryTypes.filter(t => t !== type)
      : [...filters.memoryTypes, type];
    updateFilters({ memoryTypes: updated });
  };

  const toggleFamilyMember = (member: string) => {
    const updated = filters.familyMembers.includes(member)
      ? filters.familyMembers.filter(m => m !== member)
      : [...filters.familyMembers, member];
    updateFilters({ familyMembers: updated });
  };

  const toggleTag = (tag: string) => {
    const updated = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: updated });
  };

  const clearAllFilters = () => {
    updateFilters({
      dateRange: { start: '', end: '' },
      memoryTypes: [],
      familyMembers: [],
      tags: [],
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = 
    filters.dateRange.start || 
    filters.dateRange.end || 
    filters.memoryTypes.length > 0 || 
    filters.familyMembers.length > 0 || 
    filters.tags.length > 0;

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const filteredMembers = availableMembers.filter(member => 
    member.toLowerCase().includes(memberSearch.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <TouchOptimized>
            <button
              onClick={onToggle}
              className="flex items-center space-x-2 bg-white border-2 border-sage-200 px-4 py-3 rounded-xl hover:border-sage-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              <Filter size={20} className="text-sage-600" />
              <span className="font-medium text-gray-700">Filters</span>
              {hasActiveFilters && (
                <span className="bg-sage-700 text-white text-xs px-2 py-1 rounded-full">
                  {[
                    filters.memoryTypes.length,
                    filters.familyMembers.length,
                    filters.tags.length,
                    filters.dateRange.start || filters.dateRange.end ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          </TouchOptimized>

          {/* Quick Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
                updateFilters({ sortBy, sortOrder });
              }}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            >
              {sortOptions.map(option => (
                <React.Fragment key={option.value}>
                  <option value={`${option.value}-desc`}>{option.label} (Newest)</option>
                  <option value={`${option.value}-asc`}>{option.label} (Oldest)</option>
                </React.Fragment>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.memoryTypes.map(type => (
              <TouchOptimized key={type}>
                <span className="inline-flex items-center bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm">
                  {memoryTypes.find(t => t.id === type)?.label}
                  <button
                    onClick={() => toggleMemoryType(type)}
                    className="ml-2 text-sage-500 hover:text-sage-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              </TouchOptimized>
            ))}
            {filters.familyMembers.map(member => (
              <TouchOptimized key={member}>
                <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {member}
                  <button
                    onClick={() => toggleFamilyMember(member)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              </TouchOptimized>
            ))}
            {filters.tags.map(tag => (
              <TouchOptimized key={tag}>
                <span className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              </TouchOptimized>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-sage-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-sage-700" />
            <h3 className="text-xl font-bold text-gray-900">Filter & Sort Memories</h3>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <TouchOptimized>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </TouchOptimized>
            )}
            <TouchOptimized>
              <button
                onClick={onToggle}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </TouchOptimized>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Calendar className="inline w-5 h-5 mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateFilters({ 
                      dateRange: { ...filters.dateRange, start: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateFilters({ 
                      dateRange: { ...filters.dateRange, end: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
              </div>
            </div>

            {/* Memory Types */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Memory Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {memoryTypes.map(type => (
                  <TouchOptimized key={type.id}>
                    <button
                      onClick={() => toggleMemoryType(type.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        filters.memoryTypes.includes(type.id)
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${type.color}`}>
                        {type.label}
                      </span>
                      <p className="text-sm text-gray-600">
                        Include {type.label.toLowerCase()} in results
                      </p>
                    </button>
                  </TouchOptimized>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Sort & Order
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sort by</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value as typeof filters.sortBy })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <TouchOptimized>
                    <button
                      onClick={() => updateFilters({ sortOrder: 'desc' })}
                      className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                        filters.sortOrder === 'desc'
                          ? 'border-sage-500 bg-sage-50 text-sage-700'
                          : 'border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      Newest First
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button
                      onClick={() => updateFilters({ sortOrder: 'asc' })}
                      className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                        filters.sortOrder === 'asc'
                          ? 'border-sage-500 bg-sage-50 text-sage-700'
                          : 'border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      Oldest First
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Family Members */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <User className="inline w-5 h-5 mr-2" />
                Family Members
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search family members..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
                <SwipeGestures className="max-h-32 overflow-y-auto space-y-1">
                  {filteredMembers.map(member => (
                    <TouchOptimized key={member}>
                      <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sage-25 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.familyMembers.includes(member)}
                          onChange={() => toggleFamilyMember(member)}
                          className="w-4 h-4 text-sage-600 border-2 border-gray-300 rounded focus:ring-sage-500"
                        />
                        <span className="text-sm text-gray-700">{member}</span>
                      </label>
                    </TouchOptimized>
                  ))}
                </SwipeGestures>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Tag className="inline w-5 h-5 mr-2" />
                Tags
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
                <SwipeGestures className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map(tag => (
                      <TouchOptimized key={tag}>
                        <button
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            filters.tags.includes(tag)
                              ? 'bg-sage-700 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700'
                          }`}
                        >
                          #{tag}
                        </button>
                      </TouchOptimized>
                    ))}
                  </div>
                </SwipeGestures>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
            </p>
            <TouchOptimized>
              <button
                onClick={onToggle}
                className="bg-sage-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sage-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                Apply Filters
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    </div>
  );
}