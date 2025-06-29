import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountSectionProps {
  className?: string;
}

export function DeleteAccountSection({ className = '' }: DeleteAccountSectionProps) {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
    setError(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setConfirmText('');
    setConfirmCheckbox(false);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    // Validate confirmation
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    if (!confirmCheckbox) {
      setError('Please check the confirmation box');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { success, error } = await deleteAccount();
      
      if (success) {
        setSuccess(true);
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(error?.message || 'Failed to delete account. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-100 p-3 rounded-lg">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
      </div>
      
      <p className="text-gray-700 mb-6">
        Permanently delete your account and all associated data. This action cannot be undone.
        All your memories, comments, and personal information will be permanently removed.
      </p>
      
      {!showConfirmation && !success && (
        <TouchOptimized>
          <button
            onClick={handleDeleteRequest}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            <span>Delete My Account</span>
          </button>
        </TouchOptimized>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmation && !success && (
        <div className="border border-red-200 rounded-xl p-4 bg-red-50">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-red-800">This action cannot be undone</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            <p className="text-red-700">
              Deleting your account will:
            </p>
            
            <ul className="list-disc pl-5 text-red-700 space-y-1">
              <li>Permanently delete all your uploaded memories</li>
              <li>Remove all your comments and likes</li>
              <li>Delete your profile information</li>
              <li>Remove you from all family groups</li>
              <li>Delete your game progress and achievements</li>
            </ul>
            
            <div>
              <label className="block text-sm font-medium text-red-800 mb-2">
                Type DELETE to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Type DELETE in all caps"
              />
            </div>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmCheckbox}
                  onChange={() => setConfirmCheckbox(!confirmCheckbox)}
                  className="w-5 h-5 text-red-600 border-2 border-red-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-red-800 font-medium">
                  I understand that this action is permanent and cannot be undone
                </span>
              </label>
            </TouchOptimized>
            
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <TouchOptimized>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Permanently Delete Account'
                )}
              </button>
            </TouchOptimized>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="border border-green-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center space-x-3 mb-4">
            <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-green-800">Account Deleted Successfully</h3>
          </div>
          
          <p className="text-green-700 mb-4">
            Your account and all associated data have been permanently deleted. You will be redirected to the home page.
          </p>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        </div>
      )}
    </div>
  );
}