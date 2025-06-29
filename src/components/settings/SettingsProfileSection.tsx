import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TouchOptimized } from '../ui/TouchOptimized';

interface SettingsProfileSectionProps {
  className?: string;
}

export function SettingsProfileSection({ className = '' }: SettingsProfileSectionProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        // Load profile from localStorage instead of Supabase
        const storedProfile = localStorage.getItem('memorymesh_profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          // Use user metadata as fallback
          setProfile({
            full_name: user.user_metadata?.full_name || 'Your Name',
            relationship: 'Family Member'
          });
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile?.full_name || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-sage-600" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {profile?.full_name || 'Your Name'}
          </h3>
          <p className="text-gray-600">
            {profile?.relationship 
              ? profile.relationship.charAt(0).toUpperCase() + profile.relationship.slice(1) 
              : 'Family Member'}
          </p>
        </div>
      </div>
      
      <TouchOptimized>
        <Link 
          to="/profile" 
          className="flex items-center justify-between w-full p-4 bg-sage-50 rounded-xl hover:bg-sage-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Edit2 className="w-5 h-5 text-sage-600" />
            <span className="font-medium text-gray-900">Edit Profile</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </TouchOptimized>
    </div>
  );
}