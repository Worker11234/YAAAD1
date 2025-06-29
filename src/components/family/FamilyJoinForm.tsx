import React, { useState } from 'react';
import { Users, Check, X, Loader2 } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface FamilyJoinFormProps {
  onJoin: (inviteCode: string) => Promise<void>;
  onClose: () => void;
  className?: string;
}

export function FamilyJoinForm({
  onJoin,
  onClose,
  className = ''
}: FamilyJoinFormProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Invitation code is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onJoin(inviteCode.trim());
      setSuccess(true);
      
      // Close after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to join family');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Join a Family</h2>
          <TouchOptimized>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
        
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-800">Successfully Joined Family</p>
              </div>
              <p className="text-green-700">
                You have successfully joined the family. You will be redirected shortly.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                Invitation Code *
              </label>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="Enter the invitation code you received"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This is the code that was shared with you by a family member
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-2">
              <TouchOptimized>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  type="submit"
                  disabled={!inviteCode.trim() || isSubmitting}
                  className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <Users size={18} />
                      <span>Join Family</span>
                    </>
                  )}
                </button>
              </TouchOptimized>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}