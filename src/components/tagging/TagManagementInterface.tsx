import React, { useState, useEffect } from 'react';
import { 
  Tag, Search, Plus, Edit2, Trash2, ChevronRight, 
  ChevronDown, Filter, Save, X, Check, AlertTriangle,
  User, MapPin, Calendar, Image, Smile, FileText
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface TagManagementInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tags: TagCategory[]) => void;
}

interface TagItem {
  id: string;
  name: string;
  count: number;
  color?: string;
  parent?: string;
  isEditing?: boolean;
  isNew?: boolean;
}

interface TagCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  tags: TagItem[];
  isExpanded?: boolean;
}

export function TagManagementInterface({ 
  isOpen, 
  onClose,
  onSave
}: TagManagementInterfaceProps) {
  const { isMobile } = useDeviceDetection();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  
  // Initialize with mock data
  useEffect(() => {
    if (isOpen) {
      const initialCategories: TagCategory[] = [
        {
          id: 'people',
          name: 'People',
          icon: <User size={20} className="text-blue-600" />,
          tags: [
            { id: 'p1', name: 'Family', count: 42, color: '#3b82f6' },
            { id: 'p2', name: 'Kids', count: 28, color: '#3b82f6' },
            { id: 'p3', name: 'Grandparents', count: 15, color: '#3b82f6' },
            { id: 'p4', name: 'Friends', count: 12, color: '#3b82f6' },
            { id: 'p5', name: 'Cousins', count: 8, color: '#3b82f6', parent: 'p1' }
          ],
          isExpanded: true
        },
        {
          id: 'locations',
          name: 'Locations',
          icon: <MapPin size={20} className="text-green-600" />,
          tags: [
            { id: 'l1', name: 'Home', count: 36, color: '#10b981' },
            { id: 'l2', name: 'Vacation', count: 24, color: '#10b981' },
            { id: 'l3', name: 'Beach', count: 18, color: '#10b981', parent: 'l2' },
            { id: 'l4', name: 'Mountains', count: 12, color: '#10b981', parent: 'l2' },
            { id: 'l5', name: 'School', count: 10, color: '#10b981' }
          ],
          isExpanded: false
        },
        {
          id: 'events',
          name: 'Events',
          icon: <Calendar size={20} className="text-orange-600" />,
          tags: [
            { id: 'e1', name: 'Birthday', count: 32, color: '#f97316' },
            { id: 'e2', name: 'Holiday', count: 28, color: '#f97316' },
            { id: 'e3', name: 'Christmas', count: 16, color: '#f97316', parent: 'e2' },
            { id: 'e4', name: 'Thanksgiving', count: 8, color: '#f97316', parent: 'e2' },
            { id: 'e5', name: 'Graduation', count: 6, color: '#f97316' }
          ],
          isExpanded: false
        },
        {
          id: 'objects',
          name: 'Objects',
          icon: <Image size={20} className="text-yellow-600" />,
          tags: [
            { id: 'o1', name: 'Food', count: 24, color: '#eab308' },
            { id: 'o2', name: 'Pets', count: 18, color: '#eab308' },
            { id: 'o3', name: 'Toys', count: 14, color: '#eab308' },
            { id: 'o4', name: 'Cars', count: 8, color: '#eab308' },
            { id: 'o5', name: 'Cake', count: 12, color: '#eab308', parent: 'o1' }
          ],
          isExpanded: false
        },
        {
          id: 'emotions',
          name: 'Emotions',
          icon: <Smile size={20} className="text-pink-600" />,
          tags: [
            { id: 'em1', name: 'Happy', count: 38, color: '#ec4899' },
            { id: 'em2', name: 'Excited', count: 22, color: '#ec4899' },
            { id: 'em3', name: 'Surprised', count: 14, color: '#ec4899' },
            { id: 'em4', name: 'Peaceful', count: 10, color: '#ec4899' },
            { id: 'em5', name: 'Proud', count: 8, color: '#ec4899' }
          ],
          isExpanded: false
        }
      ];
      
      setCategories(initialCategories);
      setSelectedCategory(initialCategories[0].id);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ));
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddTag = (categoryId: string) => {
    if (!newTagName.trim()) return;
    
    const newTag: TagItem = {
      id: `new-${Date.now()}`,
      name: newTagName.trim(),
      count: 0,
      color: getCategoryColor(categoryId),
      isNew: true
    };
    
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? { ...category, tags: [...category.tags, newTag] }
        : category
    ));
    
    setNewTagName('');
    setHasChanges(true);
  };

  const handleEditTag = (categoryId: string, tagId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? {
            ...category,
            tags: category.tags.map(tag => 
              tag.id === tagId
                ? { ...tag, isEditing: true }
                : tag
            )
          }
        : category
    ));
  };

  const handleUpdateTagName = (categoryId: string, tagId: string, newName: string) => {
    if (!newName.trim()) return;
    
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? {
            ...category,
            tags: category.tags.map(tag => 
              tag.id === tagId
                ? { ...tag, name: newName.trim(), isEditing: false }
                : tag
            )
          }
        : category
    ));
    
    setHasChanges(true);
  };

  const handleCancelEdit = (categoryId: string, tagId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? {
            ...category,
            tags: category.tags.map(tag => 
              tag.id === tagId
                ? { ...tag, isEditing: false }
                : tag
            )
          }
        : category
    ));
  };

  const handleDeleteTag = (categoryId: string, tagId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId
        ? {
            ...category,
            tags: category.tags.filter(tag => tag.id !== tagId)
          }
        : category
    ));
    
    setShowDeleteConfirm(null);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    onSave(categories);
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedChanges(true);
    } else {
      onClose();
    }
  };

  const getCategoryColor = (categoryId: string): string => {
    switch (categoryId) {
      case 'people': return '#3b82f6'; // blue
      case 'locations': return '#10b981'; // green
      case 'events': return '#f97316'; // orange
      case 'objects': return '#eab308'; // yellow
      case 'emotions': return '#ec4899'; // pink
      default: return '#6b7280'; // gray
    }
  };

  const getFilteredTags = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    return searchQuery
      ? category.tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : category.tags;
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

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
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Tag Management</h2>
              <p className="text-sm text-gray-600">Organize and manage your memory tags</p>
            </div>
          </div>
          
          <TouchOptimized>
            <button
              onClick={handleClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </TouchOptimized>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-64 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Search tags..."
                />
              </div>
              
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id}>
                    <TouchOptimized>
                      <button
                        onClick={() => handleToggleCategory(category.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span className="font-medium text-gray-900">{category.name}</span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                            {category.tags.length}
                          </span>
                        </div>
                        {category.isExpanded ? (
                          <ChevronDown size={18} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-500" />
                        )}
                      </button>
                    </TouchOptimized>
                    
                    {category.isExpanded && (
                      <div className="ml-8 mt-2 space-y-1">
                        {category.tags
                          .filter(tag => !tag.parent)
                          .map(tag => (
                            <div key={tag.id}>
                              <TouchOptimized>
                                <button
                                  onClick={() => {
                                    handleSelectCategory(category.id);
                                  }}
                                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                                    selectedCategory === category.id
                                      ? 'bg-sage-100 text-sage-700'
                                      : 'hover:bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{tag.name}</span>
                                    <span className="text-xs text-gray-500">{tag.count}</span>
                                  </div>
                                </button>
                              </TouchOptimized>
                              
                              {/* Child tags */}
                              {category.tags
                                .filter(childTag => childTag.parent === tag.id)
                                .map(childTag => (
                                  <TouchOptimized key={childTag.id}>
                                    <button
                                      onClick={() => {
                                        handleSelectCategory(category.id);
                                      }}
                                      className={`w-full text-left p-2 pl-4 rounded-lg transition-colors ${
                                        selectedCategory === category.id
                                          ? 'bg-sage-50 text-sage-700'
                                          : 'hover:bg-gray-50 text-gray-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">└ {childTag.name}</span>
                                        <span className="text-xs text-gray-500">{childTag.count}</span>
                                      </div>
                                    </button>
                                  </TouchOptimized>
                                ))}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Content - Tag List */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Category Header */}
            {selectedCategoryData && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedCategoryData.icon}
                    <h3 className="text-xl font-semibold text-gray-900">{selectedCategoryData.name} Tags</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TouchOptimized>
                      <button
                        onClick={() => {
                          // Implement bulk actions
                        }}
                        className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Filter size={20} />
                      </button>
                    </TouchOptimized>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tag List */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedCategoryData && (
                <>
                  {/* Add New Tag */}
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag(selectedCategoryData.id)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                        placeholder={`Add new ${selectedCategoryData.name.toLowerCase()} tag...`}
                      />
                      <TouchOptimized>
                        <button
                          onClick={() => handleAddTag(selectedCategoryData.id)}
                          disabled={!newTagName.trim()}
                          className="bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </TouchOptimized>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="space-y-3">
                    {getFilteredTags(selectedCategoryData.id).length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                          {searchQuery 
                            ? `No ${selectedCategoryData.name.toLowerCase()} tags found matching "${searchQuery}"`
                            : `No ${selectedCategoryData.name.toLowerCase()} tags yet`}
                        </p>
                      </div>
                    ) : (
                      getFilteredTags(selectedCategoryData.id).map(tag => (
                        <div 
                          key={tag.id} 
                          className="p-3 rounded-lg border border-gray-200 hover:border-sage-300 transition-colors"
                        >
                          {tag.isEditing ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                defaultValue={tag.name}
                                autoFocus
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateTagName(
                                      selectedCategoryData.id, 
                                      tag.id, 
                                      e.currentTarget.value
                                    );
                                  }
                                }}
                              />
                              <TouchOptimized>
                                <button
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousSibling as HTMLInputElement;
                                    handleUpdateTagName(selectedCategoryData.id, tag.id, input.value);
                                  }}
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Check size={18} />
                                </button>
                              </TouchOptimized>
                              <TouchOptimized>
                                <button
                                  onClick={() => handleCancelEdit(selectedCategoryData.id, tag.id)}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              </TouchOptimized>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: tag.color }}
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{tag.name}</p>
                                  {tag.parent && (
                                    <p className="text-xs text-gray-500">
                                      Child of: {selectedCategoryData.tags.find(t => t.id === tag.parent)?.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">{tag.count} memories</span>
                                
                                <div className="flex items-center space-x-1">
                                  <TouchOptimized>
                                    <button
                                      onClick={() => handleEditTag(selectedCategoryData.id, tag.id)}
                                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                  </TouchOptimized>
                                  <TouchOptimized>
                                    <button
                                      onClick={() => setShowDeleteConfirm(tag.id)}
                                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </TouchOptimized>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Action Bar */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {hasChanges ? 'You have unsaved changes' : 'No changes to save'}
                </div>
                <div className="flex space-x-3">
                  <TouchOptimized>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button
                      onClick={handleSaveChanges}
                      disabled={!hasChanges}
                      className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                    >
                      <Save size={18} />
                      <span>Save Changes</span>
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Tag?</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this tag? This will remove it from all associated memories.
            </p>
            
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={() => selectedCategory && handleDeleteTag(selectedCategory, showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Tag
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
      
      {/* Unsaved Changes Confirmation */}
      {showUnsavedChanges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to leave without saving?
            </p>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowUnsavedChanges(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={() => {
                    setShowUnsavedChanges(false);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Discard Changes
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={() => {
                    handleSaveChanges();
                    setShowUnsavedChanges(false);
                  }}
                  className="px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors"
                >
                  Save Changes
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}