import React, { useState } from 'react';
import { Plus, Camera, Upload as UploadIcon, Mic, FileText, X } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { MemoryUploadModal } from './MemoryUploadModal';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useSubscription } from '../../hooks/useSubscription';
import { Feature } from '../../lib/revenuecat';
import { UpgradePrompt } from '../subscription/UpgradePrompt';

interface UploadButtonProps {
  className?: string;
  variant?: 'icon' | 'full' | 'fab';
  label?: string;
  onUploadComplete?: () => void;
}

export function UploadButton({ 
  className = '', 
  variant = 'full',
  label = 'Upload Memory',
  onUploadComplete
}: UploadButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'video' | 'audio' | 'story' | null>(null);
  const { isMobile } = useDeviceDetection();
  const { hasReachedStorageLimit, isFeatureAvailable } = useSubscription();
  
  // Check if storage limit is reached
  const storageLimit = hasReachedStorageLimit();
  
  const handleUploadTypeSelect = (type: 'photo' | 'video' | 'audio' | 'story') => {
    // Check if storage limit is reached
    if (storageLimit) {
      // Show upgrade prompt
      setUploadType(null);
      setShowModal(false);
      setShowMenu(false);
      return;
    }
    
    setUploadType(type);
    setShowModal(true);
    setShowMenu(false);
  };

  const handleUploadComplete = async () => {
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  // FAB style upload button with menu
  if (variant === 'fab') {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
          {/* Menu Items */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-20 z-30"
                onClick={() => setShowMenu(false)}
              />
              
              <div className="absolute bottom-16 right-0 space-y-3 z-40">
                {[
                  {
                    icon: Camera,
                    label: 'Take Photo',
                    type: 'photo',
                    color: 'bg-blue-600 hover:bg-blue-700'
                  },
                  {
                    icon: UploadIcon,
                    label: 'Upload File',
                    type: 'video',
                    color: 'bg-green-600 hover:bg-green-700'
                  },
                  {
                    icon: Mic,
                    label: 'Record Audio',
                    type: 'audio',
                    color: 'bg-purple-600 hover:bg-purple-700'
                  },
                  {
                    icon: FileText,
                    label: 'Write Story',
                    type: 'story',
                    color: 'bg-orange-600 hover:bg-orange-700'
                  }
                ].map((action, index) => (
                  <div
                    key={action.label}
                    className="flex items-center space-x-3 animate-in slide-in-from-right duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Label */}
                    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        {action.label}
                      </span>
                    </div>
                    
                    {/* Action Button */}
                    <TouchOptimized>
                      <button
                        onClick={() => handleUploadTypeSelect(action.type as any)}
                        className={`${action.color} p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-110`}
                      >
                        <action.icon size={20} />
                      </button>
                    </TouchOptimized>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Main FAB */}
          <TouchOptimized>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`${
                showMenu ? 'bg-red-600 hover:bg-red-700' : 'bg-sage-700 hover:bg-sage-800'
              } p-4 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sage-300`}
              aria-label={showMenu ? 'Close quick actions' : 'Open quick actions'}
            >
              <div className={`transition-transform duration-300 ${showMenu ? 'rotate-45' : ''}`}>
                {showMenu ? <X size={24} /> : <Plus size={24} />}
              </div>
            </button>
          </TouchOptimized>
        </div>

        {/* Upload Modal */}
        {showModal && (
          <MemoryUploadModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onUpload={async () => {
              await handleUploadComplete();
              setShowModal(false);
            }}
            initialType={uploadType || undefined}
          />
        )}
        
        {/* Storage Limit Warning */}
        {storageLimit && (
          <div className="fixed bottom-24 right-6 z-40 max-w-xs">
            <UpgradePrompt feature={Feature.STORAGE_FAMILY} compact />
          </div>
        )}
      </>
    );
  }

  // Icon-only button
  if (variant === 'icon') {
    return (
      <>
        <TouchOptimized>
          <button
            onClick={() => storageLimit ? null : setShowModal(true)}
            className={`p-2 rounded-lg text-white bg-sage-700 hover:bg-sage-800 transition-colors ${className} ${
              storageLimit ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Upload memory"
          >
            <Plus size={isMobile ? 20 : 24} />
          </button>
        </TouchOptimized>

        {/* Upload Modal */}
        {showModal && (
          <MemoryUploadModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onUpload={async () => {
              await handleUploadComplete();
              setShowModal(false);
            }}
          />
        )}
        
        {/* Storage Limit Warning */}
        {storageLimit && (
          <div className="absolute top-full mt-2 right-0 z-40 w-64">
            <UpgradePrompt feature={Feature.STORAGE_FAMILY} compact />
          </div>
        )}
      </>
    );
  }

  // Full button with label
  return (
    <>
      <TouchOptimized>
        <button
          onClick={() => storageLimit ? null : setShowModal(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-sage-700 hover:bg-sage-800 transition-colors ${className} ${
            storageLimit ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus size={isMobile ? 18 : 20} />
          <span>{label}</span>
        </button>
      </TouchOptimized>

      {/* Upload Modal */}
      {showModal && (
        <MemoryUploadModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpload={async () => {
            await handleUploadComplete();
            setShowModal(false);
          }}
        />
      )}
      
      {/* Storage Limit Warning */}
      {storageLimit && (
        <div className="absolute top-full mt-2 left-0 z-40 w-64">
          <UpgradePrompt feature={Feature.STORAGE_FAMILY} compact />
        </div>
      )}
    </>
  );
}