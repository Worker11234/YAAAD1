import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../services/supabaseService';
import { logger } from '../utils/logger';
import { QueueType, JobType, addJob } from '../services/queueService';

export const createPerson = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const { name, relationship, reference_memory_id, face_region } = req.body;

  // Validate required fields
  if (!name) {
    throw new AppError('Name is required', 400);
  }

  if (!reference_memory_id) {
    throw new AppError('Reference memory ID is required', 400);
  }

  if (!face_region) {
    throw new AppError('Face region is required', 400);
  }

  // Verify memory ownership
  const { data: memory, error: memoryError } = await supabase
    .from('memories')
    .select('id')
    .eq('id', reference_memory_id)
    .eq('user_id', userId)
    .single();

  if (memoryError || !memory) {
    throw new AppError('Memory not found or access denied', 404);
  }

  // Create person record
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

  if (personError) {
    throw new AppError(`Failed to create person: ${personError.message}`, 500);
  }

  // Queue face encoding job
  await addJob(
    QueueType.FACE_RECOGNITION,
    JobType.TRAIN_FACE_MODEL,
    {
      personId: person.id,
      memoryId: reference_memory_id,
      faceRegion: face_region,
      userId
    }
  );

  return res.status(201).json({
    success: true,
    data: person
  });
});

export const getPeople = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;

  // Get all people for the user
  const { data: people, error } = await supabase
    .from('people')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    throw new AppError(`Failed to retrieve people: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: people
  });
});

export const getPersonById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const personId = req.params.id;

  // Get person
  const { data: person, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', personId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Person not found', 404);
    }
    throw new AppError(`Failed to retrieve person: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: person
  });
});

export const updatePerson = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const personId = req.params.id;
  const { name, relationship, avatar_memory_id } = req.body;

  // Verify person ownership
  const { data: person, error: personError } = await supabase
    .from('people')
    .select('id')
    .eq('id', personId)
    .eq('user_id', userId)
    .single();

  if (personError || !person) {
    throw new AppError('Person not found or access denied', 404);
  }

  // Verify memory ownership if avatar_memory_id is provided
  if (avatar_memory_id) {
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('id')
      .eq('id', avatar_memory_id)
      .eq('user_id', userId)
      .single();

    if (memoryError || !memory) {
      throw new AppError('Memory not found or access denied', 404);
    }
  }

  // Update person
  const { data: updatedPerson, error: updateError } = await supabase
    .from('people')
    .update({
      name,
      relationship,
      ...(avatar_memory_id && { avatar_memory_id })
    })
    .eq('id', personId)
    .select()
    .single();

  if (updateError) {
    throw new AppError(`Failed to update person: ${updateError.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: updatedPerson
  });
});

export const deletePerson = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const personId = req.params.id;

  // Verify person ownership
  const { data: person, error: personError } = await supabase
    .from('people')
    .select('id')
    .eq('id', personId)
    .eq('user_id', userId)
    .single();

  if (personError || !person) {
    throw new AppError('Person not found or access denied', 404);
  }

  // Delete person
  const { error: deleteError } = await supabase
    .from('people')
    .delete()
    .eq('id', personId);

  if (deleteError) {
    throw new AppError(`Failed to delete person: ${deleteError.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    message: 'Person deleted successfully'
  });
});

export const getPersonMemories = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const personId = req.params.id;
  const limit = parseInt(req.query.limit as string || '20', 10);
  const offset = parseInt(req.query.offset as string || '0', 10);

  // Verify person ownership
  const { data: person, error: personError } = await supabase
    .from('people')
    .select('id')
    .eq('id', personId)
    .eq('user_id', userId)
    .single();

  if (personError || !person) {
    throw new AppError('Person not found or access denied', 404);
  }

  // Get memories containing this person
  const { data: memories, error, count } = await supabase
    .from('memories')
    .select(`
      *,
      face_detections!inner (
        id,
        person_id
      )
    `, { count: 'exact' })
    .eq('user_id', userId)
    .eq('face_detections.person_id', personId)
    .order('taken_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new AppError(`Failed to retrieve memories: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: {
      memories,
      total: count || 0,
      limit,
      offset
    }
  });
});

export const verifyFace = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const memoryId = req.params.memory_id;
  const { face_id, person_id, is_correct } = req.body;

  // Verify memory ownership
  const { data: memory, error: memoryError } = await supabase
    .from('memories')
    .select('id')
    .eq('id', memoryId)
    .eq('user_id', userId)
    .single();

  if (memoryError || !memory) {
    throw new AppError('Memory not found or access denied', 404);
  }

  // Verify face detection exists
  const { data: faceDetection, error: faceError } = await supabase
    .from('face_detections')
    .select('id')
    .eq('id', face_id)
    .eq('memory_id', memoryId)
    .single();

  if (faceError || !faceDetection) {
    throw new AppError('Face detection not found', 404);
  }

  // If verifying with a person, check person ownership
  if (person_id && is_correct) {
    const { data: person, error: personError } = await supabase
      .from('people')
      .select('id')
      .eq('id', person_id)
      .eq('user_id', userId)
      .single();

    if (personError || !person) {
      throw new AppError('Person not found or access denied', 404);
    }
  }

  // Update face detection
  const { data: updatedFace, error: updateError } = await supabase
    .from('face_detections')
    .update({
      person_id: is_correct ? person_id : null,
      is_verified: true
    })
    .eq('id', face_id)
    .select()
    .single();

  if (updateError) {
    throw new AppError(`Failed to update face detection: ${updateError.message}`, 500);
  }

  // If verification is correct, queue face encoding update
  if (is_correct && person_id) {
    await addJob(
      QueueType.FACE_RECOGNITION,
      JobType.TRAIN_FACE_MODEL,
      {
        personId: person_id,
        memoryId,
        faceId: face_id,
        userId
      }
    );
  }

  return res.status(200).json({
    success: true,
    data: updatedFace
  });
});