import { Request, Response, NextFunction } from 'express';
import { db } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class TagsController {
  // Get all tags for the authenticated user
  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Parse query parameters
      const category = req.query.category as string;
      const limit = parseInt(req.query.limit as string || '100', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);

      // Build query
      let query = db.supabase
        .from('tags')
        .select(`
          *,
          memories!inner(user_id)
        `)
        .eq('memories.user_id', userId);

      // Apply category filter if provided
      if (category) {
        query = query.eq('tag_category', category);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      // Execute query
      const { data: tags, error, count } = await query;

      if (error) {
        throw new AppError(`Failed to get tags: ${error.message}`, 500);
      }

      res.json({
        success: true,
        data: {
          tags: tags || [],
          total: count || 0,
          limit,
          offset
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get tags for a specific memory
  async getTagsByMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const memoryId = req.params.memoryId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if memory exists and belongs to user
      const memory = await db.getById('memories', memoryId);
      if (!memory) {
        throw new AppError('Memory not found', 404);
      }

      if (memory.user_id !== userId) {
        throw new AppError('Not authorized to access this memory', 403);
      }

      // Get tags for memory
      const tags = await db.query('tags', query => 
        query
          .select('*')
          .eq('memory_id', memoryId)
          .order('confidence', { ascending: false })
      );

      res.json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }

  // Create a new tag
  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { memory_id, tag_name, tag_category, confidence, is_ai_generated } = req.body;

      // Check if memory exists and belongs to user
      const memory = await db.getById('memories', memory_id);
      if (!memory) {
        throw new AppError('Memory not found', 404);
      }

      if (memory.user_id !== userId) {
        throw new AppError('Not authorized to tag this memory', 403);
      }

      // Check if tag already exists for this memory
      const existingTags = await db.query('tags', query => 
        query
          .select('*')
          .eq('memory_id', memory_id)
          .eq('tag_name', tag_name)
      );

      if (existingTags.length > 0) {
        throw new AppError('Tag already exists for this memory', 400);
      }

      // Create tag
      const tag = await db.insert('tags', {
        memory_id,
        tag_name,
        tag_category,
        confidence: confidence || 1.0,
        is_ai_generated: is_ai_generated || false,
        created_by: userId
      });

      res.status(201).json({
        success: true,
        data: tag
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a tag
  async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const tagId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if tag exists
      const tag = await db.getById('tags', tagId);
      if (!tag) {
        throw new AppError('Tag not found', 404);
      }

      // Check if memory belongs to user
      const memory = await db.getById('memories', tag.memory_id);
      if (!memory || memory.user_id !== userId) {
        throw new AppError('Not authorized to update this tag', 403);
      }

      // Update tag
      const updatedTag = await db.update('tags', tagId, req.body);

      res.json({
        success: true,
        data: updatedTag
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a tag
  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const tagId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if tag exists
      const tag = await db.getById('tags', tagId);
      if (!tag) {
        throw new AppError('Tag not found', 404);
      }

      // Check if memory belongs to user
      const memory = await db.getById('memories', tag.memory_id);
      if (!memory || memory.user_id !== userId) {
        throw new AppError('Not authorized to delete this tag', 403);
      }

      // Delete tag
      await db.delete('tags', tagId);

      res.json({
        success: true,
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get tag statistics
  async getTagStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get tag counts by category
      const { data: categoryCounts, error: categoryError } = await db.supabase
        .from('tags')
        .select('tag_category, count(*)')
        .eq('created_by', userId)
        .group('tag_category');

      if (categoryError) {
        throw new AppError('Failed to get tag category counts', 500);
      }

      // Get top tags
      const { data: topTags, error: topTagsError } = await db.supabase
        .from('tags')
        .select('tag_name, count(*)')
        .eq('created_by', userId)
        .group('tag_name')
        .order('count', { ascending: false })
        .limit(10);

      if (topTagsError) {
        throw new AppError('Failed to get top tags', 500);
      }

      // Get AI vs. manual tag counts
      const { data: aiCounts, error: aiError } = await db.supabase
        .from('tags')
        .select('is_ai_generated, count(*)')
        .eq('created_by', userId)
        .group('is_ai_generated');

      if (aiError) {
        throw new AppError('Failed to get AI tag counts', 500);
      }

      res.json({
        success: true,
        data: {
          by_category: categoryCounts || [],
          top_tags: topTags || [],
          ai_vs_manual: aiCounts || []
        }
      });
    } catch (error) {
      next(error);
    }
  }
}