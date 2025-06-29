import React, { useState } from 'react';
import { Upload, Camera, FileText, Mic, Sparkles, AlertCircle } from 'lucide-react';
import { UploadTypeSelector } from '../components/upload/UploadTypeSelector';
import { MemoryUploadModal } from '../components/upload/MemoryUploadModal';
import { StoryEditor } from '../components/upload/StoryEditor';
import { AudioRecorder } from '../components/upload/AudioRecorder';
import { BatchUploadProgress } from '../components/upload/BatchUploadProgress';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useNativeFeatures } from '../hooks/useNativeFeatures';
import { useAuth } from '../hooks/useAuth';
import { useOfflineSync } from '../hooks/useOfflineSync';

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  type: 'photo' | 'video' | 'audio' | 'document';
}

export function UploadPage() {
  const { isMobile } = useDeviceDetection();
  const { isNative, takePicture } = useNativeFeatures();
  const { user } = useAuth();
  const { isOnline, addToSyncQueue } = useOfflineSync();
  
  const [uploadType, setUploadType] = useState<'photo' | 'video' | 'audio' | 'story' | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showStoryEditor, setShowStoryEditor] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [showUploadProgress, setShowUploadProgress] = useState(false);

  // Mock family members data
  const familyMembers = [
    { id: 'mom1', name: 'Mom' },
    { id: 'dad1', name: 'Dad' },
    { id: 'grandma1', name: 'Grandma' },
    { id: 'uncle1', name: 'Uncle John' },
    { id: 'sarah1', name: 'Sarah' }
  ];

  const handleTypeSelect = (type: 'photo' | 'video' | 'audio' | 'story') => {
    setUploadType(type);
    
    switch (type) {
      case 'photo':
        if (isNative) {
          handleNativeCapture();
        } else {
          setShowUploadModal(true);
        }
        break;
      case 'video':
        setShowUploadModal(true);
        break;
      case 'audio':
        setShowAudioRecorder(true);
        break;
      case 'story':
        setShowStoryEditor(true);
        break;
    }
  };

  const handleNativeCapture = async () => {
    try {
      const imageData = await takePicture();
      if (imageData) {
        // Process the captured image
        console.log('Image captured:', imageData);
        // Here you would typically upload the image or add it to your upload queue
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleUpload = async (files: any[], data: any) => {
    // Simulate upload process
    const newUploads: UploadItem[] = files.map(file => ({
      id: file.id,
      name: file.file.name,
      progress: 0,
      status: 'pending',
      type: file.type
    }));
    
    setUploads(newUploads);
    setShowUploadProgress(true);
    
    // Process each file
    for (const upload of newUploads) {
      // Update status to uploading
      setUploads(prev => prev.map(item => 
        item.id === upload.id ? { ...item, status: 'uploading' } : item
      ));
      
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploads(prev => prev.map(item => 
            item.id === upload.id ? { ...item, progress } : item
          ));
        }
        
        // Mark as success
        setUploads(prev => prev.map(item => 
          item.id === upload.id ? { ...item, status: 'success' } : item
        ));
        
        // If offline, add to sync queue
        if (!isOnline) {
          addToSyncQueue('memory', {
            file_id: upload.id,
            title: data.title,
            description: data.description,
            date: data.date,
            user_id: user?.id
          });
        }
        
      } catch (error) {
        console.error(`Error uploading ${upload.name}:`, error);
        setUploads(prev => prev.map(item => 
          item.id === upload.id ? { ...item, status: 'error', error: 'Upload failed' } : item
        ));
      }
    }
  };

  const handleRetryUpload = (id: string) => {
    setUploads(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'pending', progress: 0, error: undefined } : item
    ));
    
    // Simulate retry
    setTimeout(() => {
      handleUpload(
        uploads.filter(item => item.id === id).map(item => ({ 
          id: item.id, 
          file: { name: item.name }, 
          type: item.type 
        })),
        { title: 'Retry Upload' }
      );
    }, 500);
  };

  const handleCancelUpload = (id: string) => {
    setUploads(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveStory = (storyData: any) => {
    console.log('Story saved:', storyData);
    
    // Add to uploads for tracking
    const storyUpload: UploadItem = {
      id: crypto.randomUUID(),
      name: storyData.title,
      progress: 100,
      status: 'success',
      type: 'document'
    };
    
    setUploads(prev => [...prev, storyUpload]);
    setShowUploadProgress(true);
    setShowStoryEditor(false);
    
    // If offline, add to sync queue
    if (!isOnline) {
      addToSyncQueue('memory', {
        type: 'story',
        title: storyData.title,
        content: storyData.content,
        date: storyData.date,
        user_id: user?.id
      });
    }
  };

  const handleSaveAudio = (blob: Blob, duration: number) => {
    console.log('Audio saved:', { blob, duration });
    
    // Create a file from the blob
    const file = new File([blob], `audio-recording-${Date.now()}.mp3`, { type: 'audio/mpeg' });
    
    // Add to uploads for tracking
    const audioUpload: UploadItem = {
      id: crypto.randomUUID(),
      name: file.name,
      progress: 100,
      status: 'success',
      type: 'audio'
    };
    
    setUploads(prev => [...prev, audioUpload]);
    setShowUploadProgress(true);
    setShowAudioRecorder(false);
    
    // If offline, add to sync queue
    if (!isOnline) {
      addToSyncQueue('memory', {
        type: 'audio',
        file: file,
        duration: duration,
        user_id: user?.id
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Memory</h1>
            <p className="text-lg text-gray-600">
              Preserve and share your precious family memories
            </p>
          </div>
        </div>
        
        {/* Offline Warning */}
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">You're currently offline</h3>
                <p className="text-yellow-700">
                  Your uploads will be saved locally and automatically uploaded when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-sage-100 p-6 lg:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            How would you like to share your memory?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from the options below to upload photos, videos, record audio, or write a story. 
            Your memories will be securely stored and shared with your family.
          </p>
        </div>
        
        {/* Upload Type Selector */}
        <UploadTypeSelector onSelect={handleTypeSelect} className="mb-8" />
        
        {/* AI Enhancement Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-800">AI-Enhanced Memory Organization</h3>
              <p className="text-purple-700">Your uploads are automatically enhanced with smart features</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <p className="font-medium text-purple-800 mb-1">Face Recognition</p>
              <p className="text-purple-700">Automatically identifies family members in photos and videos</p>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <p className="font-medium text-purple-800 mb-1">Smart Tagging</p>
              <p className="text-purple-700">Suggests relevant tags based on content analysis</p>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded-lg">
              <p className="font-medium text-purple-800 mb-1">Memory Connections</p>
              <p className="text-purple-700">Links related memories to build your family story</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <MemoryUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          familyMembers={familyMembers}
          initialType={uploadType || undefined}
        />
      )}

      {/* Story Editor */}
      {showStoryEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <StoryEditor
            onSave={handleSaveStory}
            onCancel={() => setShowStoryEditor(false)}
            familyMembers={familyMembers}
          />
        </div>
      )}

      {/* Audio Recorder */}
      {showAudioRecorder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <AudioRecorder
            onSave={handleSaveAudio}
            onCancel={() => setShowAudioRecorder(false)}
          />
        </div>
      )}

      {/* Batch Upload Progress */}
      {showUploadProgress && uploads.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md w-full">
          <BatchUploadProgress
            uploads={uploads}
            onRetry={handleRetryUpload}
            onCancel={handleCancelUpload}
            onClose={() => {
              if (uploads.every(u => u.status !== 'uploading' && u.status !== 'pending')) {
                setShowUploadProgress(false);
                setUploads([]);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}