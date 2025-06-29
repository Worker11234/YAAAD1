import { supabase } from '../utils/supabase';
import { ApiError } from '../utils/apiError';
import logger from '../utils/logger';

interface GameOptions {
  gameType: string;
  difficulty: string;
  durationMinutes: number;
  categories?: string[];
}

interface AnswerSubmission {
  answer: string;
  timeTaken: number;
  hintsUsed: number;
}

export class GameService {
  async startGameSession(userId: string, options: GameOptions) {
    try {
      // Create game session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: userId,
          game_type: options.gameType,
          difficulty_level: options.difficulty || 'medium',
          time_spent_seconds: 0
        })
        .select()
        .single();
      
      if (sessionError) {
        throw new Error(`Failed to create game session: ${sessionError.message}`);
      }
      
      // Generate first question
      const question = await this.generateQuestion(userId, session.id, options);
      
      return {
        session_id: session.id,
        current_question: question,
        game_state: {
          current_score: 0,
          current_streak: 0,
          questions_completed: 0,
          total_questions: 20,
          hints_remaining: 3
        }
      };
    } catch (error) {
      logger.error('Error starting game session:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to start game session');
    }
  }

  private async generateQuestion(userId: string, sessionId: string, options: GameOptions) {
    try {
      // Get random memory for the question
      const { data: memories, error: memoriesError } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (memoriesError) {
        throw new Error(`Failed to get memories: ${memoriesError.message}`);
      }
      
      if (!memories || memories.length === 0) {
        throw new ApiError(400, 'Not enough memories to start a game');
      }
      
      // Select a random memory
      const randomMemory = memories[Math.floor(Math.random() * memories.length)];
      
      // Get tags for the memory
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('memory_id', randomMemory.id);
      
      if (tagsError) {
        throw new Error(`Failed to get tags: ${tagsError.message}`);
      }
      
      // Generate question based on game type
      let question;
      switch (options.gameType) {
        case 'tag_guess':
          question = this.generateTagGuessQuestion(randomMemory, tags);
          break;
        case 'memory_match':
          question = this.generateMemoryMatchQuestion(randomMemory, memories);
          break;
        case 'timeline_quiz':
          question = this.generateTimelineQuestion(randomMemory, memories);
          break;
        case 'face_recognition':
          question = this.generateFaceRecognitionQuestion(randomMemory);
          break;
        default:
          throw new ApiError(400, 'Invalid game type');
      }
      
      return question;
    } catch (error) {
      logger.error('Error generating question:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to generate question');
    }
  }

  private generateTagGuessQuestion(memory: any, tags: any[]) {
    // Select a random tag as the correct answer
    const correctTag = tags.length > 0 
      ? tags[Math.floor(Math.random() * tags.length)]
      : { tag_name: 'photo' }; // Fallback
    
    // Generate 3 random incorrect options
    const incorrectOptions = [
      'sunset', 'family', 'vacation', 'birthday',
      'holiday', 'beach', 'mountains', 'food',
      'pet', 'travel', 'nature', 'city'
    ].filter(tag => tag !== correctTag.tag_name);
    
    // Shuffle and take 3
    const shuffledOptions = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Add correct answer and shuffle again
    const options = [...shuffledOptions, correctTag.tag_name].sort(() => 0.5 - Math.random());
    
    return {
      id: `question-${Date.now()}`,
      type: 'tag_guess',
      memory: {
        id: memory.id,
        image_url: memory.image_url,
        thumbnail_url: memory.thumbnail_url,
        hints: [
          'Look at the main subject of the image',
          'Consider the setting or environment',
          'Think about the activities shown'
        ]
      },
      options,
      correct_answer: correctTag.tag_name,
      time_limit_seconds: 30,
      points_possible: 10
    };
  }

  private generateMemoryMatchQuestion(memory: any, allMemories: any[]) {
    // Find memories with similar tags
    // This is a simplified implementation
    return {
      id: `question-${Date.now()}`,
      type: 'memory_match',
      memory: {
        id: memory.id,
        image_url: memory.image_url,
        thumbnail_url: memory.thumbnail_url
      },
      options: allMemories
        .filter(m => m.id !== memory.id)
        .slice(0, 3)
        .map(m => ({
          id: m.id,
          thumbnail_url: m.thumbnail_url
        })),
      time_limit_seconds: 30,
      points_possible: 10
    };
  }

  private generateTimelineQuestion(memory: any, allMemories: any[]) {
    // Select 4 memories for timeline ordering
    const memoriesToOrder = [memory, ...allMemories
      .filter(m => m.id !== memory.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    ].sort(() => 0.5 - Math.random());
    
    return {
      id: `question-${Date.now()}`,
      type: 'timeline_quiz',
      memories: memoriesToOrder.map(m => ({
        id: m.id,
        thumbnail_url: m.thumbnail_url,
        taken_at: m.taken_at
      })),
      correct_order: memoriesToOrder
        .sort((a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime())
        .map(m => m.id),
      time_limit_seconds: 45,
      points_possible: 15
    };
  }

  private generateFaceRecognitionQuestion(memory: any) {
    // In a real implementation, we would:
    // 1. Get face detections for the memory
    // 2. Select a random face
    // 3. Get the person's name and other options
    
    return {
      id: `question-${Date.now()}`,
      type: 'face_recognition',
      memory: {
        id: memory.id,
        image_url: memory.image_url,
        thumbnail_url: memory.thumbnail_url
      },
      face_region: {
        x: 100,
        y: 150,
        width: 200,
        height: 200
      },
      options: ['Mom', 'Dad', 'Grandma', 'Uncle John'],
      correct_answer: 'Mom',
      time_limit_seconds: 30,
      points_possible: 10
    };
  }

  async submitAnswer(sessionId: string, userId: string, submission: AnswerSubmission) {
    try {
      // Get game session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (sessionError) {
        throw new ApiError(404, 'Game session not found');
      }
      
      // In a real implementation, we would:
      // 1. Get the current question
      // 2. Check if the answer is correct
      // 3. Calculate points based on time taken, hints used, and difficulty
      // 4. Update game session stats
      // 5. Generate next question or end game
      
      // For this example, we'll simulate a correct answer
      const isCorrect = Math.random() > 0.3; // 70% chance of correct answer
      const points = isCorrect ? this.calculatePoints(submission.timeTaken, submission.hintsUsed, session.difficulty_level) : 0;
      
      // Update game session
      const { data: updatedSession, error: updateError } = await supabase
        .from('game_sessions')
        .update({
          total_score: session.total_score + points,
          memories_completed: session.memories_completed + 1,
          current_streak: isCorrect ? session.current_streak + 1 : 0,
          best_streak: isCorrect ? Math.max(session.best_streak, session.current_streak + 1) : session.best_streak,
          hints_used: session.hints_used + submission.hintsUsed,
          time_spent_seconds: session.time_spent_seconds + submission.timeTaken
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`Failed to update game session: ${updateError.message}`);
      }
      
      // Record validation
      await supabase
        .from('tag_validations')
        .insert({
          game_session_id: sessionId,
          user_id: userId,
          user_guess: submission.answer,
          correct_answer: 'simulated_answer', // In a real implementation, this would be the actual correct answer
          is_correct: isCorrect,
          points_awarded: points,
          time_to_answer_seconds: submission.timeTaken,
          hints_used: submission.hintsUsed,
          difficulty_modifier: this.getDifficultyModifier(session.difficulty_level)
        });
      
      // Generate next question or end game
      let nextQuestion = null;
      let gameCompleted = false;
      
      if (updatedSession.memories_completed >= 20) {
        // Game completed
        await supabase
          .from('game_sessions')
          .update({
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);
        
        gameCompleted = true;
      } else {
        // Generate next question
        nextQuestion = await this.generateQuestion(userId, sessionId, {
          gameType: session.game_type,
          difficulty: session.difficulty_level,
          durationMinutes: 5 // Default
        });
      }
      
      return {
        answer_result: {
          is_correct: isCorrect,
          points_awarded: points,
          correct_answer: 'simulated_answer' // In a real implementation, this would be the actual correct answer
        },
        game_state: {
          current_score: updatedSession.total_score,
          current_streak: updatedSession.current_streak,
          questions_completed: updatedSession.memories_completed,
          total_questions: 20,
          hints_remaining: Math.max(0, 3 - updatedSession.hints_used),
          game_completed: gameCompleted
        },
        next_question: nextQuestion
      };
    } catch (error) {
      logger.error('Error submitting answer:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to submit answer');
    }
  }

  private calculatePoints(timeTaken: number, hintsUsed: number, difficulty: string): number {
    // Base points
    let points = 10;
    
    // Adjust for time taken (faster = more points)
    const timeBonus = Math.max(0, 30 - timeTaken); // 30 seconds is the standard time
    points += timeBonus / 3; // Up to 10 bonus points for speed
    
    // Adjust for hints used (fewer = more points)
    points -= hintsUsed * 2; // -2 points per hint
    
    // Adjust for difficulty
    points *= this.getDifficultyModifier(difficulty);
    
    // Ensure minimum points for correct answer
    return Math.max(1, Math.round(points));
  }

  private getDifficultyModifier(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 0.8;
      case 'medium': return 1.0;
      case 'hard': return 1.5;
      case 'expert': return 2.0;
      default: return 1.0;
    }
  }

  async getGameSession(sessionId: string, userId: string) {
    try {
      // Get game session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (sessionError) {
        throw new ApiError(404, 'Game session not found');
      }
      
      // Get validations
      const { data: validations, error: validationsError } = await supabase
        .from('tag_validations')
        .select('*')
        .eq('game_session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (validationsError) {
        throw new Error(`Failed to get validations: ${validationsError.message}`);
      }
      
      return {
        session,
        validations,
        summary: {
          total_score: session.total_score,
          memories_completed: session.memories_completed,
          best_streak: session.best_streak,
          hints_used: session.hints_used,
          time_spent_seconds: session.time_spent_seconds,
          average_time_per_question: session.memories_completed > 0 
            ? Math.round(session.time_spent_seconds / session.memories_completed) 
            : 0,
          accuracy: validations.length > 0 
            ? Math.round((validations.filter(v => v.is_correct).length / validations.length) * 100) 
            : 0
        }
      };
    } catch (error) {
      logger.error('Error getting game session:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to get game session');
    }
  }

  async getLeaderboard(timeframe: string, gameType?: string, limit: number = 10) {
    try {
      // Determine date range based on timeframe
      let startDate;
      const now = new Date();
      
      switch (timeframe) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
        case 'monthly':
          startDate = new Date(now.setDate(1));
          break;
        case 'all-time':
          startDate = new Date(0); // Beginning of time
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7)); // Default to weekly
      }
      
      // Build query
      let query = supabase
        .from('game_sessions')
        .select(`
          id,
          user_id,
          game_type,
          difficulty_level,
          total_score,
          best_streak,
          memories_completed,
          time_spent_seconds,
          completed_at,
          users (full_name, avatar_url)
        `)
        .gte('completed_at', startDate.toISOString())
        .not('completed_at', 'is', null)
        .order('total_score', { ascending: false })
        .limit(limit);
      
      // Filter by game type if provided
      if (gameType) {
        query = query.eq('game_type', gameType);
      }
      
      const { data: leaderboard, error } = await query;
      
      if (error) {
        throw new Error(`Failed to get leaderboard: ${error.message}`);
      }
      
      return {
        timeframe,
        game_type: gameType || 'all',
        leaderboard: leaderboard.map((entry, index) => ({
          rank: index + 1,
          user_id: entry.user_id,
          user_name: entry.users?.full_name || 'Anonymous',
          avatar_url: entry.users?.avatar_url,
          score: entry.total_score,
          game_type: entry.game_type,
          difficulty: entry.difficulty_level,
          completed_at: entry.completed_at
        }))
      };
    } catch (error) {
      logger.error('Error getting leaderboard:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to get leaderboard');
    }
  }
}