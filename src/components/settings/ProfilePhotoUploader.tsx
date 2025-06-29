import React, { useState, useRef } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string | null) => void;
}

export function ProfilePhotoUploader({ currentPhotoUrl, onPhotoChange }: ProfilePhotoUploaderProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoUrl(result);
        onPhotoChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // In a real app, you would upload the file to your server here
      // const formData = new FormData();
      // formData.append('photo', file);
      // const response = await fetch('/api/upload-profile-photo', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // setPhotoUrl(data.photoUrl);
      // onPhotoChange(data.photoUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div className="absolute bottom-0 right-0">
          <TouchOptimized>
            <label className="bg-sage-600 text-white p-2 rounded-full cursor-pointer hover:bg-sage-700 transition-colors">
              <Camera size={16} />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </TouchOptimized>
        </div>
      </div>
      
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-1">Profile Photo</h4>
        <p className="text-sm text-gray-600 mb-3">
          Upload a clear photo to help family members recognize you
        </p>
        
        <div className="flex space-x-2">
          <TouchOptimized>
            <label className="inline-flex items-center space-x-2 bg-sage-100 text-sage-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sage-200 transition-colors cursor-pointer">
              <Camera size={16} />
              <span>Upload Photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </TouchOptimized>
          
          {photoUrl && (
            <TouchOptimized>
              <button
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </TouchOptimized>
          )}
        </div>
      </div>
    </div>
  );
}