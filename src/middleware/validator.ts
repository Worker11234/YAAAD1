import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import multer from 'multer';
import { AppError } from './errorHandler';

// Validate request body against schema
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: errors.array()
        }
      });
    }

    next();
  };
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB default
  }
});

// Validation for image upload
export const validateImageUpload = [
  body('collection_id').optional().isUUID().withMessage('Invalid collection ID'),
  body('taken_at').optional().isISO8601().withMessage('Invalid date format'),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('auto_tag').optional().isBoolean().withMessage('auto_tag must be a boolean'),
  body('detect_faces').optional().isBoolean().withMessage('detect_faces must be a boolean'),
  body('extract_text').optional().isBoolean().withMessage('extract_text must be a boolean'),
  (req: Request, res: Response, next: NextFunction) => {
    // Validate file types and sizes
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return next(new AppError('No files uploaded', 400));
    }
    
    next();
  }
];

// Validation for search parameters
export const validateSearch = [
  body('q').optional().isString().withMessage('Search query must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('people').optional().isArray().withMessage('People must be an array'),
  body('date_from').optional().isISO8601().withMessage('Invalid date format'),
  body('date_to').optional().isISO8601().withMessage('Invalid date format'),
  body('location.radius').optional().isNumeric().withMessage('Radius must be a number'),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('collection_id').optional().isUUID().withMessage('Invalid collection ID'),
  body('sort').optional().isIn(['relevance', 'date', 'popularity']).withMessage('Invalid sort option'),
  body('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  body('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer')
];

// Validation for game session creation
export const validateGameSession = [
  body('game_type').isIn(['tag_guess', 'memory_match', 'timeline_quiz', 'face_recognition'])
    .withMessage('Invalid game type'),
  body('difficulty').isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Invalid difficulty level'),
  body('duration_minutes').optional().isInt({ min: 1, max: 30 })
    .withMessage('Duration must be between 1 and 30 minutes'),
  body('categories').optional().isArray().withMessage('Categories must be an array')
];