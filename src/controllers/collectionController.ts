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
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to update collection' });
  }
};

// Delete collection
export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Check if collection exists and belongs to user
    const { data: existingCollection, error: checkError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      throw new ApiError(404, 'Collection not found');
    }
    
    // Delete the collection (this should cascade delete memory_collections due to foreign key)
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete collection: ${error.message}`);
    }
    
    return res.status(200).json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting collection:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to delete collection' });
  }
};

// Add memory to collection
export const addMemoryToCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id: collectionId } = req.params;
    const { memory_id } = req.body;
    
    // Check if collection exists and belongs to user
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();
    
    if (collectionError) {
      throw new ApiError(404, 'Collection not found');
    }
    
    // Check if memory exists and belongs to user
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('id')
      .eq('id', memory_id)
      .eq('user_id', userId)
      .single();
    
    if (memoryError) {
      throw new ApiError(404, 'Memory not found');
    }
    
    // Check if memory is already in collection
    const { data: existing, error: existingError } = await supabase
      .from('memory_collections')
      .select('id')
      .eq('memory_id', memory_id)
      .eq('collection_id', collectionId)
      .single();
    
    if (existing) {
      throw new ApiError(409, 'Memory is already in this collection');
    }
    
    // Add memory to collection
    const { data: memoryCollection, error } = await supabase
      .from('memory_collections')
      .insert({
        memory_id,
        collection_id: collectionId
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to add memory to collection: ${error.message}`);
    }
    
    return res.status(201).json({
      success: true,
      message: 'Memory added to collection successfully',
      data: memoryCollection
    });
  } catch (error) {
    logger.error('Error adding memory to collection:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to add memory to collection' });
  }
};

// Remove memory from collection
export const removeMemoryFromCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id: collectionId, memory_id } = req.params;
    
    // Check if collection exists and belongs to user
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();
    
    if (collectionError) {
      throw new ApiError(404, 'Collection not found');
    }
    
    // Remove memory from collection
    const { data: deleted, error } = await supabase
      .from('memory_collections')
      .delete()
      .eq('memory_id', memory_id)
      .eq('collection_id', collectionId)
      .select();
    
    if (error) {
      throw new Error(`Failed to remove memory from collection: ${error.message}`);
    }
    
    if (!deleted || deleted.length === 0) {
      throw new ApiError(404, 'Memory not found in this collection');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Memory removed from collection successfully'
    });
  } catch (error) {
    logger.error('Error removing memory from collection:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to remove memory from collection' });
  }
};

// Generate smart collection
export const generateSmartCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { criteria } = req.body;
    
    // Basic implementation - you can enhance this with AI/ML logic
    let query = supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId);
    
    // Apply criteria filters
    if (criteria.date_range) {
      if (criteria.date_range.start) {
        query = query.gte('created_at', criteria.date_range.start);
      }
      if (criteria.date_range.end) {
        query = query.lte('created_at', criteria.date_range.end);
      }
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      query = query.contains('tags', criteria.tags);
    }
    
    if (criteria.location) {
      query = query.ilike('location', `%${criteria.location}%`);
    }
    
    // Get matching memories
    const { data: memories, error: memoriesError } = await query;
    
    if (memoriesError) {
      throw new Error(`Failed to fetch memories: ${memoriesError.message}`);
    }
    
    if (!memories || memories.length === 0) {
      throw new ApiError(404, 'No memories found matching the criteria');
    }
    
    // Create the smart collection
    const collectionName = `Smart Collection - ${new Date().toLocaleDateString()}`;
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .insert({
        user_id: userId,
        name: collectionName,
        description: `Auto-generated collection based on: ${JSON.stringify(criteria)}`,
        privacy_level: 'private',
        is_auto_generated: true
      })
      .select()
      .single();
    
    if (collectionError) {
      throw new Error(`Failed to create smart collection: ${collectionError.message}`);
    }
    
    // Add memories to the collection
    const memoryCollections = memories.map(memory => ({
      memory_id: memory.id,
      collection_id: collection.id
    }));
    
    const { error: insertError } = await supabase
      .from('memory_collections')
      .insert(memoryCollections);
    
    if (insertError) {
      // If adding memories fails, clean up the collection
      await supabase.from('collections').delete().eq('id', collection.id);
      throw new Error(`Failed to add memories to smart collection: ${insertError.message}`);
    }
    
    return res.status(201).json({
      success: true,
      message: 'Smart collection generated successfully',
      data: {
        ...collection,
        memory_count: memories.length,
        criteria
      }
    });
  } catch (error) {
    logger.error('Error generating smart collection:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to generate smart collection' });
  }
};