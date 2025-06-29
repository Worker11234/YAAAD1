import React from 'react';
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  type: 'photo' | 'video' | 'audio' | 'document';
}

interface BatchUploadProgressProps {
  uploads: UploadItem[];
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onClose: () => void;
  className?: string;
}

export function BatchUploadProgress({
  uploads,
  onRetry,
  onCancel,
  onClose,
  className = ''
}: BatchUploadProgressProps) {
  const totalUploads = uploads.length;
  const completedUploads = uploads.filter(u => u.status === 'success').length;
  const failedUploads = uploads.filter(u => u.status === 'error').length;
  const inProgressUploads = uploads.filter(u => u.status === 'uploading' || u.status === 'pending').length;
  
  const overallProgress = Math.round(
    (uploads.reduce((sum, item) => sum + item.progress, 0) / (totalUploads * 100)) * 100
  );

  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Loader2 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type: UploadItem['type']) => {
    switch (type) {
      case 'photo':
        return 'bg-blue-100 text-blue-700';
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'audio':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const allComplete = completedUploads === totalUploads;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">Uploading Memories</h3>
          <p className="text-sm text-gray-600">
            {allComplete
              ? 'All uploads complete!'
              : `${completedUploads} of ${totalUploads} complete`}
          </p>
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

      {/* Overall Progress */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            {allComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            )}
            <span className="font-medium text-gray-900">
              {allComplete ? 'Upload Complete' : 'Uploading...'}
            </span>
          </div>
          <span className="text-sm text-gray-600">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              allComplete ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{completedUploads} completed</span>
          {failedUploads > 0 && (
            <span className="text-red-600">{failedUploads} failed</span>
          )}
          {inProgressUploads > 0 && (
            <span>{inProgressUploads} in progress</span>
          )}
        </div>
      </div>

      {/* Individual Uploads */}
      <div className="max-h-60 overflow-y-auto">
        {uploads.map((item) => (
          <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getStatusIcon(item.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    {item.status === 'error' && (
                      <span className="text-xs text-red-600">{item.error || 'Upload failed'}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.status === 'error' && (
                  <TouchOptimized>
                    <button
                      onClick={() => onRetry(item.id)}
                      className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors"
                    >
                      Retry
                    </button>
                  </TouchOptimized>
                )}
                {(item.status === 'uploading' || item.status === 'pending') && (
                  <TouchOptimized>
                    <button
                      onClick={() => onCancel(item.id)}
                      className="p-1 text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </TouchOptimized>
                )}
              </div>
            </div>
            
            {item.status !== 'success' && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    item.status === 'error' ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {allComplete && (
        <div className="p-4 bg-green-50 border-t border-green-100">
          <div className="flex justify-between items-center">
            <p className="text-green-700 font-medium">All memories uploaded successfully!</p>
            <TouchOptimized>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </TouchOptimized>
          </div>
        </div>
      )}
    </div>
  );
}