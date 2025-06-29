import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { WelcomeSection } from '../components/auth/WelcomeSection';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  // Check if this is a callback from social login
  useEffect(() => {
    const handleAuthCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if ((accessToken || refreshToken) && type === 'recovery') {
        // This is a password reset callback
        navigate('/reset-password', { 
          replace: true,
          state: { accessToken, refreshToken }
        });
        return;
      }

      if (accessToken || refreshToken) {
        setIsProcessingCallback(true);
        // Wait for auth state to update
        setTimeout(() => {
          setIsProcessingCallback(false);
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isProcessingCallback) {
      navigate('/dashboard');
    }
  }, [user, navigate, isProcessingCallback]);

  if (isProcessingCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-sage-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h2>
          <p className="text-gray-600">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    // Mobile: Single column layout
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800">
        <div className="min-h-screen flex items-center justify-center p-4">
          <AuthForm mode={mode} onToggleMode={setMode} />
        </div>
      </div>
    );
  }

  // Desktop: Split screen layout
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>
        
        <WelcomeSection />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-8">
        <AuthForm mode={mode} onToggleMode={setMode} />
      </div>
    </div>
  );
}