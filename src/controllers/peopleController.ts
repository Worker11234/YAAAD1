import { Request, Response, NextFunction } from 'express';
import { db } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { faceRecognitionQueue } from '../queues';

class PeopleController {
  // Get all people for the authenticated user
  async getPeople(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get people from database
      const people = await db.query('people', query => 
        query
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true })
      );

      res.json({
        success: true,
        data: people
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single person by ID
  async getPersonById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const personId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get person
      const person = await db.getById('people', personId);
      if (!person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to access this person', 403);
      }

      res.json({
        success: true,
        data: person
      });
    } catch (error) {
      next(error);
    }
  }

  // Create a new person
  async createPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { name, relationship, reference_memory_id, face_region } = req.body;

      // Check if memory exists and belongs to user
      const memory = await db.getById('memories', reference_memory_id);
      if (!memory) {
        throw new AppError('Reference memory not found', 404);
      }

      if (memory.user_id !== userId) {
        throw new AppError('Not authorized to use this memory', 403);
      }

      // Create person
      const person = await db.insert('people', {
        user_id: userId,
        name,
        relationship,
        avatar_memory_id: reference_memory_id
      });

      // Create face detection for reference image
      const faceDetection = await db.insert('face_detections', {
        memory_id: reference_memory_id,
        person_id: person.id,
        bounding_box: face_region,
        confidence: 1.0, // User-defined face has 100% confidence
        is_verified: true
      });

      // Add to face recognition queue to extract face embedding
      await faceRecognitionQueue.add(
        'extract-face-embedding',
        {
          faceDetectionId: faceDetection.id,
          userId,
          personId: person.id
        },
        {
          priority: 1,
          attempts: 3
        }
      );

      res.status(201).json({
        success: true,
        data: {
          person,
          face_detection: faceDetection
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a person
  async updatePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const personId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if person exists and belongs to user
      const person = await db.getById('people', personId);
      if (!person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to update this person', 403);
      }

      // Update person
      const updatedPerson = await db.update('people', personId, req.body);

      res.json({
        success: true,
        data: updatedPerson
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a person
  async deletePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const personId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if person exists and belongs to user
      const person = await db.getById('people', personId);
      if (!person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to delete this person', 403);
      }

      // Delete person
      await db.delete('people', personId);

      res.json({
        success: true,
        message: 'Person deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get memories for a person
  async getPersonMemories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const personId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if person exists and belongs to user
      const person = await db.getById('people', personId);
      if (!person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to access this person', 403);
      }

      // Get memories containing this person
      const { data: memories, error } = await db.supabase
        .from('memories')
        .select(`
          *,
          face_detections!inner(*)
        `)
        .eq('user_id', userId)
        .eq('face_detections.person_id', personId)
        .order('taken_at', { ascending: false });

      if (error) {
        throw new AppError(`Failed to get memories: ${error.message}`, 500);
      }

      res.json({
        success: true,
        data: memories || []
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify face detection
  async verifyFace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { face_id, person_id, is_correct } = req.body;

      // Check if face detection exists
      const faceDetection = await db.getById('face_detections', face_id);
      if (!faceDetection) {
        throw new AppError('Face detection not found', 404);
      }

      // Check if memory belongs to user
      const memory = await db.getById('memories', faceDetection.memory_id);
      if (!memory || memory.user_id !== userId) {
        throw new AppError('Not authorized to verify this face', 403);
      }

      // If correct, update face detection with person ID
      if (is_correct) {
        // Check if person exists and belongs to user
        const person = await db.getById('people', person_id);
        if (!person) {
          throw new AppError('Person not found', 404);
        }

        if (person.user_id !== userId) {
          throw new AppError('Not authorized to use this person', 403);
        }

        // Update face detection
        await db.update('face_detections', face_id, {
          person_id,
          is_verified: true
        });

        res.json({
          success: true,
          message: 'Face verification successful'
        });
      } else {
        // If incorrect, remove person ID from face detection
        await db.update('face_detections', face_id, {
          person_id: null,
          is_verified: false
        });

        res.json({
          success: true,
          message: 'Face verification rejected'
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

// Create an instance of the controller
const peopleController = new PeopleController();

// Export individual methods for use in routes
export const createPerson = peopleController.createPerson.bind(peopleController);
export const getPeople = peopleController.getPeople.bind(peopleController);
export const getPersonById = peopleController.getPersonById.bind(peopleController);
export const updatePerson = peopleController.updatePerson.bind(peopleController);
export const deletePerson = peopleController.deletePerson.bind(peopleController);
export const getPersonMemories = peopleController.getPersonMemories.bind(peopleController);
export const verifyFace = peopleController.verifyFace.bind(peopleController);

// Also export the class for potential future use
export { PeopleController };