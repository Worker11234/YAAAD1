import React, { useState } from 'react';
import { 
  Tag, Check, X, Search, Filter, Loader2, 
  ChevronDown, ChevronUp, Save, AlertTriangle
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Memory {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  thumbnail?: string;
  tags: string[];
  date: string;
}

interface BulkTagEditorProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  availableTags: string[];
  onSave: (updatedMemories: Memory[]) => void;
}

export function BulkTagEditor({
  isOpen,
  onClose,
  memories,
  availableTags,
  onSave
}: BulkTagEditorProps) {
  const { isMobile } = useDeviceDetection();
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');
  const [newTagName, setNewTagName] = useState('');

  if (!isOpen) return null;

  const filteredMemories = memories
    .filter(memory => 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
    });

  const filteredTags = availableTags
    .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const handleToggleMemory = (memoryId: string) => {
    setSelectedMemories(prev => 
      prev.includes(memoryId)
        ? prev.filter(id => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleToggleAllMemories = () => {
    if (selectedMemories.length === filteredMemories.length) {
      setSelectedMemories([]);
    } else {
      setSelectedMemories(filteredMemories.map(memory => memory.id));
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddNewTag = () => {
    if (!newTagName.trim() || availableTags.includes(newTagName.trim())) return;
    
    // Add to selected tags
    setSelectedTags(prev => [...prev, newTagName.trim()]);
    setNewTagName('');
  };

  const handleApplyTags = () => {
    if (selectedMemories.length === 0 || selectedTags.length === 0) return;
    
    setShowConfirmation(true);
  };

  const handleConfirmApply = () => {
    setIsProcessing(true);
    
    // Update memories with selected tags
    const updatedMemories = memories.map(memory => {
      if (selectedMemories.includes(memory.id)) {
        // Add selected tags that aren't already present
        const updatedTags = [...memory.tags];
        selectedTags.forEach(tag => {
          if (!updatedTags.includes(tag)) {
            updatedTags.push(tag);
          }
        });
        
        return { ...memory, tags: updatedTags };
      }
      return memory;
    });
    
    // Simulate processing delay
    setTimeout(() => {
      onSave(updatedMemories);
      setIsProcessing(false);
      onClose();
    }, 1000);
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
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-sage-100 p-2 rounded-lg">
              <Tag className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Bulk Tag Editor</h2>
              <p className="text-sm text-gray-600">Apply tags to multiple memories at once</p>
            </div>
          </div>
          
          <TouchOptimized>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </TouchOptimized>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side - Memories */}
          <div className="lg:w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Select Memories</h3>
                <TouchOptimized>
                  <button
                    onClick={handleToggleAllMemories}
                    className="text-sm text-sage-600 hover:text-sage-700 transition-colors"
                  >
                    {selectedMemories.length === filteredMemories.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </TouchOptimized>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="Search memories..."
                  />
                </div>
                
                <TouchOptimized>
                  <button
                    onClick={() => {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {sortOrder === 'asc' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-gray-700"
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="type">Type</option>
                  </select>
                </TouchOptimized>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{filteredMemories.length} memories</span>
                <span>{selectedMemories.length} selected</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {filteredMemories.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No memories found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMemories.map(memory => (
                    <TouchOptimized key={memory.id}>
                      <div
                        onClick={() => handleToggleMemory(memory.id)}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedMemories.includes(memory.id)
                            ? 'bg-sage-50 border-sage-300'
                            : 'bg-white border-gray-200 hover:border-sage-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {memory.thumbnail ? (
                              <img 
                                src={memory.thumbnail} 
                                alt={memory.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                {getMemoryTypeIcon(memory.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 truncate">{memory.title}</h4>
                                <p className="text-xs text-gray-500">
                                  {new Date(memory.date).toLocaleDateString()} • {memory.type}
                                </p>
                              </div>
                              
                              <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                                selectedMemories.includes(memory.id)
                                  ? 'bg-sage-600 border-sage-600 flex items-center justify-center'
                                  : 'border-gray-300'
                              }`}>
                                {selectedMemories.includes(memory.id) && (
                                  <Check size={14} className="text-white" />
                                )}
                              </div>
                            </div>
                            
                            {memory.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {memory.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {memory.tags.length > 3 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    +{memory.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TouchOptimized>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Tags */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Select Tags to Apply</h3>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Search tags..."
                />
              </div>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNewTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Create new tag..."
                />
                <TouchOptimized>
                  <button
                    onClick={handleAddNewTag}
                    disabled={!newTagName.trim() || availableTags.includes(newTagName.trim())}
                    className="bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </TouchOptimized>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{filteredTags.length} available tags</span>
                <span>{selectedTags.length} selected</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {filteredTags.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No tags found</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <TouchOptimized key={tag}>
                      <button
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-sage-700 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    </TouchOptimized>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedMemories.length > 0 && selectedTags.length > 0
                    ? `Apply ${selectedTags.length} tags to ${selectedMemories.length} memories`
                    : 'Select memories and tags to continue'}
                </div>
                <div className="flex space-x-3">
                  <TouchOptimized>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button
                      onClick={handleApplyTags}
                      disabled={selectedMemories.length === 0 || selectedTags.length === 0 || isProcessing}
                      className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Apply Tags</span>
                        </>
                      )}
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Bulk Tag Update</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              You are about to apply the following tags to {selectedMemories.length} memories:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={handleConfirmApply}
                  className="px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors"
                >
                  Confirm
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}