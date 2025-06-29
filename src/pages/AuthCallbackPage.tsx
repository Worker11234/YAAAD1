import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if this is a password reset callback
        const type = searchParams.get('type');
        if (type === 'recovery') {
          navigate('/reset-password', { replace: true });
          return;
        }

        // For other auth callbacks, wait for auth state to update
        if (user) {
          // Check if user has completed onboarding
          const hasCompletedOnboarding = localStorage.getItem('memorymesh_onboarding_completed') === 'true';
          
          if (hasCompletedOnboarding) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        } else {
          // If no user after 3 seconds, something went wrong
          setTimeout(() => {
            if (!user) {
              setError('Authentication failed. Please try again.');
            }
          }, 3000);
        }
      } catch (err) {
        console.error('Error processing auth callback:', err);
        setError('An error occurred during authentication. Please try again.');
      }
    };

    processCallback();
  }, [searchParams, navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-700 rounded-full mb-6 shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-sage-800 mb-4">MemoryMesh</h1>
        
        {error ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sage-100">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/auth', { replace: true })}
              className="bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sage-100">
            <Loader2 className="w-12 h-12 text-sage-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Sign In</h2>
            <p className="text-gray-600">Please wait while we complete the authentication process...</p>
          </div>
        )}
      </div>
    </div>
  );
}