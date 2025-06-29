import React, { useState } from 'react';
import { Save, Trash2, Loader2, Calendar, MapPin, Tag, Users } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface StoryData {
  title: string;
  content: string;
  date: string;
  location?: string;
  tags: string[];
  peopleTagged: string[];
}

interface StoryEditorProps {
  onSave: (data: StoryData) => void;
  onCancel: () => void;
  initialData?: Partial<StoryData>;
  familyMembers?: Array<{ id: string; name: string }>;
}

export function StoryEditor({ 
  onSave, 
  onCancel, 
  initialData,
  familyMembers = []
}: StoryEditorProps) {
  const [storyData, setStoryData] = useState<StoryData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    location: initialData?.location || '',
    tags: initialData?.tags || [],
    peopleTagged: initialData?.peopleTagged || []
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StoryData, string>>>({});

  const suggestedTags = [
    'Family Story', 'Childhood Memory', 'Tradition', 'Recipe', 
    'Life Lesson', 'Funny Story', 'Historical', 'Milestone'
  ];

  const validateForm = () => {
    const newErrors: Partial<Record<keyof StoryData, string>> = {};
    
    if (!storyData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!storyData.content.trim()) {
      newErrors.content = 'Story content is required';
    }
    
    if (!storyData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(storyData);
    } catch (error) {
      console.error('Error saving story:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !storyData.tags.includes(tag)) {
      setStoryData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPersonTag = (personName: string) => {
    if (personName && !storyData.peopleTagged.includes(personName)) {
      setStoryData(prev => ({
        ...prev,
        peopleTagged: [...prev.peopleTagged, personName]
      }));
    }
  };

  const removePersonTag = (personToRemove: string) => {
    setStoryData(prev => ({
      ...prev,
      peopleTagged: prev.peopleTagged.filter(person => person !== personToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Write Your Memory
        </h3>
        <p className="text-gray-600">
          Share a story, recipe, or special memory with your family
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">
            Story Title *
          </label>
          <input
            id="title"
            type="text"
            value={storyData.title}
            onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-4 py-3 text-base border-2 rounded-xl transition-colors ${
              errors.title 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-sage-500 focus:border-sage-500'
            }`}
            placeholder="Give your story a title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">
            Your Story *
          </label>
          <textarea
            id="content"
            rows={10}
            value={storyData.content}
            onChange={(e) => setStoryData(prev => ({ ...prev, content: e.target.value }))}
            className={`w-full px-4 py-3 text-base border-2 rounded-xl transition-colors ${
              errors.content 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-sage-500 focus:border-sage-500'
            }`}
            placeholder="Write your memory here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Date and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-base font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Date of Memory *
            </label>
            <input
              id="date"
              type="date"
              value={storyData.date}
              onChange={(e) => setStoryData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-4 py-3 text-base border-2 rounded-xl transition-colors ${
                errors.date 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-sage-500 focus:border-sage-500'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-2" />
              Location (Optional)
            </label>
            <input
              id="location"
              type="text"
              value={storyData.location || ''}
              onChange={(e) => setStoryData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder="Where did this memory take place?"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            <Tag className="inline-block w-4 h-4 mr-2" />
            Tags (Optional)
          </label>
          
          {/* Current Tags */}
          {storyData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {storyData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                  <TouchOptimized>
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-sage-500 hover:text-sage-700"
                    >
                      ×
                    </button>
                  </TouchOptimized>
                </span>
              ))}
            </div>
          )}
          
          {/* Add Tag */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
              className="flex-1 px-4 py-2 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder="Add a tag..."
            />
            <TouchOptimized>
              <button
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim()}
                className="bg-sage-700 text-white px-4 py-2 rounded-xl hover:bg-sage-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </TouchOptimized>
          </div>
          
          {/* Suggested Tags */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !storyData.tags.includes(tag))
                .map((tag, index) => (
                  <TouchOptimized key={index}>
                    <button
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  </TouchOptimized>
                ))}
            </div>
          </div>
        </div>

        {/* People Tags */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            <Users className="inline-block w-4 h-4 mr-2" />
            People in this Story (Optional)
          </label>
          
          {/* Current People Tags */}
          {storyData.peopleTagged.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {storyData.peopleTagged.map((person, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {person}
                  <TouchOptimized>
                    <button
                      onClick={() => removePersonTag(person)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </TouchOptimized>
                </span>
              ))}
            </div>
          )}
          
          {/* Family Member Selector */}
          {familyMembers.length > 0 && (
            <div className="flex space-x-2">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    addPersonTag(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="flex-1 px-4 py-2 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              >
                <option value="">Select family member...</option>
                {familyMembers
                  .filter(member => !storyData.peopleTagged.includes(member.name))
                  .map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <TouchOptimized>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </TouchOptimized>
        
        <div className="flex space-x-3">
          <TouchOptimized>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to discard this story?')) {
                  onCancel();
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
              <span>Discard</span>
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl hover:bg-sage-800 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Story</span>
                </>
              )}
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}