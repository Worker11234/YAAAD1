import React, { useState } from 'react';
import { MessageSquare, Star, Send, X } from 'lucide-react';
import { TouchOptimized } from './TouchOptimized';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string; email?: string }) => void;
}

export function FeedbackForm({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Submit feedback
    onSubmit({
      rating,
      comment,
      email: email || undefined,
    });
    
    // Reset form
    setRating(0);
    setComment('');
    setEmail('');
    setIsSubmitting(false);
    
    // Close form
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-sage-600" />
            <h3 className="text-lg font-semibold text-gray-900">Share Your Feedback</h3>
          </div>
          <TouchOptimized>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchOptimized key={value}>
                  <button
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`
                        ${(hoveredRating || rating) >= value
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'}
                        transition-colors
                      `}
                    />
                  </button>
                </TouchOptimized>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your feedback
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
              placeholder="Tell us what you think..."
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder="Your email for follow-up"
            />
          </div>
          
          <div className="flex justify-end">
            <TouchOptimized>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
              >
                Cancel
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>Submit Feedback</span>
              </button>
            </TouchOptimized>
          </div>
        </form>
      </div>
    </div>
  );
}