import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new AppError(`Validation error: ${errorMessage}`, 400));
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // Memory upload validation
  memoryUpload: Joi.object({
    collection_id: Joi.string().uuid().allow(null, ''),
    taken_at: Joi.date().iso().allow(null, ''),
    location: Joi.object({
      lat: Joi.number().min(-90).max(90),
      lng: Joi.number().min(-180).max(180),
      address: Joi.string().allow(null, '')
    }).allow(null),
    auto_tag: Joi.boolean().default(true),
    detect_faces: Joi.boolean().default(true),
    extract_text: Joi.boolean().default(false),
    privacy_level: Joi.string().valid('private', 'family', 'public').default('private')
  }),

  // Tag validation
  tagCreate: Joi.object({
    memory_id: Joi.string().uuid().required(),
    tag_name: Joi.string().min(1).max(100).required(),
    tag_category: Joi.string().valid('object', 'person', 'emotion', 'activity', 'location', 'event').required(),
    confidence: Joi.number().min(0).max(1).default(1),
    is_ai_generated: Joi.boolean().default(false)
  }),

  // Game session validation
  gameSession: Joi.object({
    game_type: Joi.string().valid('tag_guess', 'memory_match', 'timeline_quiz', 'face_recognition').required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'expert').default('medium'),
    duration_minutes: Joi.number().integer().min(1).max(30).default(5),
    categories: Joi.array().items(Joi.string()).default([])
  }),

  // Person/face validation
  personCreate: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    relationship: Joi.string().valid('family', 'friend', 'colleague', 'acquaintance').default('family'),
    reference_memory_id: Joi.string().uuid().required(),
    face_region: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
      width: Joi.number().required(),
      height: Joi.number().required()
    }).required()
  })
};