import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../services/supabaseService';
import { logger } from '../utils/logger';
import { QueueType, JobType, addJob } from '../services/queueService';

export const startGameSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const { game_type, difficulty, duration_minutes, categories } = req.body;

  // Validate game type
  const validGameTypes = ['tag_guess', 'memory_match', 'timeline_quiz', 'face_recognition'];
  if (!validGameTypes.includes(game_type)) {
    throw new AppError('Invalid game type', 400);
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
  if (!validDifficulties.includes(difficulty)) {
    throw new AppError('Invalid difficulty level', 400);
  }

  // Create game session
  const { data: gameSession, error: sessionError } = await supabase
    .from('game_sessions')
    .insert({
      user_id: userId,
      game_type,
      difficulty_level: difficulty,
      time_spent_seconds: 0,
      started_at: new Date().toISOString()
    })
    .select()
    .single();

  if (sessionError) {
    throw new AppError(`Failed to create game session: ${sessionError.message}`, 500);
  }

  // Generate first question based on game type
  let question;
  try {
    switch (game_type) {
      case 'tag_guess':
        question = await generateTagGuessQuestion(userId, difficulty, categories);
        break;
      case 'memory_match':
        question = await generateMemoryMatchQuestion(userId, difficulty);
        break;
      case 'timeline_quiz':
        question = await generateTimelineQuestion(userId, difficulty);
        break;
      case 'face_recognition':
        question = await generateFaceRecognitionQuestion(userId, difficulty);
        break;
      default:
        throw new AppError('Invalid game type', 400);
    }
  } catch (error) {
    logger.error('Error generating game question:', error);
    throw new AppError('Failed to generate game question', 500);
  }

  return res.status(200).json({
    success: true,
    data: {
      session_id: gameSession.id,
      current_question: question,
      game_state: {
        current_score: 0,
        current_streak: 0,
        questions_completed: 0,
        total_questions: calculateTotalQuestions(game_type, difficulty),
        hints_remaining: calculateHints(difficulty)
      }
    }
  });
});

