import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if we have the required tokens
    const accessToken = searchParams.get('access_token') || 
                        (location.state as any)?.accessToken;
    const refreshToken = searchParams.get('refresh_token') || 
                         (location.state as any)?.refreshToken;
    
    if (!accessToken && !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams, location.state]);

  const validateForm = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) throw updateError;
      
      setSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sage-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Updated!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your password has been successfully updated. You'll be redirected to your dashboard shortly.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sage-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-700 rounded-full mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sage-800 mb-2">MemoryMesh</h1>
          <p className="text-lg text-sage-600">Reset Your Password</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sage-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
              Create New Password
            </h2>
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              Enter your new password below. Make sure it's secure and memorable.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 border rounded-xl bg-red-50 border-red-200 text-red-700">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-base font-medium">Error</p>
                  <p className="text-base mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-3">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-3">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-700 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[56px] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6 mr-3" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}