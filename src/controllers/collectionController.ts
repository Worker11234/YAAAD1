import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../services/supabaseService';
import { logger } from '../utils/logger';

export const createCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const { name, description, cover_memory_id, privacy_level } = req.body;

  // Validate required fields
  if (!name) {
    throw new AppError('Collection name is required', 400);
  }

  // Verify cover memory ownership if provided
  if (cover_memory_id) {
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('id')
      .eq('id', cover_memory_id)
      .eq('user_id', userId)
      .single();

    if (memoryError || !memory) {
      throw new AppError('Cover memory not found or access denied', 404);
    }
  }

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
    throw new AppError(`Failed to create collection: ${error.message}`, 500);
  }

  return res.status(201).json({
    success: true,
    data: collection
  });
});

export const getCollections = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;

  // Get all collections for the user
  const { data: collections, error } = await supabase
    .from('collections')
    .select(`
      *,
      memory_count:memory_collections(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to retrieve collections: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: collections
  });
});

export const getCollectionById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const collectionId = req.params.id;

  // Get collection
  const { data: collection, error } = await supabase
    .from('collections')
    .select(`
      *,
      memory_count:memory_collections(count)
    `)
    .eq('id', collectionId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Collection not found', 404);
    }
    throw new AppError(`Failed to retrieve collection: ${error.message}`, 500);
  }

  // Get memories in collection
  const { data: memories, error: memoriesError } = await supabase
    .from('memory_collections')
    .select(`
      memory_id,
      memories (*)
    `)
    .eq('collection_id', collectionId)
    .order('added_at', { ascending: false });

  if (memoriesError) {
    throw new AppError(`Failed to retrieve collection memories: ${memoriesError.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: {
      ...collection,
      memories: memories.map(m => m.memories)
    }
  });
});

export const updateCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const collectionId = req.params.id;
  const { name, description, cover_memory_id, privacy_level } = req.body;

  // Verify collection ownership
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', userId)
    .single();

  if (collectionError || !collection) {
    throw new AppError('Collection not found or access denied', 404);
  }

  // Verify cover memory ownership if provided
  if (cover_memory_id) {
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('id')
      .eq('id', cover_memory_id)
      .eq('user_id', userId)
      .single();

    if (memoryError || !memory) {
      throw new AppError('Cover memory not found or access denied', 404);
    }
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
    throw new AppError(`Failed to update collection: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: updatedCollection
  });
});

export const deleteCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const collectionId = req.params.id;

  // Verify collection ownership
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', userId)
    .single();

  if (collectionError || !collection) {
    throw new AppError('Collection not found or access denied', 404);
  }

  // Delete collection
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId);

  if (error) {
    throw new AppError(`Failed to delete collection: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    message: 'Collection deleted successfully'
  });
});

export const addMemoryToCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const collectionId = req.params.id;
  const { memory_id } = req.body;

  // Validate required fields
  if (!memory_id) {
    throw new AppError('Memory ID is required', 400);
  }

  // Verify collection ownership
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', userId)
    .single();

  if (collectionError || !collection) {
    throw new AppError('Collection not found or access denied', 404);
  }

  // Verify memory ownership
  const { data: memory, error: memoryError } = await supabase
    .from('memories')
    .select('id')
    .eq('id', memory_id)
    .eq('user_id', userId)
    .single();

  if (memoryError || !memory) {
    throw new AppError('Memory not found or access denied', 404);
  }

  // Add memory to collection
  const { error } = await supabase
    .from('memory_collections')
    .insert({
      memory_id,
      collection_id: collectionId
    });

  if (error) {
    // Check if it's a duplicate entry error
    if (error.code === '23505') {
      throw new AppError('Memory is already in this collection', 400);
    }
    throw new AppError(`Failed to add memory to collection: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    message: 'Memory added to collection successfully'
  });
});

export const removeMemoryFromCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const collectionId = req.params.id;
  const memoryId = req.params.memory_id;

  // Verify collection ownership
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', userId)
    .single();

  if (collectionError || !collection) {
    throw new AppError('Collection not found or access denied', 404);
  }

  // Remove memory from collection
  const { error } = await supabase
    .from('memory_collections')
    .delete()
    .eq('collection_id', collectionId)
    .eq('memory_id', memoryId);

  if (error) {
    throw new AppError(`Failed to remove memory from collection: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    message: 'Memory removed from collection successfully'
  });
});

export const generateSmartCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const { criteria } = req.body;

  // Validate criteria
  if (!criteria || !criteria.rules || !Array.isArray(criteria.rules) || criteria.rules.length === 0) {
    throw new AppError('Invalid criteria format', 400);
  }

  // Create collection
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .insert({
      user_id: userId,
      name: criteria.suggested_name || 'Smart Collection',
      description: 'Automatically generated collection',
      is_auto_generated: true,
      auto_criteria: criteria.rules,
      privacy_level: 'private'
    })
    .select()
    .single();

  if (collectionError) {
    throw new AppError(`Failed to create collection: ${collectionError.message}`, 500);
  }

  // Find memories matching criteria
  // This is a simplified implementation - in a real app, this would be more sophisticated
  let query = supabase
    .from('memories')
    .select('id')
    .eq('user_id', userId);

  // Apply rules
  for (const rule of criteria.rules) {
    switch (rule.field) {
      case 'tags':
        if (rule.operator === 'contains') {
          query = query.contains('tags', [rule.value]);
        }
        break;
      case 'date_range':
        if (rule.operator === 'between' && Array.isArray(rule.value) && rule.value.length === 2) {
          query = query.gte('taken_at', rule.value[0]).lte('taken_at', rule.value[1]);
        }
        break;
      // Add more rule types as needed
    }
  }

  const { data: matchingMemories, error: memoriesError } = await query;

  if (memoriesError) {
    throw new AppError(`Failed to find matching memories: ${memoriesError.message}`, 500);
  }

  // Add matching memories to collection
  if (matchingMemories.length > 0) {
    const memoryCollections = matchingMemories.map(memory => ({
      memory_id: memory.id,
      collection_id: collection.id
    }));

    const { error: insertError } = await supabase
      .from('memory_collections')
      .insert(memoryCollections);

    if (insertError) {
      logger.error('Failed to add memories to collection:', insertError);
      // Continue even if some inserts fail
    }
  }

  // Get collection with memory count
  const { data: updatedCollection, error: getError } = await supabase
    .from('collections')
    .select(`
      *,
      memory_count:memory_collections(count)
    `)
    .eq('id', collection.id)
    .single();

  if (getError) {
    throw new AppError(`Failed to retrieve updated collection: ${getError.message}`, 500);
  }

  return res.status(201).json({
    success: true,
    data: updatedCollection
  });
});