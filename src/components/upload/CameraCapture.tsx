import React, { useState } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { useMediaCapture } from '../../hooks/useMediaCapture';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from '../ui/TouchOptimized';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const { isMobile, platform } = useDeviceDetection();
  const { isCapturing, videoRef, startCapture, stopCapture, capturePhoto } = useMediaCapture();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  React.useEffect(() => {
    startCapture({ video: true, facingMode });
    
    return () => {
      stopCapture();
    };
  }, [facingMode]);

  const handleCapture = async () => {
    try {
      const blob = await capturePhoto();
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const handleConfirm = async () => {
    if (capturedImage) {
      try {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        onCapture(blob);
        onClose();
      } catch (error) {
        console.error('Error processing captured image:', error);
      }
    }
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
        <TouchOptimized onTap={onClose}>
          <div className="p-2">
            <X size={24} />
          </div>
        </TouchOptimized>
        
        <h2 className="text-lg font-semibold">Capture Memory</h2>
        
        {!capturedImage && isMobile && (
          <TouchOptimized onTap={toggleCamera}>
            <div className="p-2">
              <RotateCcw size={24} />
            </div>
          </TouchOptimized>
        )}
      </div>

      {/* Camera/Preview */}
      <div className="flex-1 relative overflow-hidden">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black bg-opacity-50">
        {capturedImage ? (
          <div className="flex justify-center space-x-8">
            <TouchOptimized onTap={handleRetake}>
              <div className="bg-gray-600 p-4 rounded-full">
                <RotateCcw size={24} className="text-white" />
              </div>
            </TouchOptimized>
            
            <TouchOptimized onTap={handleConfirm}>
              <div className="bg-sage-700 p-4 rounded-full">
                <Check size={24} className="text-white" />
              </div>
            </TouchOptimized>
          </div>
        ) : (
          <div className="flex justify-center">
            <TouchOptimized onTap={handleCapture}>
              <div className="bg-white p-6 rounded-full border-4 border-gray-300">
                <Camera size={32} className="text-gray-800" />
              </div>
            </TouchOptimized>
          </div>
        )}
      </div>
    </div>
  );
}