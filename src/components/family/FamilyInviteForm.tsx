import React, { useState } from 'react';
import { Mail, Copy, Check, X, Loader2 } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface FamilyInviteFormProps {
  familyId: string;
  familyName: string;
  onInvite: (data: { email: string; name: string; message: string }) => Promise<string>;
  onClose: () => void;
  className?: string;
}

export function FamilyInviteForm({
  familyId,
  familyName,
  onInvite,
  onClose,
  className = ''
}: FamilyInviteFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim()) {
      setError('Email and name are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const code = await onInvite({ email, name, message });
      setInviteCode(code);
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Invite to {familyName}</h2>
          <TouchOptimized>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
        
        {inviteCode ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-800">Invitation Created</p>
              </div>
              <p className="text-green-700 mb-4">
                Share this invitation code with {name} to join your family.
              </p>
              
              <div className="bg-white border border-green-300 rounded-lg p-3 flex items-center justify-between mb-2">
                <code className="text-sm font-mono text-gray-800">{inviteCode}</code>
                <TouchOptimized>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                  >
                    {codeCopied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </TouchOptimized>
              </div>
              
              <p className="text-xs text-green-600">
                This code will expire in 7 days
              </p>
            </div>
            
            <div className="flex justify-end">
              <TouchOptimized>
                <button
                  onClick={onClose}
                  className="bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
                >
                  Done
                </button>
              </TouchOptimized>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="family.member@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="Family Member's Name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                placeholder="Add a personal message to your invitation"
                rows={3}
              />
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
                  disabled={!email.trim() || !name.trim() || isSubmitting}
                  className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      <span>Send Invitation</span>
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