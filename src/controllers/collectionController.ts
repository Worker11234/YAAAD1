import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import logger from '../utils/logger';
import { ApiError } from '../utils/apiError';

// Create a new collection
export const createCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, description, cover_memory_id, privacy_level } = req.body;
    
    // Create collection
    const { data: collection, error } = await supabase
      .from('collections')
      .insert({
        user_id: userId,
        name,
        description,
        cover_memory_id,
        privacy_level: privacy_level || 'private',
        is_auto_generated: false
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create collection: ${error.message}`);
    }
    
    return res.status(201).json({
      success: true,
      data: collection
    });
  } catch (error) {
    logger.error('Error creating collection:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to create collection' });
  }
};

// Get all collections for a user
export const getCollections = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const { data: collections, error } = await supabase
      .from('collections')
      .select(`
        *,
        memory_collections (
          memory_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to get collections: ${error.message}`);
    }
    
    // Count memories in each collection
    const collectionsWithCounts = collections.map(collection => ({
      ...collection,
      memory_count: collection.memory_collections?.length || 0
    }));
    
    return res.status(200).json({
      success: true,
      data: collectionsWithCounts
    });
  } catch (error) {
    logger.error('Error getting collections:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to get collections' });
  }
};

// Get collection by ID
export const getCollectionById = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;
    
    // Get collection
    const { data: collection, error } = await supabase
      .from('collections')
      .select(`
        *,
        memory_collections (
          memories (*)
        )
      `)
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw new ApiError(404, 'Collection not found');
    }
    
    // Flatten memories
    const memories = collection.memory_collections.map((mc: any) => mc.memories);
    
    return res.status(200).json({
      success: true,
      data: {
        ...collection,
        memories,
        memory_count: memories.length
      }
    });
  } catch (error) {
    logger.error('Error getting collection:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to get collection' });
  }
};

// Update collection
export const updateCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;
    const { name, description, cover_memory_id, privacy_level } = req.body;
    
    // Check if collection exists and belongs to user
    const { data: existingCollection, error: checkError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      throw new ApiError(404, 'Collection not found');
    }
    
    // Update collection
    const { data: updatedCollection, error } = await supabase
      .from('collections')
      .update({
        name,
        description,
        cover_memory_id,
        privacy_level,
        updated_at: new Date().toISOString()
      })
      .eq('id', collectionId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update collection: ${error.message}`);
    }
    
    return res.status(200).json({
      success: true,
      data: updatedCollection
    });
  } catch (error) {
    logger.error('Error updating collection:', error);
    <boltArtifact id="yaadein-ai-backend" title="Yaadein AI Backend Setup">
  }
}