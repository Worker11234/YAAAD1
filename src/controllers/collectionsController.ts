import { Request, Response, NextFunction } from 'express';
import { db } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class CollectionsController {
  // Get all collections for the authenticated user
  async getCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Parse query parameters
      const limit = parseInt(req.query.limit as string || '20', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);

      // Get collections from database
      const collections = await db.query('collections', query => 
        query
          .select(`
            *,
            memory_collections(count)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)
      );

      // Get total count
      const { count, error: countError } = await db.supabase
        .from('collections')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError('Failed to get collection count', 500);
      }

      res.json({
        success: true,
        data: {
          collections,
          total: count || 0,
          limit,
          offset
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single collection by ID
  async getCollectionById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const collectionId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get collection with related data
      const collection = await db.query('collections', query => 
        query
          .select(`
            *,
            memory_collections(
              memories(*)
            )
          `)
          .eq('id', collectionId)
          .eq('user_id', userId)
          .single()
      );

      if (!collection || collection.length === 0) {
        throw new AppError('Collection not found', 404);
      }

      res.json({
        success: true,
        data: collection[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // Create a new collection
  async createCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { name, description, cover_memory_id, privacy_level } = req.body;

      // Check if cover memory exists and belongs to user
      if (cover_memory_id) {
        const memory = await db.getById('memories', cover_memory_id);
        if (!memory) {
          throw new AppError('Cover memory not found', 404);
        }

        if (memory.user_id !== userId) {
          throw new AppError('Not authorized to use this memory', 403);
        }
      }

      // Create collection
      const collection = await db.insert('collections', {
        user_id: userId,
        name,
        description,
        cover_memory_id,
        privacy_level: privacy_level || 'private',
        is_auto_generated: false
      });

      res.status(201).json({
        success: true,
        data: collection
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a collection
  async updateCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const collectionId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if collection exists and belongs to user
      const collection = await db.getById('collections', collectionId);
      if (!collection) {
        throw new AppError('Collection not found', 404);
      }

      if (collection.user_id !== userId) {
        throw new AppError('Not authorized to update this collection', 403);
      }

      // Check if cover memory exists and belongs to user
      if (req.body.cover_memory_id) {
        const memory = await db.getById('memories', req.body.cover_memory_id);
        if (!memory) {
          throw new AppError('Cover memory not found', 404);
        }

        if (memory.user_id !== userId) {
          throw new AppError('Not authorized to use this memory', 403);
        }
      }

      // Update collection
      const updatedCollection = await db.update('collections', collectionId, req.body);

      res.json({
        success: true,
        data: updatedCollection
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a collection
  async deleteCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const collectionId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if collection exists and belongs to user
      const collection = await db.getById('collections', collectionId);
      if (!collection) {
        throw new AppError('Collection not found', 404);
      }

      if (collection.user_id !== userId) {
        throw new AppError('Not authorized to delete this collection', 403);
      }

      // Delete collection
      await db.delete('collections', collectionId);

      res.json({
        success: true,
        message: 'Collection deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Add memories to a collection
  async addMemoriesToCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const collectionId = req.params.id;
      const { memory_ids } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!memory_ids || !Array.isArray(memory_ids) || memory_ids.length === 0) {
        throw new AppError('No memory IDs provided', 400);
      }

      // Check if collection exists and belongs to user
      const collection = await db.getById('collections', collectionId);
      if (!collection) {
        throw new AppError('Collection not found', 404);
      }

      if (collection.user_id !== userId) {
        throw new AppError('Not authorized to modify this collection', 403);
      }

      // Check if memories exist and belong to user
      for (const memoryId of memory_ids) {
        const memory = await db.getById('memories', memoryId);
        if (!memory) {
          throw new AppError(`Memory ${memoryId} not found`, 404);
        }

        if (memory.user_id !== userId) {
          throw new AppError(`Not authorized to add memory ${memoryId}`, 403);
        }
      }

      // Add memories to collection
      const results = [];
      for (const memoryId of memory_ids) {
        try {
          // Check if already in collection
          const existing = await db.query('memory_collections', query => 
            query
              .select('*')
              .eq('memory_id', memoryId)
              .eq('collection_id', collectionId)
          );

          if (existing.length === 0) {
            const result = await db.insert('memory_collections', {
              memory_id: memoryId,
              collection_id: collectionId
            });
            results.push(result);
          }
        } catch (error) {
          logger.error(`Error adding memory ${memoryId} to collection:`, error);
        }
      }

      res.json({
        success: true,
        data: {
          added_count: results.length,
          collection_id: collectionId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove memories from a collection
  async removeMemoriesFromCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const collectionId = req.params.id;
      const { memory_ids } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!memory_ids || !Array.isArray(memory_ids) || memory_ids.length === 0) {
        throw new AppError('No memory IDs provided', 400);
      }

      // Check if collection exists and belongs to user
      const collection = await db.getById('collections', collectionId);
      if (!collection) {
        throw new AppError('Collection not found', 404);
      }

      if (collection.user_id !== userId) {
        throw new AppError('Not authorized to modify this collection', 403);
      }

      // Remove memories from collection
      for (const memoryId of memory_ids) {
        const { error } = await db.supabase
          .from('memory_collections')
          .delete()
          .eq('memory_id', memoryId)
          .eq('collection_id', collectionId);

        if (error) {
          logger.error(`Error removing memory ${memoryId} from collection:`, error);
        }
      }

      res.json({
        success: true,
        message: 'Memories removed from collection successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Auto-generate a collection
  async autoGenerateCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { criteria } = req.body;
      if (!criteria || !criteria.rules || !Array.isArray(criteria.rules)) {
        throw new AppError('Invalid criteria format', 400);
      }

      // Create collection
      const collection = await db.insert('collections', {
        user_id: userId,
        name: criteria.suggested_name || 'Auto-generated Collection',
        description: 'Automatically generated based on criteria',
        is_auto_generated: true,
        auto_criteria: criteria.rules,
        privacy_level: 'private'
      });

      // Find memories matching criteria
      const matchingMemories = await this.findMemoriesMatchingCriteria(userId, criteria.rules);

      // Add memories to collection
      if (matchingMemories.length > 0) {
        for (const memory of matchingMemories) {
          await db.insert('memory_collections', {
            memory_id: memory.id,
            collection_id: collection.id
          });
        }
      }

      // If there are memories, set the first one as cover
      if (matchingMemories.length > 0) {
        await db.update('collections', collection.id, {
          cover_memory_id: matchingMemories[0].id
        });
      }

      res.status(201).json({
        success: true,
        data: {
          collection,
          memory_count: matchingMemories.length,
          memories: matchingMemories.slice(0, 5) // Return first 5 memories
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper methods
  private async findMemoriesMatchingCriteria(userId: string, rules: any[]): Promise<any[]> {
    try {
      // Start with base query
      let query = db.supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId);

      // Apply each rule
      for (const rule of rules) {
        switch (rule.field) {
          case 'tags':
            if (rule.operator === 'contains') {
              query = query.in('tags.tag_name', [rule.value]);
            }
            break;
          
          case 'date_range':
            if (rule.operator === 'between' && Array.isArray(rule.value) && rule.value.length === 2) {
              query = query.gte('taken_at', rule.value[0]).lte('taken_at', rule.value[1]);
            }
            break;
          
          case 'people':
            if (rule.operator === 'includes' && Array.isArray(rule.value)) {
              query = query.in('face_detections.people.name', rule.value);
            }
            break;
          
          case 'location':
            if (rule.operator === 'contains') {
              query = query.ilike('location_data->>address', `%${rule.value}%`);
            }
            break;
        }
      }

      // Execute query
      const { data, error } = await query;

      if (error) {
        logger.error('Error finding memories matching criteria:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error in findMemoriesMatchingCriteria:', error);
      return [];
    }
  }
}