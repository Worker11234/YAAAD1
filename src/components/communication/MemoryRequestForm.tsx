import React, { useState } from 'react';
import { 
  Calendar, MapPin, User, Tag, Send, X, 
  Loader2, Camera, AlertTriangle, Check
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

interface MemoryRequestFormProps {
  familyMembers: FamilyMember[];
  onSubmit: (request: MemoryRequest) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

interface MemoryRequest {
  title: string;
  description: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  location?: string;
  people: string[];
  tags: string[];
  requestedFrom: string[];
}

export function MemoryRequestForm({
  familyMembers,
  onSubmit,
  onCancel,
  className = ''
}: MemoryRequestFormProps) {
  const { isMobile } = useDeviceDetection();
  const [request, setRequest] = useState<MemoryRequest>({
    title: '',
    description: '',
    dateRange: {},
    location: '',
    people: [],
    tags: [],
    requestedFrom: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!request.title.trim()) {
      setError('Please enter a title for your request');
      return;
    }
    
    if (request.requestedFrom.length === 0) {
      setError('Please select at least one family member to request from');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Submit the request
      await onSubmit(request);
      
      // Show success message
      setSuccess(true);
      
      // Close the form after a delay
      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error) {
      console.error('Error submitting memory request:', error);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !request.tags.includes(newTag.trim())) {
      setRequest(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setRequest(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleTogglePerson = (personId: string) => {
    setRequest(prev => ({
      ...prev,
      people: prev.people.includes(personId)
        ? prev.people.filter(p => p !== personId)
        : [...prev.people, personId]
    }));
  };

  const handleToggleRequestFrom = (personId: string) => {
    setRequest(prev => ({
      ...prev,
      requestedFrom: prev.requestedFrom.includes(personId)
        ? prev.requestedFrom.filter(p => p !== personId)
        : [...prev.requestedFrom, personId]
    }));
  };

  const suggestedTags = [
    'Birthday', 'Wedding', 'Graduation', 'Vacation', 'Holiday', 
    'Family Reunion', 'Anniversary', 'Childhood', 'School'
  ].filter(tag => !request.tags.includes(tag));

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-sage-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-sage-100 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Request Family Memories</h3>
          </div>
          
          <TouchOptimized>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <Check className="w-5 h-5 mr-2 text-green-600" />
              Memory request sent successfully! Your family members will be notified.
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                What memories are you looking for? *
              </label>
              <input
                id="title"
                type="text"
                value={request.title}
                onChange={(e) => setRequest(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="e.g., Photos from Grandma's 80th birthday party"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Additional details (optional)
              </label>
              <textarea
                id="description"
                value={request.description}
                onChange={(e) => setRequest(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                rows={3}
                placeholder="Describe what you're looking for in more detail..."
              />
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                Date Range (optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={request.dateRange.start || ''}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">
                    To
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={request.dateRange.end || ''}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                Location (optional)
              </label>
              <input
                id="location"
                type="text"
                value={request.location || ''}
                onChange={(e) => setRequest(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="e.g., Grandma's house, Hawaii vacation"
              />
            </div>
            
            {/* People */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <User className="w-4 h-4 mr-1 text-gray-500" />
                People in the memories (optional)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                {familyMembers.map(member => (
                  <TouchOptimized key={member.id}>
                    <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={request.people.includes(member.id)}
                        onChange={() => handleTogglePerson(member.id)}
                        className="rounded text-sage-600 focus:ring-sage-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </label>
                  </TouchOptimized>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Tag className="w-4 h-4 mr-1 text-gray-500" />
                Tags (optional)
              </label>
              
              {/* Current Tags */}
              {request.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {request.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-sage-100 text-sage-700 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <TouchOptimized>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-sage-500 hover:text-sage-700"
                        >
                          <X size={14} />
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Add a tag..."
                />
                <TouchOptimized>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="bg-sage-600 text-white px-3 py-2 rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </TouchOptimized>
              </div>
              
              {/* Suggested Tags */}
              {suggestedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestedTags.slice(0, 5).map((tag, index) => (
                      <TouchOptimized key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setRequest(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }));
                          }}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </button>
                      </TouchOptimized>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Request From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Request memories from: *
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                {familyMembers.map(member => (
                  <TouchOptimized key={member.id}>
                    <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={request.requestedFrom.includes(member.id)}
                        onChange={() => handleToggleRequestFrom(member.id)}
                        className="rounded text-sage-600 focus:ring-sage-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </label>
                  </TouchOptimized>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <TouchOptimized>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              type="submit"
              disabled={submitting || success}
              className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </TouchOptimized>
        </div>
      </form>
    </div>
  );
}