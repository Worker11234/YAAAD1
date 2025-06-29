import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow, OnboardingData } from '../components/onboarding/OnboardingFlow';
import { useAuth } from '../hooks/useAuth';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      console.log('Onboarding completed with data:', data);
      
      // Store onboarding data in localStorage
      localStorage.setItem('memorymesh_profile', JSON.stringify({
        full_name: data.profile.name,
        relationship: data.profile.relationship,
        age: data.profile.age,
        language: data.profile.language,
        timezone: data.profile.timezone,
        accessibility_needs: data.profile.accessibilityNeeds,
        avatar_url: data.profile.profilePhoto
      }));
      
      // Mark onboarding as completed
      localStorage.setItem('memorymesh_onboarding_completed', 'true');
      localStorage.setItem('memorymesh_onboarding_data', JSON.stringify(data));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Redirect if user is not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}