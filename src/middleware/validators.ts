import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Memory upload validation
export const validateMemoryUpload = [
  body('collection_id').optional().isUUID(),
  body('taken_at').optional().isISO8601(),
  body('location').optional().isObject(),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }),
  body('location.lng').optional().isFloat({ min: -180, max: 180 }),
  body('location.address').optional().isString(),
  validate
];

// Memory search validation
export const validateMemorySearch = [
  query('q').optional().isString(),
  query('tags').optional().isString(),
  query('people').optional().isString(),
  query('date_from').optional().isISO8601(),
  query('date_to').optional().isISO8601(),
  query('location').optional().isString(),
  query('collection_id').optional().isUUID(),
  query('sort').optional().isIn(['date', 'relevance', 'popularity']),
  query('order').optional().isIn(['asc', 'desc']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  validate
];

// Game start validation
export const validateGameStart = [
  body('game_type').isIn(['tag_guess', 'memory_match', 'timeline_quiz', 'face_recognition']),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard', 'expert']),
  body('duration_minutes').optional().isInt({ min: 1, max: 60 }),
  body('categories').optional().isArray(),
  validate
];

// Game answer validation
export const validateGameAnswer = [
  param('sessionId').isUUID(),
  body('answer').isString(),
  body('time_taken').optional().isInt({ min: 0 }),
  body('hints_used').optional().isInt({ min: 0 }),
  validate
];

// Person validation
export const validatePerson = [
  body('name').isString().notEmpty(),
  body('relationship').optional().isString(),
  body('reference_memory_id').optional().isUUID(),
  body('face_region').optional().isObject(),
  body('face_region.x').optional().isInt({ min: 0 }),
  body('face_region.y').optional().isInt({ min: 0 }),
  body('face_region.width').optional().isInt({ min: 1 }),
  body('face_region.height').optional().isInt({ min: 1 }),
  validate
];

// Face verification validation
export const validateFaceVerification = [
  body('face_id').isUUID(),
  body('person_id').optional().isUUID(),
  body('is_correct').isBoolean(),
  validate
];

// Collection validation
export const validateCollection = [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('cover_memory_id').optional().isUUID(),
  body('privacy_level').optional().isIn(['private', 'family', 'public']),
  validate
];

// Auto collection validation
export const validateAutoCollection = [
  body('criteria').isObject(),
  body('criteria.type').isIn(['smart', 'manual']),
  body('criteria.rules').isArray(),
  body('criteria.suggested_name').optional().isString(),
  validate
];

// Auth validations
export const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('full_name').isString().notEmpty(),
  validate
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
  validate
];