export const submitAnswer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const sessionId = req.params.session_id;
  const { answer, time_taken, hints_used } = req.body;

  // Validate session ownership
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (sessionError || !session) {
    throw new AppError('Game session not found or access denied', 404);
  }

  if (session.completed_at) {
    throw new AppError('Game session already completed', 400);
  }

  // Get current question
  const { data: currentQuestion, error: questionError } = await supabase
    .from('game_questions')
    .select('*')
    .eq('game_session_id', sessionId)
    .eq('is_current', true)
    .single();

  if (questionError || !currentQuestion) {
    throw new AppError('Current question not found', 404);
  }

  // Check answer
  const isCorrect = checkAnswer(currentQuestion, answer);
  
  // Calculate points
  const points = calculatePoints(
    isCorrect,
    session.difficulty_level,
    time_taken,
    hints_used
  );

  // Record answer
  const { error: validationError } = await supabase
    .from('tag_validations')
    .insert({
      game_session_id: sessionId,
      memory_id: currentQuestion.memory_id,
      user_id: userId,
      user_guess: answer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
      points_awarded: points,
      time_to_answer_seconds: time_taken,
      hints_used: hints_used,
      difficulty_modifier: getDifficultyModifier(session.difficulty_level)
    });

  if (validationError) {
    throw new AppError(`Failed to record answer: ${validationError.message}`, 500);
  }

  // Update session stats
  const newScore = session.total_score + points;
  const newStreak = isCorrect ? session.current_streak + 1 : 0;
  const bestStreak = Math.max(session.best_streak, newStreak);
  const memoriesCompleted = session.memories_completed + 1;
  const hintsUsed = session.hints_used + (hints_used || 0);
  const timeSpent = session.time_spent_seconds + (time_taken || 0);

  // Check if this was the last question
  const isLastQuestion = memoriesCompleted >= calculateTotalQuestions(session.game_type, session.difficulty_level);

  // Update session
  const { error: updateError } = await supabase
    .from('game_sessions')
    .update({
      total_score: newScore,
      current_streak: newStreak,
      best_streak: bestStreak,
      memories_completed: memoriesCompleted,
      hints_used: hintsUsed,
      time_spent_seconds: timeSpent,
      ...(isLastQuestion && { completed_at: new Date().toISOString() })
    })
    .eq('id', sessionId);

  if (updateError) {
    throw new AppError(`Failed to update game session: ${updateError.message}`, 500);
  }

  // Mark current question as not current
  await supabase
    .from('game_questions')
    .update({ is_current: false })
    .eq('id', currentQuestion.id);

  // Generate next question if not the last one
  let nextQuestion = null;
  if (!isLastQuestion) {
    try {
      switch (session.game_type) {
        case 'tag_guess':
          nextQuestion = await generateTagGuessQuestion(userId, session.difficulty_level);
          break;
        case 'memory_match':
          nextQuestion = await generateMemoryMatchQuestion(userId, session.difficulty_level);
          break;
        case 'timeline_quiz':
          nextQuestion = await generateTimelineQuestion(userId, session.difficulty_level);
          break;
        case 'face_recognition':
          nextQuestion = await generateFaceRecognitionQuestion(userId, session.difficulty_level);
          break;
      }

      // Set as current question
      if (nextQuestion) {
        await supabase
          .from('game_questions')
          .update({ game_session_id: sessionId, is_current: true })
          .eq('id', nextQuestion.id);
      }
    } catch (error) {
      logger.error('Error generating next question:', error);
      // Continue even if next question generation fails
    }
  }

  // Check for achievements
  const achievements = await checkAchievements(userId, session);

  return res.status(200).json({
    success: true,
    data: {
      answer_result: {
        is_correct: isCorrect,
        points_awarded: points,
        correct_answer: currentQuestion.correct_answer
      },
      game_state: {
        current_score: newScore,
        current_streak: newStreak,
        best_streak: bestStreak,
        questions_completed: memoriesCompleted,
        total_questions: calculateTotalQuestions(session.game_type, session.difficulty_level),
        hints_remaining: calculateHints(session.difficulty_level) - hintsUsed,
        is_completed: isLastQuestion
      },
      next_question: nextQuestion,
      achievements: achievements.length > 0 ? achievements : undefined
    }
  });
});

export const getGameHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const limit = parseInt(req.query.limit as string || '10', 10);
  const offset = parseInt(req.query.offset as string || '0', 10);

  // Get game sessions
  const { data: sessions, error, count } = await supabase
    .from('game_sessions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new AppError(`Failed to retrieve game history: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: {
      sessions,
      total: count || 0,
      limit,
      offset
    }
  });
});

