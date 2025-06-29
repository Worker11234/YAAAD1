import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Check if user is stored in localStorage when Supabase is not available
      const storedUser = localStorage.getItem('memorymesh_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } else {
      // Mock sign in functionality
      console.log('Sign in with:', email, password);
      
      // Create a mock user
      const mockUser = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: 'Demo User',
        },
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
      };
      
      // Store in localStorage
      localStorage.setItem('memorymesh_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { data: { user: mockUser }, error: null };
    }
  };

  const signInWithSocial = async (provider: 'github' | 'google' | 'discord') => {
    if (!supabase) {
      console.warn('Supabase client not initialized. Social login not available.');
      return { error: new Error('Supabase client not initialized') };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`
      }
    });

    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      // If signup is successful, create a profile record
      if (data.user && !error) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      return { data, error };
    } else {
      // Mock sign up functionality
      console.log('Sign up with:', email, password, fullName);
      
      // Create a mock user
      const mockUser = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: fullName,
        },
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
      };
      
      // Store in localStorage
      localStorage.setItem('memorymesh_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { data: { user: mockUser }, error: null };
    }
  };

  const signOut = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      return { error };
    } else {
      // Remove user from localStorage
      localStorage.removeItem('memorymesh_user');
      setUser(null);
      
      return { error: null };
    }
  };

  const resetPassword = async (email: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_SITE_URL}/reset-password`,
      });
      return { data, error };
    } else {
      // Mock reset password functionality
      console.log('Reset password for:', email);
      
      return { data: {}, error: null };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { data, error };
    } else {
      // Mock update password functionality
      console.log('Update password to:', newPassword);
      
      return { data: {}, error: null };
    }
  };

  const updateUserProfile = async (profileData: any) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }
    
    // Convert age to number if it's a string
    if (typeof profileData.age === 'string' && profileData.age.trim() !== '') {
      profileData.age = parseInt(profileData.age, 10);
    } else if (profileData.age === '') {
      profileData.age = null;
    }
    
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      return { data, error };
    } else {
      // Store profile in localStorage
      const storedProfile = localStorage.getItem('memorymesh_profile');
      const currentProfile = storedProfile ? JSON.parse(storedProfile) : {};
      
      const updatedProfile = {
        ...currentProfile,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('memorymesh_profile', JSON.stringify(updatedProfile));
      
      // Update user metadata
      if (user) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            full_name: profileData.full_name,
          }
        };
        
        localStorage.setItem('memorymesh_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return { data: updatedProfile, error: null };
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return { success: false, error: { message: 'User not authenticated' } };
    }
    
    if (supabase) {
      try {
        // Get the current session to retrieve the access token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.access_token) {
          throw new Error('Failed to get authentication token');
        }
        
        // Call the edge function to delete the user with proper authorization
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          console.error('Delete user function error:', result);
          throw new Error(result.error || 'Failed to delete account');
        }
        
        // Sign out the user after successful deletion
        await signOut();
        
        return { success: true };
      } catch (error: any) {
        console.error('Error deleting account:', error);
        return { success: false, error };
      }
    } else {
      // Mock delete account functionality
      localStorage.removeItem('memorymesh_user');
      localStorage.removeItem('memorymesh_profile');
      setUser(null);
      
      return { success: true, error: null };
    }
  };

  return {
    user,
    loading,
    signIn,
    signInWithSocial,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateUserProfile,
    deleteAccount
  };
}