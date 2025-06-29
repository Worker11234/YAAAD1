import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface FamilyEmptyStateProps {
  onCreateFamily: () => void;
  onJoinFamily: () => void;
  className?: string;
}

export function FamilyEmptyState({
  onCreateFamily,
  onJoinFamily,
  className = ''
}: FamilyEmptyStateProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-8 border border-gray-200 text-center ${className}`}>
      <div className="w-20 h-20 bg-sage-100 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Users className="w-10 h-10 text-sage-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Family Circles</h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create or join a family to start sharing memories with your loved ones.
        Each family is a private space where you can collaborate and preserve your history together.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <TouchOptimized>
          <button
            onClick={onCreateFamily}
            className="flex items-center justify-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors w-full sm:w-auto"
          >
            <UserPlus size={20} />
            <span>Create a Family</span>
          </button>
        </TouchOptimized>
        
        <TouchOptimized>
          <button
            onClick={onJoinFamily}
            className="flex items-center justify-center space-x-2 border-2 border-sage-700 text-sage-700 px-6 py-3 rounded-xl font-medium hover:bg-sage-50 transition-colors w-full sm:w-auto"
          >
            <Users size={20} />
            <span>Join Existing Family</span>
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
}