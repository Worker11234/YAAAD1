import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import logger from './logger';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Missing Supabase credentials');
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    logger.error('Supabase connection error:', error);
  } else {
    logger.info('Supabase connected successfully');
  }
});