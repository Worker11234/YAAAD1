import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Camera, Image, Video, FileText, 
  Volume2, Calendar, MapPin, Tag, User, Plus, 
  Trash2, Check, Loader2, AlertTriangle, Info
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useNativeFeatures } from '../../hooks/useNativeFeatures';
import { CameraCapture } from './CameraCapture';
import { NativeCameraCapture } from './NativeCameraCapture';

interface MemoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: any[], data: any) => Promise<void>;
  initialType?: 'photo' | 'video' | 'audio' | 'story';
  familyMembers?: Array<{ id: string; name: string }>;
}

export function MemoryUploadModal({
  isOpen,
  onClose,
  onUpload,
  initialType,
  familyMembers = []
}: MemoryUploadModalProps) {
  const { isMobile, platform } = useDeviceDetection();
  const { isNative } = useNativeFeatures();
  
  const [activeStep, setActiveStep] = useState<'type' | 'upload' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'audio' | 'story' | null>(initialType || null);
  const [files, setFiles] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [peopleTagged, setPeopleTagged] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep(initialType ? 'upload' : 'type');
      setSelectedType(initialType || null);
      setFiles([]);
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setLocation('');
      setTags([]);
      setNewTag('');
      setPeopleTagged([]);
      setError(null);
    }
  }, [isOpen, initialType]);
  
  if (!isOpen) return null;
  
  const handleTypeSelect = (type: 'photo' | 'video' | 'audio' | 'story') => {
    setSelectedType(type);
    
    if (type === 'photo' && (isMobile || isNative)) {
      setShowCamera(true);
    } else {
      setActiveStep('upload');
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const fileArray = Array.from(selectedFiles).map(file => ({
      id: crypto.randomUUID(),
      file,
      type: file.type.startsWith('image/') ? 'photo' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'document'
    }));
    
    setFiles(fileArray);
    setActiveStep('details');
    
    // Auto-generate title from filename
    if (fileArray.length === 1) {
      const fileName = fileArray[0].file.name;
      const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      const formattedName = nameWithoutExtension
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      setTitle(formattedName);
    } else {
      setTitle(`${fileArray.length} ${selectedType} memories`);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    
    const fileArray = Array.from(droppedFiles).map(file => ({
      id: crypto.randomUUID(),
      file,
      type: file.type.startsWith('image/') ? 'photo' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'document'
    }));
    
    setFiles(fileArray);
    setActiveStep('details');
    
    // Auto-generate title from filename
    if (fileArray.length === 1) {
      const fileName = fileArray[0].file.name;
      const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      const formattedName = nameWithoutExtension
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      setTitle(formattedName);
    } else {
      setTitle(`${fileArray.length} ${selectedType} memories`);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleCameraCapture = (blob: Blob) => {
    const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    const fileObj = {
      id: crypto.randomUUID(),
      file,
      type: 'photo'
    };
    
    setFiles([fileObj]);
    setShowCamera(false);
    setActiveStep('details');
    setTitle(`Photo ${new Date().toLocaleDateString()}`);
  };
  
  const handleNativeCameraCapture = (dataUrl: string) => {
    // Convert data URL to blob
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        const fileObj = {
          id: crypto.randomUUID(),
          file,
          type: 'photo'
        };
        
        setFiles([fileObj]);
        setShowCamera(false);
        setActiveStep('details');
        setTitle(`Photo ${new Date().toLocaleDateString()}`);
      })
      .catch(err => {
        console.error('Error processing camera capture:', err);
        setError('Failed to process camera capture');
      });
  };
  
  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    
    if (files.length <= 1) {
      setActiveStep('upload');
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };
  
  const handleTogglePerson = (person: string) => {
    setPeopleTagged(prev => 
      prev.includes(person)
        ? prev.filter(p => p !== person)
        : [...prev, person]
    );
  };
  
  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title for your memory');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const data = {
        title,
        description,
        date,
        location,
        tags,
        peopleTagged
      };
      
      await onUpload(files, data);
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload. Please try again.');
      setIsUploading(false);
    }
  };
  
  const renderTypeSelectionStep = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        What type of memory would you like to upload?
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TouchOptimized>
          <button
            onClick={() => handleTypeSelect('photo')}
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Photo</h3>
                <p className="text-sm opacity-90">Capture or upload photos</p>
              </div>
            </div>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => handleTypeSelect('video')}
            className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Video</h3>
                <p className="text-sm opacity-90">Record or upload videos</p>
              </div>
            </div>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => handleTypeSelect('audio')}
            className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Audio</h3>
                <p className="text-sm opacity-90">Record or upload audio</p>
              </div>
            </div>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={() => handleTypeSelect('story')}
            className="bg-orange-600 text-white p-6 rounded-xl hover:bg-orange-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Story</h3>
                <p className="text-sm opacity-90">Write a memory or story</p>
              </div>
            </div>
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
  
  const renderFileUploadStep = () => (
    <div 
      className="p-6"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        {selectedType === 'photo' ? 'Upload Photos' :
         selectedType === 'video' ? 'Upload Videos' :
         selectedType === 'audio' ? 'Upload Audio' :
         'Upload Documents'}
      </h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept={
            selectedType === 'photo' ? 'image/*' :
            selectedType === 'video' ? 'video/*' :
            selectedType === 'audio' ? 'audio/*' :
            '.pdf,.doc,.docx,.txt'
          }
        />
        
        <div className="mb-4">
          {selectedType === 'photo' && <Image className="w-16 h-16 text-gray-400 mx-auto" />}
          {selectedType === 'video' && <Video className="w-16 h-16 text-gray-400 mx-auto" />}
          {selectedType === 'audio' && <Volume2 className="w-16 h-16 text-gray-400 mx-auto" />}
          {selectedType === 'story' && <FileText className="w-16 h-16 text-gray-400 mx-auto" />}
        </div>
        
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drag & drop your files here
        </p>
        <p className="text-gray-500 mb-6">
          or
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {selectedType === 'photo' && isMobile && (
            <TouchOptimized>
              <button
                onClick={() => setShowCamera(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Take Photo
              </button>
            </TouchOptimized>
          )}
          
          <TouchOptimized>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors"
            >
              Browse Files
            </button>
          </TouchOptimized>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          {selectedType === 'photo' && 'Supported formats: JPG, PNG, GIF, HEIC (max 20MB)'}
          {selectedType === 'video' && 'Supported formats: MP4, MOV, AVI (max 100MB)'}
          {selectedType === 'audio' && 'Supported formats: MP3, WAV, M4A (max 50MB)'}
          {selectedType === 'story' && 'Supported formats: PDF, DOC, DOCX, TXT (max 10MB)'}
        </p>
      </div>
    </div>
  );
  
  const renderDetailsStep = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Memory Details
      </h2>
      
      {/* Selected Files Preview */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Selected Files</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                {file.type === 'photo' && <Image size={20} className="text-blue-600" />}
                {file.type === 'video' && <Video size={20} className="text-purple-600" />}
                {file.type === 'audio' && <Volume2 size={20} className="text-green-600" />}
                {file.type === 'document' && <FileText size={20} className="text-orange-600" />}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <TouchOptimized>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </TouchOptimized>
            </div>
          ))}
        </div>
      </div>
      
      {/* Memory Details Form */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            placeholder="Enter a title for your memory"
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
            placeholder="Add a description..."
            rows={3}
          />
        </div>
        
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} className="inline mr-1" />
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          />
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="inline mr-1" />
            Location (Optional)
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            placeholder="Where was this memory taken?"
          />
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag size={16} className="inline mr-1" />
            Tags (Optional)
          </label>
          
          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-sage-100 text-sage-700 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <TouchOptimized>
                    <button
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
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder="Add a tag..."
            />
            <TouchOptimized>
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </TouchOptimized>
          </div>
          
          {/* Suggested Tags */}
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Suggested tags:</p>
            <div className="flex flex-wrap gap-1">
              {['Family', 'Vacation', 'Birthday', 'Holiday', 'School', 'Friends'].map((tag) => (
                <TouchOptimized key={tag}>
                  <button
                    onClick={() => {
                      if (!tags.includes(tag)) {
                        setTags(prev => [...prev, tag]);
                      }
                    }}
                    disabled={tags.includes(tag)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                      tags.includes(tag)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                </TouchOptimized>
              ))}
            </div>
          </div>
        </div>
        
        {/* People Tags */}
        {familyMembers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="inline mr-1" />
              People in this Memory (Optional)
            </label>
            
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {familyMembers.map((member) => (
                <TouchOptimized key={member.id}>
                  <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={peopleTagged.includes(member.name)}
                      onChange={() => handleTogglePerson(member.name)}
                      className="rounded text-sage-600 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-700">{member.name}</span>
                  </label>
                </TouchOptimized>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Enhancement Notice */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <div className="flex items-start space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-800">AI Enhancement</p>
              <p className="text-xs text-purple-700">
                Your memory will be automatically enhanced with AI-powered tagging, face recognition, and organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-sage-100 p-2 rounded-lg">
              {selectedType === 'photo' && <Camera className="w-5 h-5 text-sage-600" />}
              {selectedType === 'video' && <Video className="w-5 h-5 text-sage-600" />}
              {selectedType === 'audio' && <Volume2 className="w-5 h-5 text-sage-600" />}
              {selectedType === 'story' && <FileText className="w-5 h-5 text-sage-600" />}
              {!selectedType && <Upload className="w-5 h-5 text-sage-600" />}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {activeStep === 'type' && 'Upload Memory'}
              {activeStep === 'upload' && `Upload ${selectedType?.charAt(0).toUpperCase() + selectedType?.slice(1)}`}
              {activeStep === 'details' && 'Memory Details'}
            </h2>
          </div>
          
          <TouchOptimized>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
        
        {/* Content */}
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
          {activeStep === 'type' && renderTypeSelectionStep()}
          {activeStep === 'upload' && renderFileUploadStep()}
          {activeStep === 'details' && renderDetailsStep()}
          
          {/* Error Message */}
          {error && (
            <div className="px-6 pb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            {/* Back Button */}
            {activeStep !== 'type' && (
              <TouchOptimized>
                <button
                  onClick={() => {
                    if (activeStep === 'upload') {
                      setActiveStep('type');
                      setSelectedType(null);
                    } else if (activeStep === 'details') {
                      setActiveStep('upload');
                      setFiles([]);
                    }
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              </TouchOptimized>
            )}
            
            {activeStep === 'type' && (
              <TouchOptimized>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
            )}
            
            {/* Next/Submit Button */}
            <TouchOptimized>
              {activeStep === 'details' ? (
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !title.trim() || files.length === 0}
                  className="flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50 transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      <span>Upload Memory</span>
                    </>
                  )}
                </button>
              ) : activeStep === 'upload' && files.length > 0 ? (
                <button
                  onClick={() => setActiveStep('details')}
                  className="flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors"
                >
                  <span>Continue</span>
                </button>
              ) : null}
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Camera Capture Modal */}
      {showCamera && (
        isNative ? (
          <NativeCameraCapture
            onCapture={handleNativeCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )
      )}
    </div>
  );
}