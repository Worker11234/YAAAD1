import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';
import { ApiError } from '../utils/apiError';
import logger from '../utils/logger';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;
    
    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });
    
    if (authError) {
      throw new ApiError(400, authError.message);
    }
    
    if (!authData.user) {
      throw new ApiError(500, 'Failed to create user');
    }
    
    // Create user record in our database
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        storage_quota_mb: 1000 // 1GB default quota
      });
    
    if (userError) {
      // Rollback auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new ApiError(500, 'Failed to create user record');
    }
    
    // Generate tokens
    const tokens = generateTokens(authData.user.id, email);
    
    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email,
          full_name
        },
        ...tokens
      }
    });
  } catch (error) {
    logger.error('Error registering user:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      throw new ApiError(401, authError.message);
    }
    
    if (!authData.user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Get user data from our database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (userError) {
      throw new ApiError(404, 'User not found');
    }
    
    // Generate tokens
    const tokens = generateTokens(authData.user.id, email);
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          avatar_url: userData.avatar_url
        },
        ...tokens
      }
    });
  } catch (error) {
    logger.error('Error logging in:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Login failed' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      throw new ApiError(400, 'Refresh token is required');
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET as string) as {
      id: string;
      email: string;
    };
    
    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', decoded.id)
      .single();
    
    if (error || !user) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    
    // Generate new tokens
    const tokens = generateTokens(user.id, user.email);
    
    return res.status(200).json({
      success: true,
      data: tokens
    });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Token refresh failed' });
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    // In a real implementation, we would invalidate the refresh token
    // For now, we'll just return a success response
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Error logging out:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw new ApiError(404, 'User not found');
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        storage_quota_mb: user.storage_quota_mb,
        preferences: user.preferences
      }
    });
  } catch (error) {
    logger.error('Error getting current user:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to get user data' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { full_name, avatar_url, preferences } = req.body;
    
    // Update user data
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        full_name,
        avatar_url,
        preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw new ApiError(500, 'Failed to update profile');
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        avatar_url: updatedUser.avatar_url,
        preferences: updatedUser.preferences
      }
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Helper function to generate JWT tokens
const generateTokens = (userId: string, email: string) => {
  // Access token
  const accessToken = jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRY || '1h' }
  );
  
  // Refresh token
  const refreshToken = jwt.sign(
    { id: userId, email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 3600, // 1 hour in seconds
    token_type: 'Bearer'
  };
};