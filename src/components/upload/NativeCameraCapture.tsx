import React, { useState } from 'react';
import { Camera, Image, X, Check, RotateCcw } from 'lucide-react';
import { useNativeFeatures } from '../../hooks/useNativeFeatures';
import { TouchOptimized } from '../ui/TouchOptimized';

interface NativeCameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export function NativeCameraCapture({ onCapture, onClose }: NativeCameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isNative, takePicture, selectFromGallery, hapticFeedback } = useNativeFeatures();

  const handleTakePicture = async () => {
    try {
      setLoading(true);
      await hapticFeedback('light');
      
      const imageData = await takePicture();
      if (imageData) {
        setCapturedImage(imageData);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      setLoading(true);
      await hapticFeedback('light');
      
      const imageData = await selectFromGallery();
      if (imageData) {
        setCapturedImage(imageData);
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (capturedImage) {
      await hapticFeedback('medium');
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = async () => {
    await hapticFeedback('light');
    setCapturedImage(null);
  };

  const handleClose = async () => {
    await hapticFeedback('light');
    onClose();
  };

  if (!isNative) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <Camera className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Camera Not Available</h2>
          <p className="text-gray-300 mb-6">Native camera features are only available in the mobile app.</p>
          <TouchOptimized onTap={onClose}>
            <button className="bg-sage-700 text-white px-6 py-3 rounded-lg font-medium">
              Close
            </button>
          </TouchOptimized>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-50 text-white safe-area-inset-top">
        <TouchOptimized onTap={handleClose}>
          <div className="p-2">
            <X size={24} />
          </div>
        </TouchOptimized>
        
        <h2 className="text-lg font-semibold">Capture Memory</h2>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center text-white">
            <Camera className="w-24 h-24 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Ready to capture</p>
            <p className="text-sm opacity-75">Choose camera or gallery below</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black bg-opacity-50 safe-area-inset-bottom">
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
          <div className="flex justify-center space-x-8">
            <TouchOptimized onTap={handleSelectFromGallery}>
              <div className="bg-gray-600 p-4 rounded-full" style={{ opacity: loading ? 0.5 : 1 }}>
                <Image size={24} className="text-white" />
              </div>
            </TouchOptimized>
            
            <TouchOptimized onTap={handleTakePicture}>
              <div className="bg-white p-6 rounded-full border-4 border-gray-300" style={{ opacity: loading ? 0.5 : 1 }}>
                <Camera size={32} className="text-gray-800" />
              </div>
            </TouchOptimized>
          </div>
        )}
        
        {!capturedImage && (
          <div className="flex justify-center space-x-4 mt-4 text-white text-sm">
            <span className="opacity-75">Gallery</span>
            <span className="opacity-75">Camera</span>
          </div>
        )}
      </div>
    </div>
  );
}