export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;

  // Get user achievements
  const { data: userAchievements, error: userAchievementsError } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements (*)
    `)
    .eq('user_id', userId);

  if (userAchievementsError) {
    throw new AppError(`Failed to retrieve achievements: ${userAchievementsError.message}`, 500);
  }

  // Get all achievements to show locked ones too
  const { data: allAchievements, error: allAchievementsError } = await supabase
    .from('achievements')
    .select('*');

  if (allAchievementsError) {
    throw new AppError(`Failed to retrieve achievements: ${allAchievementsError.message}`, 500);
  }

  // Combine data to show unlocked and locked achievements
  const unlockedAchievementIds = userAchievements.map(ua => ua.achievement_id);
  
  const achievements = allAchievements.map(achievement => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
    return {
      ...achievement,
      unlocked: !!userAchievement,
      unlocked_at: userAchievement?.unlocked_at || null
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      achievements,
      total_unlocked: unlockedAchievementIds.length,
      total: allAchievements.length
    }
  });
});

// Helper functions
async function generateTagGuessQuestion(userId: string, difficulty: string, categories?: string[]) {
  // Implementation would fetch a memory and generate a tag guessing question
  // This is a simplified placeholder
  return {
    id: 'question-uuid',
    type: 'tag_guess',
    memory: {
      id: 'memory-uuid',
      image_url: 'https://example.com/image.jpg',
      thumbnail_url: 'https://example.com/thumbnail.jpg',
      hints: [
        'This photo was taken during golden hour',
        'There are people in this image',
        'This is an outdoor scene'
      ]
    },
    options: ['sunset', 'sunrise', 'noon', 'midnight'],
    correct_answer: 'sunset',
    time_limit_seconds: 30,
    points_possible: 10
  };
}

async function generateMemoryMatchQuestion(userId: string, difficulty: string) {
  // Implementation would generate a memory matching question
  // This is a simplified placeholder
  return {
    id: 'question-uuid',
    type: 'memory_match',
    memory_pairs: [
      {
        id: 'pair1',
        memory1: { id: 'mem1', thumbnail_url: 'https://example.com/thumb1.jpg' },
        memory2: { id: 'mem2', thumbnail_url: 'https://example.com/thumb2.jpg' }
      }
    ],
    time_limit_seconds: 60,
    points_possible: 20
  };
}

async function generateTimelineQuestion(userId: string, difficulty: string) {
  // Implementation would generate a timeline ordering question
  // This is a simplified placeholder
  return {
    id: 'question-uuid',
    type: 'timeline_quiz',
    memories: [
      { id: 'mem1', thumbnail_url: 'https://example.com/thumb1.jpg', taken_at: '2023-01-01' },
      { id: 'mem2', thumbnail_url: 'https://example.com/thumb2.jpg', taken_at: '2023-06-15' },
      { id: 'mem3', thumbnail_url: 'https://example.com/thumb3.jpg', taken_at: '2024-01-01' }
    ],
    correct_order: ['mem1', 'mem2', 'mem3'],
    time_limit_seconds: 45,
    points_possible: 15
  };
}

async function generateFaceRecognitionQuestion(userId: string, difficulty: string) {
  // Implementation would generate a face recognition question
  // This is a simplified placeholder
  return {
    id: 'question-uuid',
    type: 'face_recognition',
    memory: {
      id: 'memory-uuid',
      image_url: 'https://example.com/image.jpg',
      thumbnail_url: 'https://example.com/thumbnail.jpg',
      face_region: { x: 100, y: 150, width: 80, height: 80 }
    },
    options: ['Mom', 'Dad', 'Grandma', 'Uncle John'],
    correct_answer: 'Mom',
    time_limit_seconds: 20,
    points_possible: 10
  };
}

function checkAnswer(question: any, answer: string): boolean {
  // Simple implementation - in a real app, this would be more sophisticated
  return question.correct_answer === answer;
}

function calculatePoints(
  isCorrect: boolean,
  difficulty: string,
  timeTaken: number,
  hintsUsed: number
): number {
  if (!isCorrect) return 0;

  // Base points by difficulty
  const basePoints = {
    easy: 10,
    medium: 20,
    hard: 30,
    expert: 50
  }[difficulty] || 10;

  // Time bonus (faster = more points)
  const timeBonus = Math.max(0, 10 - Math.floor(timeTaken / 3));

  // Hint penalty
  const hintPenalty = hintsUsed * 5;

  return Math.max(0, basePoints + timeBonus - hintPenalty);
}

function getDifficultyModifier(difficulty: string): number {
  return {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 3.0
  }[difficulty] || 1.0;
}

function calculateTotalQuestions(gameType: string, difficulty: string): number {
  // Number of questions based on game type and difficulty
  const baseQuestions = {
    tag_guess: 10,
    memory_match: 8,
    timeline_quiz: 5,
    face_recognition: 12
  }[gameType] || 10;

  // Adjust based on difficulty
  const difficultyMultiplier = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.2,
    expert: 1.5
  }[difficulty] || 1.0;

  return Math.round(baseQuestions * difficultyMultiplier);
}

function calculateHints(difficulty: string): number {
  return {
    easy: 5,
    medium: 3,
    hard: 2,
    expert: 1
  }[difficulty] || 3;
}

async function checkAchievements(userId: string, session: any): Promise<any[]> {
  // This would check for achievements based on the game session
  // Simplified implementation
  return [];
}