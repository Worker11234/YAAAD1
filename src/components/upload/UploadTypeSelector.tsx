import React from 'react';
import { Camera, Upload, Mic, FileText } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface UploadTypeSelectorProps {
  onSelect: (type: 'photo' | 'video' | 'audio' | 'story') => void;
  className?: string;
}

export function UploadTypeSelector({ onSelect, className = '' }: UploadTypeSelectorProps) {
  const { isMobile } = useDeviceDetection();

  const uploadTypes = [
    {
      id: 'photo',
      label: 'Take Photo',
      description: 'Capture a new photo memory',
      icon: Camera,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'video',
      label: 'Upload File',
      description: 'Select photos, videos, or audio',
      icon: Upload,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'audio',
      label: 'Record Audio',
      description: 'Capture a voice memory',
      icon: Mic,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'story',
      label: 'Write Story',
      description: 'Share a written memory',
      icon: FileText,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {uploadTypes.map((type) => (
        <TouchOptimized key={type.id}>
          <button
            onClick={() => onSelect(type.id as any)}
            className={`${type.color} text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 w-full text-left`}
          >
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <type.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{type.label}</h3>
                <p className="text-sm opacity-90">{type.description}</p>
              </div>
            </div>
          </button>
        </TouchOptimized>
      ))}
    </div>
  );
}