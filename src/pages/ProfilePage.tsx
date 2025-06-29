import React, { useState, useEffect } from 'react';
import { 
  User, Camera, Save, Loader2, Globe, Clock, 
  Calendar, Shield, AlertTriangle, Check, X, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { ProfilePhotoUploader } from '../components/settings/ProfilePhotoUploader';
import { LanguageSelector } from '../components/settings/LanguageSelector';

export function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: '',
    relationship: '',
    age: '',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    accessibility_needs: [] as string[]
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        // Load profile from localStorage instead of Supabase
        const storedProfile = localStorage.getItem('memorymesh_profile');
        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          setProfile({
            full_name: profileData.full_name || user.user_metadata?.full_name || '',
            avatar_url: profileData.avatar_url || '',
            relationship: profileData.relationship || '',
            age: profileData.age ? String(profileData.age) : '',
            language: profileData.language || 'en',
            timezone: profileData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            accessibility_needs: profileData.accessibility_needs || []
          });
        } else {
          // No profile exists yet, use user metadata
          setProfile({
            full_name: user.user_metadata?.full_name || '',
            avatar_url: '',
            relationship: '',
            age: '',
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            accessibility_needs: []
          });
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Save profile to localStorage
      localStorage.setItem('memorymesh_profile', JSON.stringify({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        relationship: profile.relationship,
        age: profile.age,
        language: profile.language,
        timezone: profile.timezone,
        accessibility_needs: profile.accessibility_needs
      }));
      
      // Update user profile in auth hook
      await updateUserProfile({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        relationship: profile.relationship,
        age: profile.age,
        language: profile.language,
        timezone: profile.timezone,
        accessibility_needs: profile.accessibility_needs
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Unexpected error updating profile:', err);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfile(prev => ({
      ...prev,
      avatar_url: photoUrl || ''
    }));
  };

  const toggleAccessibilityNeed = (need: string) => {
    setProfile(prev => {
      const needs = [...prev.accessibility_needs];
      const index = needs.indexOf(need);
      
      if (index === -1) {
        needs.push(need);
      } else {
        needs.splice(index, 1);
      }
      
      return {
        ...prev,
        accessibility_needs: needs
      };
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-sage-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/settings" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Settings</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-lg text-gray-600">
              Manage your personal information
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm font-medium">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Photo</h2>
            <ProfilePhotoUploader
              currentPhotoUrl={profile.avatar_url}
              onPhotoChange={handlePhotoChange}
            />
          </div>

          {/* Basic Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Your full name"
                />
              </div>
              
              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              
              {/* Family Relationship */}
              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  Family Relationship
                </label>
                <select
                  id="relationship"
                  value={profile.relationship}
                  onChange={(e) => setProfile(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option value="">Select relationship...</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="grandchild">Grandchild</option>
                  <option value="sibling">Sibling</option>
                  <option value="spouse">Spouse/Partner</option>
                  <option value="aunt-uncle">Aunt/Uncle</option>
                  <option value="niece-nephew">Niece/Nephew</option>
                  <option value="cousin">Cousin</option>
                  <option value="other">Other Family Member</option>
                </select>
              </div>
              
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age (Optional)
                </label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Your age"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Language
                </label>
                <LanguageSelector />
              </div>
              
              {/* Timezone */}
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={profile.timezone}
                  onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accessibility Needs */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Preferences</h2>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Select any features that would help you use MemoryMesh more easily:
              </p>
              
              {[
                { id: 'large-text', label: 'Larger text size' },
                { id: 'high-contrast', label: 'High contrast colors' },
                { id: 'voice-commands', label: 'Voice command support' },
                { id: 'simple-interface', label: 'Simplified interface' },
                { id: 'audio-descriptions', label: 'Audio descriptions' }
              ].map(option => (
                <TouchOptimized key={option.id}>
                  <label className="flex items-center space-x-3 p-3 rounded-xl hover:bg-sage-25 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.accessibility_needs.includes(option.id)}
                      onChange={() => toggleAccessibilityNeed(option.id)}
                      className="w-5 h-5 text-sage-600 border-2 border-gray-300 rounded focus:ring-sage-500"
                    />
                    <span className="text-base text-gray-700">{option.label}</span>
                  </label>
                </TouchOptimized>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-sage-600" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              For detailed privacy controls and data management options, visit our Privacy Controls page.
            </p>
            
            <TouchOptimized>
              <Link
                to="/privacy"
                className="inline-flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium"
              >
                <Shield size={16} />
                <span>Privacy Controls</span>
              </Link>
            </TouchOptimized>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mb-8">
        <TouchOptimized>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
}