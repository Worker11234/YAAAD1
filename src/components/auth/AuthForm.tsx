import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Mail, Lock, User, AlertCircle, Clock, CheckCircle, Loader2, Github, Chrome, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TouchOptimized } from '../ui/TouchOptimized';

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'forgot';
  onToggleMode: (mode: 'signin' | 'signup' | 'forgot') => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'info'>('error');

  const { signIn, signUp, resetPassword, signInWithSocial } = useAuth();

  const getErrorDetails = (errorMessage: string) => {
    const lowerMessage = errorMessage.toLowerCase();
    
    if (lowerMessage.includes('invalid login credentials') || lowerMessage.includes('invalid_credentials')) {
      return {
        type: 'error' as const,
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please double-check your credentials and try again.',
        icon: AlertCircle
      };
    }
    
    if (lowerMessage.includes('email not confirmed') || lowerMessage.includes('email_not_confirmed')) {
      return {
        type: 'warning' as const,
        title: 'Email Not Verified',
        message: 'Please check your email inbox (including spam folder) and click the verification link to confirm your account before signing in.',
        icon: Mail
      };
    }
    
    if (lowerMessage.includes('over_email_send_rate_limit') || lowerMessage.includes('rate limit')) {
      return {
        type: 'info' as const,
        title: 'Rate Limit Reached',
        message: 'Too many requests have been made. Please wait a moment before trying again for security purposes.',
        icon: Clock
      };
    }
    
    if (lowerMessage.includes('user already registered') || lowerMessage.includes('already registered')) {
      return {
        type: 'info' as const,
        title: 'Account Already Exists',
        message: 'An account with this email already exists. Try signing in instead, or use a different email address.',
        icon: User
      };
    }
    
    return {
      type: 'error' as const,
      title: 'Authentication Error',
      message: errorMessage,
      icon: AlertCircle
    };
  };

  const validateForm = () => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    if (mode === 'signin' && !password) {
      setError('Please enter your password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setErrorType('error');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      } else if (mode === 'signup') {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
        
        setErrorType('info');
        setSuccess('Account created successfully! Please check your email to verify your account before signing in.');
        
        // Automatically switch to sign in mode after successful signup
        setTimeout(() => {
          onToggleMode('signin');
        }, 3000);
        
        return;
      } else if (mode === 'forgot') {
        const { error: resetError } = await resetPassword(email);
        if (resetError) throw resetError;
        
        setErrorType('info');
        setSuccess('Password reset email sent! Please check your inbox for instructions.');
        return;
      }
    } catch (err: any) {
      const errorDetails = getErrorDetails(err.message);
      setErrorType(errorDetails.type);
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'github' | 'google' | 'discord') => {
    setError('');
    setSuccess('');
    setSocialLoading(provider);

    try {
      const { error } = await signInWithSocial(provider);
      if (error) throw error;
    } catch (err: any) {
      const errorDetails = getErrorDetails(err.message);
      setErrorType(errorDetails.type);
      setError(errorDetails.message);
    } finally {
      setSocialLoading(null);
    }
  };

  const getMessageStyles = (type: 'error' | 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  const getMessageIcon = (message: string, type: 'error' | 'warning' | 'info' | 'success') => {
    if (type === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />;
    }
    
    const errorDetails = getErrorDetails(message);
    const IconComponent = errorDetails.icon;
    
    switch (type) {
      case 'warning':
        return <IconComponent className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      case 'info':
        return <IconComponent className="w-5 h-5 text-blue-600 flex-shrink-0" />;
      default:
        return <IconComponent className="w-5 h-5 text-red-600 flex-shrink-0" />;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Join Your Family';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Create your account to start preserving precious family memories together';
      case 'forgot': return 'Enter your email address and we\'ll send you a link to reset your password';
      default: return 'Sign in to access your family\'s precious memories';
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-700 rounded-full mb-6 shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-sage-800 mb-2 app-name">Yaadein</h1>
        <p className="text-lg text-sage-600">Preserve & Share Family Memories</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sage-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            {getTitle()}
          </h2>
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            {getSubtitle()}
          </p>
        </div>

        {/* Success/Error Messages */}
        {(error || success) && (
          <div className={`mb-6 p-4 border rounded-xl ${getMessageStyles(success ? 'success' : errorType)}`}>
            <div className="flex items-start space-x-3">
              {getMessageIcon(error || success, success ? 'success' : errorType)}
              <div className="flex-1">
                <p className="text-base font-medium">
                  {success ? 'Success!' : getErrorDetails(error).title}
                </p>
                <p className="text-base mt-1">
                  {success || error}
                </p>
                {errorType === 'warning' && error.includes('email') && (
                  <p className="text-sm mt-2 opacity-75">
                    Didn't receive the email? Check your spam folder or contact support.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Social Login Buttons */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="space-y-3 mb-6">
            <TouchOptimized>
              <button
                onClick={() => handleSocialSignIn('github')}
                disabled={loading || !!socialLoading}
                className="w-full flex items-center justify-center space-x-3 bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {socialLoading === 'github' ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  <Github className="w-5 h-5 mr-2" />
                )}
                <span>Continue with GitHub</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => handleSocialSignIn('google')}
                disabled={loading || !!socialLoading}
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2" />
                )}
                <span>Continue with Google</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => handleSocialSignIn('discord')}
                disabled={loading || !!socialLoading}
                className="w-full flex items-center justify-center space-x-3 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {socialLoading === 'discord' ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  <MessageSquare className="w-5 h-5 mr-2" />
                )}
                <span>Continue with Discord</span>
              </button>
            </TouchOptimized>
            
            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <div className="bg-white px-4 relative z-10 text-sm text-gray-500">or continue with email</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name - Only for signup */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-lg font-medium text-gray-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password - Not for forgot password */}
          {mode !== 'forgot' && (
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-3">
                Password
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
                  placeholder="Enter your password"
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
          )}

          {/* Confirm Password - Only for signup */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-3">
                Confirm Password
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
                  placeholder="Confirm your password"
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full bg-sage-700 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[56px] flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 mr-3" />
                Please wait...
              </>
            ) : (
              <>
                {mode === 'signin' && 'Sign In to Your Family'}
                {mode === 'signup' && 'Create Family Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        {/* Navigation Links */}
        <div className="mt-8 space-y-4 text-center">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => onToggleMode('forgot')}
                className="text-lg text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                Forgot your password?
              </button>
              <div className="text-lg text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => onToggleMode('signup')}
                  className="text-sage-600 hover:text-sage-700 font-semibold transition-colors"
                >
                  Join your family
                </button>
              </div>
            </>
          )}
          
          {mode === 'signup' && (
            <div className="text-lg text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onToggleMode('signin')}
                className="text-sage-600 hover:text-sage-700 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </div>
          )}
          
          {mode === 'forgot' && (
            <div className="text-lg text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => onToggleMode('signin')}
                className="text-sage-600 hover:text-sage-700 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}