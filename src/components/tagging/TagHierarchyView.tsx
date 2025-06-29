import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, Tag, Edit2, Trash2, 
  Plus, Check, X, AlertTriangle, FolderPlus
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface TagNode {
  id: string;
  name: string;
  count: number;
  color?: string;
  children?: TagNode[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

interface TagHierarchyViewProps {
  tags: TagNode[];
  onUpdateTag: (tagId: string, newName: string) => void;
  onDeleteTag: (tagId: string) => void;
  onAddChildTag: (parentId: string, name: string) => void;
  onMoveTag: (tagId: string, newParentId: string | null) => void;
  className?: string;
}

export function TagHierarchyView({
  tags,
  onUpdateTag,
  onDeleteTag,
  onAddChildTag,
  onMoveTag,
  className = ''
}: TagHierarchyViewProps) {
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [newChildName, setNewChildName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [draggedTag, setDraggedTag] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const toggleExpand = (tagId: string) => {
    setExpandedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleStartEdit = (tagId: string, currentName: string) => {
    setEditingTag(tagId);
    setNewTagName(currentName);
  };

  const handleSaveEdit = (tagId: string) => {
    if (newTagName.trim()) {
      onUpdateTag(tagId, newTagName.trim());
    }
    setEditingTag(null);
    setNewTagName('');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
  };

  const handleStartAddChild = (tagId: string) => {
    setAddingChildTo(tagId);
    setNewChildName('');
  };

  const handleAddChild = (parentId: string) => {
    if (newChildName.trim()) {
      onAddChildTag(parentId, newChildName.trim());
    }
    setAddingChildTo(null);
    setNewChildName('');
  };

  const handleCancelAddChild = () => {
    setAddingChildTo(null);
    setNewChildName('');
  };

  const handleConfirmDelete = (tagId: string) => {
    onDeleteTag(tagId);
    setShowDeleteConfirm(null);
  };

  const handleDragStart = (e: React.DragEvent, tagId: string) => {
    setDraggedTag(tagId);
    e.dataTransfer.setData('text/plain', tagId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, tagId: string | null) => {
    e.preventDefault();
    if (draggedTag !== tagId) {
      setDropTarget(tagId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string | null) => {
    e.preventDefault();
    if (draggedTag && draggedTag !== targetId) {
      onMoveTag(draggedTag, targetId);
    }
    setDraggedTag(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedTag(null);
    setDropTarget(null);
  };

  const renderTag = (tag: TagNode, level = 0) => {
    const isExpanded = expandedTags.includes(tag.id);
    const hasChildren = tag.children && tag.children.length > 0;
    const isEditing = editingTag === tag.id;
    const isAddingChild = addingChildTo === tag.id;
    const isDragging = draggedTag === tag.id;
    const isDropTarget = dropTarget === tag.id;
    
    return (
      <div key={tag.id}>
        <div 
          className={`
            pl-${level * 4} py-2 rounded-lg transition-colors
            ${isDropTarget ? 'bg-sage-100 border-2 border-sage-500' : ''}
            ${isDragging ? 'opacity-50' : ''}
          `}
          draggable
          onDragStart={(e) => handleDragStart(e, tag.id)}
          onDragOver={(e) => handleDragOver(e, tag.id)}
          onDrop={(e) => handleDrop(e, tag.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-center">
            {hasChildren ? (
              <TouchOptimized>
                <button
                  onClick={() => toggleExpand(tag.id)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </TouchOptimized>
            ) : (
              <div className="w-6"></div>
            )}
            
            <div className="flex-1 flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    autoFocus
                  />
                  <TouchOptimized>
                    <button
                      onClick={() => handleSaveEdit(tag.id)}
                      className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </TouchOptimized>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color || '#6b7280' }}
                    />
                    <span className="font-medium text-gray-900">{tag.name}</span>
                    <span className="text-xs text-gray-500">({tag.count})</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <TouchOptimized>
                      <button
                        onClick={() => handleStartAddChild(tag.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FolderPlus size={16} />
                      </button>
                    </TouchOptimized>
                    <TouchOptimized>
                      <button
                        onClick={() => handleStartEdit(tag.id, tag.name)}
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
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Add Child Form */}
        {isAddingChild && (
          <div className="pl-8 py-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="New child tag name..."
                autoFocus
              />
              <TouchOptimized>
                <button
                  onClick={() => handleAddChild(tag.id)}
                  disabled={!newChildName.trim()}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={handleCancelAddChild}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </TouchOptimized>
            </div>
          </div>
        )}
        
        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="ml-6">
            {tag.children!.map(child => renderTag(child, level + 1))}
          </div>
        )}
        
        {/* Delete Confirmation */}
        {showDeleteConfirm === tag.id && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Tag?</h3>
              </div>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete the tag "{tag.name}"?
                {hasChildren && " This will also delete all child tags."}
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
                    onClick={() => handleConfirmDelete(tag.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </TouchOptimized>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-sage-100 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-sage-600" />
          <h3 className="font-semibold text-gray-900">Tag Hierarchy</h3>
        </div>
      </div>
      
      <div 
        className="p-4 max-h-96 overflow-y-auto"
        onDragOver={(e) => handleDragOver(e, null)}
        onDrop={(e) => handleDrop(e, null)}
      >
        {tags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tags available</p>
          </div>
        ) : (
          <div className="space-y-1">
            {tags.map(tag => renderTag(tag))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Drag and drop tags to reorganize. Click + to add child tags.
        </p>
      </div>
    </div>
  );
}