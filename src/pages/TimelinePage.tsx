import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { SwipeNavigation } from '../components/navigation/SwipeNavigation';
import { TimelineFilters } from '../components/timeline/TimelineFilters';
import { MemoryCard } from '../components/timeline/MemoryCard';
import { InfiniteScroll } from '../components/timeline/InfiniteScroll';
import { MemoryDetailModal } from '../components/memory/MemoryDetailModal';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface Memory {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  date: string;
  location?: string;
  author: {
    name: string;
    avatar?: string;
    relationship?: string;
  };
  thumbnail?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  tags: string[];
  interactions: {
    likes: number;
    comments: number;
    views: number;
    isLiked: boolean;
    isFavorited: boolean;
  };
  aiInsights?: {
    faces: string[];
    objects: string[];
    events: string[];
    locations: string[];
    suggestedTags: string[];
    connections: string[];
  };
  privacy: 'private' | 'family' | 'public';
  isEditable: boolean;
}

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

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

export function TimelinePage() {
  const { isMobile } = useDeviceDetection();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(-1);

  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { start: '', end: '' },
    memoryTypes: [],
    familyMembers: [],
    tags: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Mock family members data
  const familyMembers: FamilyMember[] = [
    { id: 'mom1', name: 'Mom', relationship: 'Mother' },
    { id: 'dad1', name: 'Dad', relationship: 'Father' },
    { id: 'uncle1', name: 'Uncle John', relationship: 'Uncle' },
    { id: 'sarah1', name: 'Sarah', relationship: 'Daughter' },
    { id: 'emma1', name: 'Emma', relationship: 'Granddaughter' },
    { id: 'jake1', name: 'Jake', relationship: 'Grandson' }
  ];

  // Mock data - in real app this would come from your API
  const mockMemories: Memory[] = [
    {
      id: '1',
      title: 'Christmas Morning Magic 2024',
      description: 'The kids woke up at 5 AM and couldn\'t contain their excitement. The joy on their faces when they saw the presents under the tree was absolutely priceless. This is what Christmas is all about - family, love, and creating memories that will last a lifetime.',
      type: 'video',
      date: '2024-12-25T08:30:00Z',
      location: 'Living Room, Family Home',
      author: {
        name: 'Mom',
        relationship: 'Mother',
        avatar: undefined
      },
      thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800',
      fileUrl: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200',
      fileName: 'christmas-morning-2024.mp4',
      fileSize: 45678901,
      tags: ['Christmas', 'Family', 'Kids', 'Presents', 'Holiday', 'Morning'],
      interactions: {
        likes: 24,
        comments: 8,
        views: 156,
        isLiked: true,
        isFavorited: true
      },
      aiInsights: {
        faces: ['Emma', 'Jake', 'Mom', 'Dad'],
        objects: ['Christmas Tree', 'Presents', 'Fireplace', 'Stockings'],
        events: ['Christmas Morning', 'Gift Opening'],
        locations: ['Living Room'],
        suggestedTags: ['Holiday Traditions', 'Gift Exchange', 'Family Time'],
        connections: ['Christmas 2023 Morning', 'Kids Birthday Parties', 'Holiday Traditions']
      },
      privacy: 'family',
      isEditable: true
    },
    {
      id: '2',
      title: 'Four Generations Together',
      description: 'A rare and precious moment with great-grandma, grandma, mom, and little Emma all in one photo. Four generations of strong women in our family.',
      type: 'photo',
      date: '2024-12-15T14:20:00Z',
      location: 'Grandma\'s House',
      author: {
        name: 'Uncle John',
        relationship: 'Uncle',
        avatar: undefined
      },
      thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800',
      fileUrl: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1200',
      fileName: 'four-generations.jpg',
      fileSize: 2345678,
      tags: ['Family Reunion', 'Generations', 'Women', 'Legacy', 'Portrait'],
      interactions: {
        likes: 42,
        comments: 15,
        views: 203,
        isLiked: false,
        isFavorited: false
      },
      aiInsights: {
        faces: ['Great-Grandma Rose', 'Grandma Mary', 'Mom', 'Emma'],
        objects: ['Family Portrait', 'Living Room', 'Couch'],
        events: ['Family Gathering', 'Multi-generational Photo'],
        locations: ['Grandma\'s House'],
        suggestedTags: ['Matriarchy', 'Heritage', 'Wisdom'],
        connections: ['Family Reunion 2023', 'Grandma\'s 80th Birthday', 'Mother\'s Day Celebrations']
      },
      privacy: 'family',
      isEditable: false
    },
    {
      id: '3',
      title: 'Grandma\'s Childhood Stories',
      description: 'Grandma sharing her favorite memories from growing up during the 1940s. These stories are pure gold and need to be preserved for future generations.',
      type: 'audio',
      date: '2024-12-10T16:45:00Z',
      location: 'Grandma\'s Kitchen',
      author: {
        name: 'Sarah',
        relationship: 'Daughter',
        avatar: undefined
      },
      thumbnail: undefined,
      fileUrl: 'https://example.com/audio/grandma-stories.mp3',
      fileName: 'grandma-childhood-stories.mp3',
      fileSize: 12345678,
      tags: ['Grandma', 'Stories', 'History', '1940s', 'Childhood', 'Oral History'],
      interactions: {
        likes: 18,
        comments: 6,
        views: 89,
        isLiked: true,
        isFavorited: true
      },
      aiInsights: {
        faces: ['Grandma Mary'],
        objects: ['Kitchen', 'Tea Cup', 'Photo Albums'],
        events: ['Storytelling Session', 'Oral History Recording'],
        locations: ['Kitchen'],
        suggestedTags: ['Family History', 'Wisdom', 'Heritage'],
        connections: ['Grandma\'s Wedding Stories', 'Family History Project', 'Old Photo Albums']
      },
      privacy: 'family',
      isEditable: true
    }
  ];

  // Available filter options
  const availableTags = [
    'Christmas', 'Family', 'Kids', 'Birthday', 'Holiday', 'Vacation', 'Beach', 'Summer',
    'Grandma', 'Stories', 'History', 'Military', 'Wedding', 'Anniversary', 'Graduation',
    'Baby', 'Milestone', 'First Steps', 'School', 'Sports', 'Music', 'Art', 'Cooking'
  ];

  const availableMembers = familyMembers.map(member => member.name);

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [memories, filters]);

  const loadMemories = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const startIndex = (page - 1) * 6;
    const endIndex = startIndex + 6;
    const newMemories = mockMemories.slice(startIndex, endIndex);
    
    if (page === 1) {
      setMemories(newMemories);
    } else {
      setMemories(prev => [...prev, ...newMemories]);
    }
    
    setHasMore(endIndex < mockMemories.length);
    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadMemories();
    }
  };

  const applyFilters = () => {
    let filtered = [...memories];

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(memory => {
        const memoryDate = new Date(memory.date);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && memoryDate < startDate) return false;
        if (endDate && memoryDate > endDate) return false;
        return true;
      });
    }

    // Memory type filter
    if (filters.memoryTypes.length > 0) {
      filtered = filtered.filter(memory => filters.memoryTypes.includes(memory.type));
    }

    // Family member filter
    if (filters.familyMembers.length > 0) {
      filtered = filtered.filter(memory => 
        filters.familyMembers.includes(memory.author.name)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(memory =>
        filters.tags.some(tag => memory.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'relevance':
          comparison = (a.interactions.likes + a.interactions.comments) - 
                      (b.interactions.likes + b.interactions.comments);
          break;
        case 'family-member':
          comparison = a.author.name.localeCompare(b.author.name);
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredMemories(filtered);
  };

  const handleUpdateMemory = (updatedMemory: Memory) => {
    setMemories(prev => prev.map(memory => 
      memory.id === updatedMemory.id ? updatedMemory : memory
    ));
    setSelectedMemory(updatedMemory);
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== memoryId));
    setSelectedMemory(null);
  };

  const handleLike = (memoryId: string) => {
    setMemories(prev => prev.map(memory => 
      memory.id === memoryId 
        ? {
            ...memory,
            interactions: {
              ...memory.interactions,
              isLiked: !memory.interactions.isLiked,
              likes: memory.interactions.isLiked 
                ? memory.interactions.likes - 1 
                : memory.interactions.likes + 1
            }
          }
        : memory
    ));
  };

  const handleComment = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      setSelectedMemory(memory);
      setSelectedMemoryIndex(filteredMemories.findIndex(m => m.id === memoryId));
    }
  };

  const handleShare = (memoryId: string) => {
    // Implement share functionality
    console.log('Share memory:', memoryId);
  };

  const handleEdit = (memoryId: string) => {
    // Implement edit functionality
    console.log('Edit memory:', memoryId);
  };

  const handleView = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      setSelectedMemory(memory);
      setSelectedMemoryIndex(filteredMemories.findIndex(m => m.id === memoryId));
    }
  };

  const handleNextMemory = () => {
    if (selectedMemoryIndex < filteredMemories.length - 1) {
      const nextIndex = selectedMemoryIndex + 1;
      setSelectedMemory(filteredMemories[nextIndex]);
      setSelectedMemoryIndex(nextIndex);
    }
  };

  const handlePreviousMemory = () => {
    if (selectedMemoryIndex > 0) {
      const prevIndex = selectedMemoryIndex - 1;
      setSelectedMemory(filteredMemories[prevIndex]);
      setSelectedMemoryIndex(prevIndex);
    }
  };

  return (
    <SwipeNavigation className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-sage-700 p-3 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Memory Timeline</h1>
              <p className="text-lg text-gray-600 mt-1">
                Journey through your family's precious memories
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden lg:flex items-center space-x-6 bg-white rounded-xl p-4 shadow-md border border-sage-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-sage-700">{memories.length}</p>
              <p className="text-sm text-gray-600">Total Memories</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sage-700">{filteredMemories.length}</p>
              <p className="text-sm text-gray-600">Filtered Results</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sage-700">
                {memories.reduce((sum, m) => sum + m.interactions.likes, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Likes</p>
            </div>
          </div>
        </div>

        {/* Quick Stats for Mobile */}
        {isMobile && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-sage-100">
              <p className="text-xl font-bold text-sage-700">{memories.length}</p>
              <p className="text-xs text-gray-600">Memories</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-sage-100">
              <p className="text-xl font-bold text-sage-700">{filteredMemories.length}</p>
              <p className="text-xs text-gray-600">Filtered</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-sage-100">
              <p className="text-xl font-bold text-sage-700">
                {memories.reduce((sum, m) => sum + m.interactions.likes, 0)}
              </p>
              <p className="text-xs text-gray-600">Likes</p>
            </div>
          </div>
        )}

        {/* AI Insights Banner */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200 mb-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-800">AI-Enhanced Timeline</h3>
              <p className="text-purple-700 text-sm">
                Memories are automatically organized with face recognition, event detection, and smart connections
              </p>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">Smart Sorting Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TimelineFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
        availableMembers={availableMembers}
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />

      {/* Timeline Content */}
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        className="space-y-8"
      >
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onEdit={handleEdit}
                onView={handleView}
                className="hover:scale-[1.02] transition-transform duration-200"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-sage-50 rounded-2xl p-12 border border-sage-100">
              <div className="w-24 h-24 bg-sage-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Filter className="w-12 h-12 text-sage-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No memories found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search criteria to find the memories you're looking for.
              </p>
              <TouchOptimized>
                <button
                  onClick={() => setFilters({
                    dateRange: { start: '', end: '' },
                    memoryTypes: [],
                    familyMembers: [],
                    tags: [],
                    sortBy: 'date',
                    sortOrder: 'desc'
                  })}
                  className="bg-sage-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sage-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </TouchOptimized>
            </div>
          </div>
        )}
      </InfiniteScroll>

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          isOpen={!!selectedMemory}
          onClose={() => {
            setSelectedMemory(null);
            setSelectedMemoryIndex(-1);
          }}
          onUpdate={handleUpdateMemory}
          onDelete={handleDeleteMemory}
          onNext={selectedMemoryIndex < filteredMemories.length - 1 ? handleNextMemory : undefined}
          onPrevious={selectedMemoryIndex > 0 ? handlePreviousMemory : undefined}
          hasNext={selectedMemoryIndex < filteredMemories.length - 1}
          hasPrevious={selectedMemoryIndex > 0}
          familyMembers={familyMembers}
        />
      )}
    </SwipeNavigation>
  );
}