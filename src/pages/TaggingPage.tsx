import React, { useState } from 'react';
import { 
  Sparkles, Tag, User, MapPin, Calendar, Image, 
  Smile, FileText, Filter, Plus, Settings, 
  BarChart2, Layers, Zap, Search, Trash2
} from 'lucide-react';
import { AITaggingInterface } from '../components/tagging/AITaggingInterface';
import { TagManagementInterface } from '../components/tagging/TagManagementInterface';
import { TagSuggestionCarousel } from '../components/tagging/TagSuggestionCarousel';
import { FaceRecognitionOverlay } from '../components/tagging/FaceRecognitionOverlay';
import { TagHierarchyView } from '../components/tagging/TagHierarchyView';
import { BulkTagEditor } from '../components/tagging/BulkTagEditor';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface Memory {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  thumbnail?: string;
  fileUrl?: string;
  tags: string[];
  date: string;
}

interface TagSuggestion {
  id: string;
  name: string;
  category: 'people' | 'objects' | 'locations' | 'events' | 'emotions';
  confidence: number;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

export function TaggingPage() {
  const { isMobile } = useDeviceDetection();
  const [showAITagging, setShowAITagging] = useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [showBulkTagEditor, setShowBulkTagEditor] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const memories: Memory[] = [
    {
      id: '1',
      title: 'Christmas Morning 2024',
      type: 'photo',
      thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Christmas', 'Family', 'Holiday'],
      date: '2024-12-25'
    },
    {
      id: '2',
      title: 'Family Reunion',
      type: 'photo',
      thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Family', 'Reunion', 'Summer'],
      date: '2024-07-15'
    },
    {
      id: '3',
      title: 'Grandma\'s Birthday',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Birthday', 'Grandma', 'Celebration'],
      date: '2024-06-10'
    },
    {
      id: '4',
      title: 'Beach Vacation',
      type: 'photo',
      thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Vacation', 'Beach', 'Summer'],
      date: '2024-08-05'
    },
    {
      id: '5',
      title: 'Grandpa\'s Stories',
      type: 'audio',
      tags: ['Grandpa', 'Stories', 'History'],
      date: '2024-05-20'
    },
    {
      id: '6',
      title: 'First Day of School',
      type: 'photo',
      thumbnail: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['School', 'Kids', 'Milestone'],
      date: '2024-09-01'
    }
  ];

  const familyMembers: FamilyMember[] = [
    { id: 'mom1', name: 'Mom', relationship: 'Mother' },
    { id: 'dad1', name: 'Dad', relationship: 'Father' },
    { id: 'grandma1', name: 'Grandma', relationship: 'Grandmother' },
    { id: 'grandpa1', name: 'Grandpa', relationship: 'Grandfather' },
    { id: 'emma1', name: 'Emma', relationship: 'Daughter' },
    { id: 'jake1', name: 'Jake', relationship: 'Son' }
  ];

  const tagSuggestions: TagSuggestion[] = [
    { id: '1', name: 'Christmas Tree', category: 'objects', confidence: 0.96 },
    { id: '2', name: 'Winter', category: 'events', confidence: 0.92 },
    { id: '3', name: 'Living Room', category: 'locations', confidence: 0.89 },
    { id: '4', name: 'Joy', category: 'emotions', confidence: 0.94 },
    { id: '5', name: 'Uncle John', category: 'people', confidence: 0.85 }
  ];

  const availableTags = [
    'Family', 'Kids', 'Vacation', 'Beach', 'Birthday', 'Holiday', 
    'Christmas', 'Thanksgiving', 'Summer', 'Winter', 'School',
    'Graduation', 'Wedding', 'Anniversary', 'Baby', 'Pets',
    'Travel', 'Food', 'Sports', 'Music', 'Art', 'Nature',
    'Home', 'Friends', 'Celebration', 'Milestone'
  ];

  const tagCategories = [
    { id: 'people', name: 'People', icon: <User size={20} className="text-blue-600" /> },
    { id: 'locations', name: 'Locations', icon: <MapPin size={20} className="text-green-600" /> },
    { id: 'events', name: 'Events', icon: <Calendar size={20} className="text-orange-600" /> },
    { id: 'objects', name: 'Objects', icon: <Image size={20} className="text-yellow-600" /> },
    { id: 'emotions', name: 'Emotions', icon: <Smile size={20} className="text-pink-600" /> }
  ];

  const filteredMemories = memories.filter(memory => {
    // Apply search filter
    if (searchQuery && !memory.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Apply category filter
    if (activeFilter && !memory.tags.includes(activeFilter)) {
      return false;
    }
    
    return true;
  });

  const handleOpenAITagging = (memory: Memory) => {
    setSelectedMemory(memory);
    setShowAITagging(true);
  };

  const handleSaveAITags = (updatedMemory: Memory) => {
    // In a real app, you would update the memory in your database
    console.log('Saving AI tags for memory:', updatedMemory);
  };

  const handleSaveTagManagement = (updatedCategories: any[]) => {
    // In a real app, you would update the tag categories in your database
    console.log('Saving tag categories:', updatedCategories);
  };

  const handleSaveBulkTags = (updatedMemories: Memory[]) => {
    // In a real app, you would update the memories in your database
    console.log('Saving bulk tag updates:', updatedMemories);
  };

  const handleAcceptTagSuggestion = (suggestion: TagSuggestion) => {
    console.log('Accepted tag suggestion:', suggestion);
  };

  const handleRejectTagSuggestion = (suggestion: TagSuggestion) => {
    console.log('Rejected tag suggestion:', suggestion);
  };

  const getMemoryTypeIcon = (type: Memory['type']) => {
    switch (type) {
      case 'photo': return '📷';
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'story': return '📝';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-600 p-3 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Tagging</h1>
            <p className="text-lg text-gray-600">
              Organize your memories with intelligent tagging
            </p>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search memories or tags..."
              />
            </div>
            
            <TouchOptimized>
              <button
                onClick={() => setShowTagManagement(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors"
              >
                <Tag size={18} />
                <span>Manage Tags</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => setShowBulkTagEditor(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Layers size={18} />
                <span>Bulk Edit</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Tag Categories */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">Tag Categories</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <TouchOptimized>
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === null
                  ? 'bg-sage-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tags
            </button>
          </TouchOptimized>
          
          {tagCategories.map(category => (
            <TouchOptimized key={category.id}>
              <button
                onClick={() => setActiveFilter(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === category.name
                    ? 'bg-sage-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            </TouchOptimized>
          ))}
        </div>
      </div>
      
      {/* Tag Suggestions Carousel */}
      <div className="mb-8">
        <TagSuggestionCarousel
          suggestions={tagSuggestions}
          onAccept={handleAcceptTagSuggestion}
          onReject={handleRejectTagSuggestion}
        />
      </div>
      
      {/* Memory Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Memories</h2>
          <span className="text-sm text-gray-600">{filteredMemories.length} memories</span>
        </div>
        
        {filteredMemories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Memories Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No memories match your search for "${searchQuery}"`
                : activeFilter
                ? `No memories with the tag "${activeFilter}"`
                : 'No memories available'}
            </p>
            {(searchQuery || activeFilter) && (
              <TouchOptimized>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter(null);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear Filters
                </button>
              </TouchOptimized>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map(memory => (
              <TouchOptimized key={memory.id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {memory.thumbnail ? (
                      <img
                        src={memory.thumbnail}
                        alt={memory.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-4xl">
                        {getMemoryTypeIcon(memory.type)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {memory.type}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{memory.title}</h3>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {memory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(memory.date).toLocaleDateString()}
                      </span>
                      
                      <TouchOptimized>
                        <button
                          onClick={() => handleOpenAITagging(memory)}
                          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm transition-colors"
                        >
                          <Zap size={14} />
                          <span>AI Tag</span>
                        </button>
                      </TouchOptimized>
                    </div>
                  </div>
                </div>
              </TouchOptimized>
            ))}
          </div>
        )}
      </div>
      
      {/* Tag Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart2 className="w-6 h-6 text-sage-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tag Statistics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Most Used Tags</h3>
            <ol className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Family</span>
                <span className="bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full text-xs">42</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Vacation</span>
                <span className="bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full text-xs">28</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Birthday</span>
                <span className="bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full text-xs">24</span>
              </li>
            </ol>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Recently Added Tags</h3>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">School Play</span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Camping Trip</span>
                <span className="text-xs text-gray-500">5 days ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Soccer Game</span>
                <span className="text-xs text-gray-500">1 week ago</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">AI-Generated Tags</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Accuracy Rate</span>
              <span className="text-green-600 font-medium">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Based on your feedback on 156 AI tag suggestions
            </p>
          </div>
        </div>
      </div>
      
      {/* Tag Hierarchy */}
      <div className="mb-8">
        <TagHierarchyView
          tags={[
            {
              id: 'family',
              name: 'Family',
              count: 42,
              color: '#3b82f6',
              children: [
                { id: 'parents', name: 'Parents', count: 24, color: '#3b82f6' },
                { id: 'siblings', name: 'Siblings', count: 18, color: '#3b82f6' },
                { id: 'grandparents', name: 'Grandparents', count: 15, color: '#3b82f6' }
              ]
            },
            {
              id: 'vacation',
              name: 'Vacation',
              count: 28,
              color: '#10b981',
              children: [
                { id: 'beach', name: 'Beach', count: 16, color: '#10b981' },
                { id: 'mountains', name: 'Mountains', count: 8, color: '#10b981' },
                { id: 'camping', name: 'Camping', count: 4, color: '#10b981' }
              ]
            }
          ]}
          onUpdateTag={(tagId, newName) => console.log('Update tag:', tagId, newName)}
          onDeleteTag={(tagId) => console.log('Delete tag:', tagId)}
          onAddChildTag={(parentId, name) => console.log('Add child tag:', parentId, name)}
          onMoveTag={(tagId, newParentId) => console.log('Move tag:', tagId, 'to', newParentId)}
        />
      </div>
      
      {/* AI Tagging Modal */}
      {showAITagging && selectedMemory && (
        <AITaggingInterface
          isOpen={showAITagging}
          onClose={() => setShowAITagging(false)}
          memory={selectedMemory}
          onSave={handleSaveAITags}
          familyMembers={familyMembers}
        />
      )}
      
      {/* Tag Management Modal */}
      {showTagManagement && (
        <TagManagementInterface
          isOpen={showTagManagement}
          onClose={() => setShowTagManagement(false)}
          onSave={handleSaveTagManagement}
        />
      )}
      
      {/* Bulk Tag Editor Modal */}
      {showBulkTagEditor && (
        <BulkTagEditor
          isOpen={showBulkTagEditor}
          onClose={() => setShowBulkTagEditor(false)}
          memories={memories}
          availableTags={availableTags}
          onSave={handleSaveBulkTags}
        />
      )}
    </div>
  );
}