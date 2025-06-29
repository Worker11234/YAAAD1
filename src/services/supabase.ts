import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
config();

// Validate required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Supabase URL or service key not provided in environment variables');
  process.exit(1);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    logger.error('Failed to connect to Supabase:', error);
  } else {
    logger.info('Connected to Supabase successfully');
  }
});

// Helper functions for common database operations
export const db = {
  // Generic query with error handling
  async query<T>(
    tableName: string,
    queryFn: (query: any) => any
  ): Promise<T[]> {
    try {
      let query = supabase.from(tableName).select('*');
      query = queryFn(query);
      
      const { data, error } = await query;
      
      if (error) {
        logger.error(`Database query error for ${tableName}:`, error);
        throw error;
      }
      
      return data as T[];
    } catch (error) {
      logger.error(`Unexpected error in db.query for ${tableName}:`, error);
      throw error;
    }
  },
  
  // Get a single record by ID
  async getById<T>(tableName: string, id: string, columns = '*'): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(columns)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        logger.error(`Database getById error for ${tableName}:`, error);
        throw error;
      }
      
      return data as T;
    } catch (error) {
      logger.error(`Unexpected error in db.getById for ${tableName}:`, error);
      throw error;
    }
  },
  
  // Insert a record
  async insert<T>(tableName: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) {
        logger.error(`Database insert error for ${tableName}:`, error);
        throw error;
      }
      
      return result as T;
    } catch (error) {
      logger.error(`Unexpected error in db.insert for ${tableName}:`, error);
      throw error;
    }
  },
  
  // Update a record
  async update<T>(tableName: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error(`Database update error for ${tableName}:`, error);
        throw error;
      }
      
      return result as T;
    } catch (error) {
      logger.error(`Unexpected error in db.update for ${tableName}:`, error);
      throw error;
    }
  },
  
  // Delete a record
  async delete(tableName: string, id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error(`Database delete error for ${tableName}:`, error);
        throw error;
      }
    } catch (error) {
      logger.error(`Unexpected error in db.delete for ${tableName}:`, error);
      throw error;
    }
  }
};