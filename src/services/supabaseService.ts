import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { logger } from '../utils/logger';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Supabase URL or service key is missing');
  process.exit(1);
}

// Create Supabase client with service key for admin access
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anon key for public access
export const supabasePublic = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY || ''
);

// Test connection
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      logger.error('Supabase connection test failed:', error);
      return false;
    }
    
    logger.info('Supabase connection test successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection test failed:', error);
    return false;
  }
};

// Initialize Supabase connection
export const initializeSupabase = async () => {
  const isConnected = await testSupabaseConnection();
  if (!isConnected) {
    logger.warn('Could not connect to Supabase. Some features may not work properly.');
  }
  return isConnected;
};