import React, { useState } from 'react';
import { Camera, Upload, Tag, ChevronLeft, ChevronRight, SkipBack as Skip, Sparkles, Heart } from 'lucide-react';
import { TouchOptimized } from '../../ui/TouchOptimized';

interface FirstMemoryData {
  file?: File;
  title: string;
  description: string;
  tags: string[];
}

interface FirstMemoryStepProps {
  data?: FirstMemoryData;
  onUpdate: (data: FirstMemoryData) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function FirstMemoryStep({ data, onUpdate, onNext, onBack, onSkip }: FirstMemoryStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const currentData = data || {
    title: '',
    description: '',
    tags: []
  };

  const suggestedTags = [
    'Family', 'Birthday', 'Holiday', 'Vacation', 'Wedding', 
    'Graduation', 'Anniversary', 'Childhood', 'Grandparents', 'Siblings'
  ];

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      onUpdate({ ...currentData, file });
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const addTag = (tag: string) => {
    if (tag && !currentData.tags.includes(tag)) {
      onUpdate({ ...currentData, tags: [...currentData.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ 
      ...currentData, 
      tags: currentData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const addCustomTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  const canProceed = currentData.file && currentData.title.trim();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-sage-100">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upload Your First Memory</h2>
            <p className="text-lg text-gray-600">Let's start your family's digital memory collection</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-sage-100 to-sage-50 rounded-xl p-4 border border-sage-200">
          <div className="flex items-center space-x-2 text-sage-700">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">This is a special moment!</span>
          </div>
          <p className="text-sage-600 mt-1">
            Your first upload will be the beginning of your family's digital memory journey. 
            Choose something meaningful - a favorite photo, a special video, or a cherished moment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - File Upload */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Memory</h3>
          
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive 
                ? 'border-sage-500 bg-sage-50' 
                : 'border-gray-300 hover:border-sage-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
          >
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                <p className="text-base font-medium text-gray-700">{currentData.file?.name}</p>
              </div>
            ) : currentData.file ? (
              <div className="space-y-4">
                <div className="bg-sage-100 p-4 rounded-lg">
                  <Camera className="w-12 h-12 text-sage-600 mx-auto mb-2" />
                  <p className="text-base font-medium text-gray-700">{currentData.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(currentData.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your photo or video here
                  </p>
                  <p className="text-base text-gray-500 mb-4">
                    or click to browse your files
                  </p>
                  <TouchOptimized>
                    <label className="inline-block bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors cursor-pointer">
                      Choose File
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </TouchOptimized>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Supported formats: JPG, PNG, GIF, MP4, MOV (max 50MB)
          </p>
        </div>

        {/* Right Column - Memory Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Tell Us About This Memory</h3>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-3">
              Memory Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={currentData.title}
              onChange={(e) => onUpdate({ ...currentData, title: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder="e.g., Family Christmas Morning 2024"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-3">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={4}
              value={currentData.description}
              onChange={(e) => onUpdate({ ...currentData, description: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors resize-none"
              placeholder="Share the story behind this memory..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              <Tag className="inline w-5 h-5 mr-2" />
              Tags (Optional)
            </label>
            <p className="text-base text-gray-600 mb-4">
              Tags help organize and find memories later. Choose from suggestions or add your own.
            </p>

            {/* Selected Tags */}
            {currentData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentData.tags.map((tag, index) => (
                  <TouchOptimized key={index}>
                    <span className="inline-flex items-center bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-sage-500 hover:text-sage-700"
                      >
                        ×
                      </button>
                    </span>
                  </TouchOptimized>
                ))}
              </div>
            )}

            {/* Suggested Tags */}
            <div className="mb-4">
              <h4 className="text-base font-medium text-gray-700 mb-2">Suggested Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <TouchOptimized key={tag}>
                    <button
                      onClick={() => addTag(tag)}
                      disabled={currentData.tags.includes(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        currentData.tags.includes(tag)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700'
                      }`}
                    >
                      {tag}
                    </button>
                  </TouchOptimized>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                className="flex-1 px-3 py-2 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                placeholder="Add custom tag"
              />
              <TouchOptimized>
                <button
                  onClick={addCustomTag}
                  className="bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
                >
                  Add
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Message */}
      {canProceed && (
        <div className="mt-8 bg-gradient-to-r from-sage-700 to-sage-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-6 h-6" />
            <h3 className="text-xl font-semibold">Wonderful!</h3>
          </div>
          <p className="text-sage-100">
            You're about to create your first family memory in MemoryMesh. 
            This is the beginning of something beautiful - a digital treasure chest 
            that will grow with your family over time.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <TouchOptimized>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        </TouchOptimized>

        <div className="flex space-x-4">
          <TouchOptimized>
            <button
              onClick={onSkip}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-semibold transition-colors"
            >
              <Skip size={20} />
              <span>Skip for Now</span>
            </button>
          </TouchOptimized>

          <TouchOptimized>
            <button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 bg-sage-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[56px]"
            >
              <span>Upload & Continue</span>
              <ChevronRight size={20} />
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}