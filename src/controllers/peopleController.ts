import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabaseService';
import { AppError } from '../middleware/errorHandler';
import { Person, Memory, FaceDetection, CreatePersonRequest, VerifyFaceRequest } from '../types/database';
// import { faceRecognitionQueue } from '../queues'; // Commented out until queues are set up

class PeopleController {
  // Get all people for the authenticated user
  async getPeople(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get people from database
      const { data: people, error } = await supabase
        .from('people')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) {
        throw new AppError(`Failed to get people: ${error.message}`, 500);
      }

      res.json({
        success: true,
        data: people || []
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
      const { data: person, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', personId)
        .single();

      if (error || !person) {
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

      const { name, relationship, reference_memory_id, face_region }: CreatePersonRequest = req.body;

      // Check if memory exists and belongs to user
      const { data: memory, error: memoryError } = await supabase
        .from('memories')
        .select('*')
        .eq('id', reference_memory_id)
        .single();

      if (memoryError || !memory) {
        throw new AppError('Reference memory not found', 404);
      }

      if (memory.user_id !== userId) {
        throw new AppError('Not authorized to use this memory', 403);
      }

      // Create person
      const { data: person, error: personError } = await supabase
        .from('people')
        .insert({
          user_id: userId,
          name,
          relationship,
          avatar_memory_id: reference_memory_id
        })
        .select()
        .single();

      if (personError || !person) {
        throw new AppError(`Failed to create person: ${personError?.message}`, 500);
      }

      // Create face detection for reference image
      const { data: faceDetection, error: faceError } = await supabase
        .from('face_detections')
        .insert({
          memory_id: reference_memory_id,
          person_id: person.id,
          bounding_box: face_region,
          confidence: 1.0, // User-defined face has 100% confidence
          is_verified: true
        })
        .select()
        .single();

      if (faceError || !faceDetection) {
        throw new AppError(`Failed to create face detection: ${faceError?.message}`, 500);
      }

      // TODO: Add to face recognition queue when implemented
      // await faceRecognitionQueue.add(
      //   'extract-face-embedding',
      //   {
      //     faceDetectionId: faceDetection.id,
      //     userId,
      //     personId: person.id
      //   },
      //   {
      //     priority: 1,
      //     attempts: 3
      //   }
      // );

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
      const { data: person, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', personId)
        .single();

      if (error || !person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to update this person', 403);
      }

      // Update person
      const { data: updatedPerson, error: updateError } = await supabase
        .from('people')
        .update(req.body)
        .eq('id', personId)
        .select()
        .single();

      if (updateError || !updatedPerson) {
        throw new AppError(`Failed to update person: ${updateError?.message}`, 500);
      }

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
      const { data: person, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', personId)
        .single();

      if (error || !person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to delete this person', 403);
      }

      // Delete person
      const { error: deleteError } = await supabase
        .from('people')
        .delete()
        .eq('id', personId);

      if (deleteError) {
        throw new AppError(`Failed to delete person: ${deleteError.message}`, 500);
      }

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
      const { data: person, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', personId)
        .single();

      if (error || !person) {
        throw new AppError('Person not found', 404);
      }

      if (person.user_id !== userId) {
        throw new AppError('Not authorized to access this person', 403);
      }

      // Get memories containing this person
      const { data: memories, error } = await supabase
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

      const { face_id, person_id, is_correct }: VerifyFaceRequest = req.body;

      // Check if face detection exists
      const { data: faceDetection, error: faceError } = await supabase
        .from('face_detections')
        .select('*')
        .eq('id', face_id)
        .single();

      if (faceError || !faceDetection) {
        throw new AppError('Face detection not found', 404);
      }

      // Check if memory belongs to user
      const { data: memory, error: memoryError } = await supabase
        .from('memories')
        .select('*')
        .eq('id', faceDetection.memory_id)
        .single();

      if (memoryError || !memory || memory.user_id !== userId) {
        throw new AppError('Not authorized to verify this face', 403);
      }

      // If correct, update face detection with person ID
      if (is_correct) {
        // Check if person exists and belongs to user
        const { data: person, error: personError } = await supabase
          .from('people')
          .select('*')
          .eq('id', person_id)
          .single();

        if (personError || !person) {
          throw new AppError('Person not found', 404);
        }

        if (person.user_id !== userId) {
          throw new AppError('Not authorized to use this person', 403);
        }

        // Update face detection
        const { error: updateError } = await supabase
          .from('face_detections')
          .update({
            person_id,
            is_verified: true
          })
          .eq('id', face_id);

        if (updateError) {
          throw new AppError(`Failed to update face detection: ${updateError.message}`, 500);
        }

        res.json({
          success: true,
          message: 'Face verification successful'
        });
      } else {
        // If incorrect, remove person ID from face detection
        const { error: updateError } = await supabase
          .from('face_detections')
          .update({
            person_id: null,
            is_verified: false
          })
          .eq('id', face_id);

        if (updateError) {
          throw new AppError(`Failed to update face detection: ${updateError.message}`, 500);
        }

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