import { Request, Response, NextFunction } from 'express';
import { db } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class GamesController {
  // Start a new game session
  async startGame(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { game_type, difficulty, duration_minutes, categories } = req.body;

      // Create game session
      const gameSession = await db.insert('game_sessions', {
        user_id: userId,
        game_type,
        difficulty_level: difficulty,
        started_at: new Date().toISOString()
      });

      // Generate first question based on game type
      const question = await this.generateQuestion(userId, gameSession.id, game_type, difficulty, categories);

      res.status(201).json({
        success: true,
        data: {
          session_id: gameSession.id,
          current_question: question,
          game_state: {
            current_score: 0,
            current_streak: 0,
            questions_completed: 0,
            total_questions: 20,
            hints_remaining: 3
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit an answer for the current question
  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.sessionId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if game session exists and belongs to user
      const gameSession = await db.getById('game_sessions', sessionId);
      if (!gameSession) {
        throw new AppError('Game session not found', 404);
      }

      if (gameSession.user_id !== userId) {
        throw new AppError('Not authorized to access this game session', 403);
      }

      const { question_id, answer, time_to_answer, hints_used } = req.body;

      // Get question details
      const question = await this.getQuestionById(question_id);
      if (!question) {
        throw new AppError('Question not found', 404);
      }

      // Check if answer is correct
      const isCorrect = this.checkAnswer(question, answer);

      // Calculate points
      const points = this.calculatePoints(
        isCorrect,
        gameSession.difficulty_level,
        time_to_answer,
        hints_used,
        gameSession.current_streak
      );

      // Update game session
      const updatedStreak = isCorrect ? (gameSession.current_streak + 1) : 0;
      const updatedScore = gameSession.total_score + points;
      const updatedMemoriesCompleted = gameSession.memories_completed + 1;
      const updatedHintsUsed = gameSession.hints_used + (hints_used || 0);

      await db.update('game_sessions', sessionId, {
        total_score: updatedScore,
        memories_completed: updatedMemoriesCompleted,
        current_streak: updatedStreak,
        best_streak: Math.max(updatedStreak, gameSession.best_streak || 0),
        hints_used: updatedHintsUsed
      });

      // Record tag validation
      await db.insert('tag_validations', {
        game_session_id: sessionId,
        memory_id: question.memory_id,
        user_id: userId,
        user_guess: answer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        points_awarded: points,
        time_to_answer_seconds: time_to_answer,
        hints_used: hints_used || 0,
        difficulty_modifier: this.getDifficultyModifier(gameSession.difficulty_level)
      });

      // Generate next question
      const nextQuestion = await this.generateQuestion(
        userId,
        sessionId,
        gameSession.game_type,
        gameSession.difficulty_level,
        []
      );

      res.json({
        success: true,
        data: {
          is_correct: isCorrect,
          points_awarded: points,
          current_score: updatedScore,
          current_streak: updatedStreak,
          next_question: nextQuestion
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get the next question
  async getNextQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.sessionId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if game session exists and belongs to user
      const gameSession = await db.getById('game_sessions', sessionId);
      if (!gameSession) {
        throw new AppError('Game session not found', 404);
      }

      if (gameSession.user_id !== userId) {
        throw new AppError('Not authorized to access this game session', 403);
      }

      // Generate next question
      const question = await this.generateQuestion(
        userId,
        sessionId,
        gameSession.game_type,
        gameSession.difficulty_level,
        []
      );

      res.json({
        success: true,
        data: {
          question,
          game_state: {
            current_score: gameSession.total_score,
            current_streak: gameSession.current_streak,
            questions_completed: gameSession.memories_completed,
            total_questions: 20,
            hints_remaining: 3 - gameSession.hints_used
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // End a game session
  async endGame(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.sessionId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if game session exists and belongs to user
      const gameSession = await db.getById('game_sessions', sessionId);
      if (!gameSession) {
        throw new AppError('Game session not found', 404);
      }

      if (gameSession.user_id !== userId) {
        throw new AppError('Not authorized to access this game session', 403);
      }

      // Calculate time spent
      const startedAt = new Date(gameSession.started_at);
      const completedAt = new Date();
      const timeSpentSeconds = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);

      // Update game session
      await db.update('game_sessions', sessionId, {
        completed_at: completedAt.toISOString(),
        time_spent_seconds: timeSpentSeconds
      });

      // Check for achievements
      const achievements = await this.checkAchievements(userId, gameSession);

      res.json({
        success: true,
        data: {
          session_id: sessionId,
          total_score: gameSession.total_score,
          memories_completed: gameSession.memories_completed,
          best_streak: gameSession.best_streak,
          time_spent_seconds: timeSpentSeconds,
          achievements
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get game statistics
  async getGameStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get total games played
      const { count: totalGames, error: countError } = await db.supabase
        .from('game_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError('Failed to get game count', 500);
      }

      // Get games by type
      const { data: gamesByType, error: typeError } = await db.supabase
        .from('game_sessions')
        .select('game_type, count(*)')
        .eq('user_id', userId)
        .group('game_type');

      if (typeError) {
        throw new AppError('Failed to get games by type', 500);
      }

      // Get average score
      const { data: avgScore, error: scoreError } = await db.supabase
        .from('game_sessions')
        .select('avg(total_score)')
        .eq('user_id', userId)
        .single();

      if (scoreError) {
        throw new AppError('Failed to get average score', 500);
      }

      // Get best streak
      const { data: bestStreak, error: streakError } = await db.supabase
        .from('game_sessions')
        .select('max(best_streak)')
        .eq('user_id', userId)
        .single();

      if (streakError) {
        throw new AppError('Failed to get best streak', 500);
      }

      // Get recent games
      const { data: recentGames, error: recentError } = await db.supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(5);

      if (recentError) {
        throw new AppError('Failed to get recent games', 500);
      }

      res.json({
        success: true,
        data: {
          total_games: totalGames || 0,
          games_by_type: gamesByType || [],
          average_score: avgScore?.avg || 0,
          best_streak: bestStreak?.max || 0,
          recent_games: recentGames || []
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get leaderboard
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Parse query parameters
      const gameType = req.query.game_type as string;
      const timeframe = req.query.timeframe as string || 'all-time';
      const limit = parseInt(req.query.limit as string || '10', 10);

      // Build query
      let query = db.supabase
        .from('game_sessions')
        .select(`
          id,
          user_id,
          game_type,
          total_score,
          memories_completed,
          best_streak,
          time_spent_seconds,
          completed_at,
          users:user_id(full_name)
        `)
        .order('total_score', { ascending: false })
        .limit(limit);

      // Apply game type filter if provided
      if (gameType) {
        query = query.eq('game_type', gameType);
      }

      // Apply timeframe filter
      const now = new Date();
      let startDate: Date;
      
      switch (timeframe) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          query = query.gte('completed_at', startDate.toISOString());
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          query = query.gte('completed_at', startDate.toISOString());
          break;
        case 'monthly':
          startDate = new Date(now.setDate(1));
          query = query.gte('completed_at', startDate.toISOString());
          break;
        // 'all-time' doesn't need a filter
      }

      // Execute query
      const { data: leaderboard, error } = await query;

      if (error) {
        throw new AppError(`Failed to get leaderboard: ${error.message}`, 500);
      }

      // Get user's rank
      let userRank = null;
      if (leaderboard) {
        const userIndex = leaderboard.findIndex(entry => entry.user_id === userId);
        if (userIndex !== -1) {
          userRank = userIndex + 1;
        } else {
          // User not in top 10, get their rank separately
          const { data: userScores, error: rankError } = await db.supabase
            .from('game_sessions')
            .select('total_score')
            .eq('user_id', userId)
            .order('total_score', { ascending: false })
            .limit(1);

          if (!rankError && userScores && userScores.length > 0) {
            const userScore = userScores[0].total_score;
            
            const { count: betterScores, error: countError } = await db.supabase
              .from('game_sessions')
              .select('id', { count: 'exact', head: true })
              .gt('total_score', userScore);

            if (!countError) {
              userRank = (betterScores || 0) + 1;
            }
          }
        }
      }

      res.json({
        success: true,
        data: {
          leaderboard: leaderboard || [],
          user_rank: userRank,
          timeframe,
          game_type: gameType || 'all'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user achievements
  async getAchievements(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get user achievements
      const { data: userAchievements, error } = await db.supabase
        .from('user_achievements')
        .select(`
          *,
          achievements(*)
        `)
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        throw new AppError(`Failed to get achievements: ${error.message}`, 500);
      }

      // Get all available achievements
      const { data: allAchievements, error: achievementsError } = await db.supabase
        .from('achievements')
        .select('*');

      if (achievementsError) {
        throw new AppError(`Failed to get all achievements: ${achievementsError.message}`, 500);
      }

      // Combine to show unlocked and locked achievements
      const unlockedIds = userAchievements?.map(ua => ua.achievement_id) || [];
      const lockedAchievements = allAchievements?.filter(a => !unlockedIds.includes(a.id)) || [];

      res.json({
        success: true,
        data: {
          unlocked: userAchievements || [],
          locked: lockedAchievements || []
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper methods
  private async generateQuestion(
    userId: string,
    sessionId: string,
    gameType: string,
    difficulty: string,
    categories: string[]
  ): Promise<any> {
    try {
      // Get memories for this user
      let query = db.supabase
        .from('memories')
        .select(`
          id,
          image_url,
          thumbnail_url,
          caption,
          taken_at,
          tags(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply category filters if provided
      if (categories && categories.length > 0) {
        query = query.in('tags.tag_category', categories);
      }

      const { data: memories, error } = await query;

      if (error || !memories || memories.length === 0) {
        throw new AppError('No memories found for game', 404);
      }

      // Select a random memory
      const randomMemory = memories[Math.floor(Math.random() * memories.length)];

      // Generate question based on game type
      switch (gameType) {
        case 'tag_guess':
          return this.generateTagGuessQuestion(randomMemory, difficulty);
        case 'memory_match':
          return this.generateMemoryMatchQuestion(randomMemory, memories, difficulty);
        case 'timeline_quiz':
          return this.generateTimelineQuestion(randomMemory, memories, difficulty);
        case 'face_recognition':
          return this.generateFaceRecognitionQuestion(randomMemory, userId, difficulty);
        default:
          throw new AppError(`Unsupported game type: ${gameType}`, 400);
      }
    } catch (error) {
      logger.error('Error generating question:', error);
      throw error;
    }
  }

  private async generateTagGuessQuestion(memory: any, difficulty: string): Promise<any> {
    // Get tags for this memory
    const tags = memory.tags || [];
    if (tags.length === 0) {
      return this.generateDefaultQuestion(memory);
    }

    // Select a random tag as the correct answer
    const correctTag = tags[Math.floor(Math.random() * tags.length)];

    // Generate incorrect options based on difficulty
    let incorrectOptions: string[] = [];
    
    // In a real implementation, we would get similar tags from the database
    // For this example, we'll use some static options
    const staticOptions = [
      'family', 'vacation', 'beach', 'mountains', 'birthday',
      'holiday', 'christmas', 'wedding', 'graduation', 'party',
      'sunset', 'nature', 'food', 'pets', 'sports'
    ];
    
    // Filter out the correct answer
    const filteredOptions = staticOptions.filter(opt => opt !== correctTag.tag_name);
    
    // Select random incorrect options
    while (incorrectOptions.length < 3) {
      const randomOption = filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
      if (!incorrectOptions.includes(randomOption)) {
        incorrectOptions.push(randomOption);
      }
    }

    // Combine options and shuffle
    const allOptions = [correctTag.tag_name, ...incorrectOptions];
    this.shuffleArray(allOptions);

    // Generate hints based on difficulty
    const hints = [];
    if (difficulty !== 'hard') {
      hints.push(`This is a ${correctTag.tag_category}`);
    }
    if (difficulty === 'easy') {
      hints.push(`It starts with the letter "${correctTag.tag_name[0].toUpperCase()}"`);
    }

    return {
      id: `question-${Date.now()}`,
      type: 'tag_guess',
      question: 'What tag best describes this image?',
      memory: {
        id: memory.id,
        image_url: memory.image_url,
        thumbnail_url: memory.thumbnail_url,
        hints
      },
      options: allOptions,
      correct_answer: correctTag.tag_name,
      time_limit_seconds: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15,
      points_possible: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
    };
  }

  private async generateMemoryMatchQuestion(memory: any, allMemories: any[], difficulty: string): Promise<any> {
    // For memory match, we need to find similar memories
    // In a real implementation, this would use more sophisticated matching
    
    // Get a random tag from this memory
    const tags = memory.tags || [];
    if (tags.length === 0) {
      return this.generateDefaultQuestion(memory);
    }
    
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    
    // Find other memories with the same tag
    const matchingMemories = allMemories.filter(m => 
      m.id !== memory.id && 
      m.tags && 
      m.tags.some((t: any) => t.tag_name === randomTag.tag_name)
    );
    
    // If no matching memories, use random ones
    let options = [];
    if (matchingMemories.length >= 3) {
      // Select 3 random matching memories
      this.shuffleArray(matchingMemories);
      options = matchingMemories.slice(0, 3).map(m => ({
        id: m.id,
        thumbnail_url: m.thumbnail_url,
        is_match: true
      }));
    } else {
      // Use available matching memories
      options = matchingMemories.map(m => ({
        id: m.id,
        thumbnail_url: m.thumbnail_url,
        is_match: true
      }));
      
      // Fill the rest with non-matching memories
      const nonMatchingMemories = allMemories.filter(m => 
        m.id !== memory.id && 
        !matchingMemories.some(mm => mm.id === m.id)
      );
      
      this.shuffleArray(nonMatchingMemories);
      
      while (options.length < 3 && nonMatchingMemories.length > 0) {
        const nonMatch = nonMatchingMemories.pop();
        if (nonMatch) {
          options.push({
            id: nonMatch.id,
            thumbnail_url: nonMatch.thumbnail_url,
            is_match: false
          });
        }
      }
    }
    
    // Shuffle options
    this.shuffleArray(options);
    
    // Add the original memory
    options.push({
      id: memory.id,
      thumbnail_url: memory.thumbnail_url,
      is_match: false // The original memory is not a match for itself
    });
    
    // Shuffle again
    this.shuffleArray(options);
    
    return {
      id: `question-${Date.now()}`,
      type: 'memory_match',
      question: `Find memories that match the tag: ${randomTag.tag_name}`,
      options,
      correct_answers: options.filter(o => o.is_match).map(o => o.id),
      time_limit_seconds: difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20,
      points_possible: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
    };
  }

  private async generateTimelineQuestion(memory: any, allMemories: any[], difficulty: string): Promise<any> {
    // For timeline quiz, we need memories with dates
    const memoriesWithDates = allMemories.filter(m => m.taken_at);
    
    if (memoriesWithDates.length < 4) {
      return this.generateDefaultQuestion(memory);
    }
    
    // Sort memories by date
    memoriesWithDates.sort((a, b) => 
      new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
    );
    
    // Select 4 random memories
    this.shuffleArray(memoriesWithDates);
    const selectedMemories = memoriesWithDates.slice(0, 4);
    
    // Sort selected memories by date
    selectedMemories.sort((a, b) => 
      new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
    );
    
    // Create options with correct order
    const options = selectedMemories.map((m, index) => ({
      id: m.id,
      thumbnail_url: m.thumbnail_url,
      correct_position: index,
      date: m.taken_at
    }));
    
    // Shuffle options for display
    this.shuffleArray(options);
    
    return {
      id: `question-${Date.now()}`,
      type: 'timeline_quiz',
      question: 'Arrange these memories in chronological order (oldest to newest)',
      options,
      correct_order: selectedMemories.map(m => m.id),
      time_limit_seconds: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30,
      points_possible: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
    };
  }

  private async generateFaceRecognitionQuestion(memory: any, userId: string, difficulty: string): Promise<any> {
    // Get face detections for this memory
    const { data: faceDetections, error } = await db.supabase
      .from('face_detections')
      .select(`
        *,
        people(*)
      `)
      .eq('memory_id', memory.id);
    
    if (error || !faceDetections || faceDetections.length === 0) {
      return this.generateDefaultQuestion(memory);
    }
    
    // Filter face detections with people
    const facesWithPeople = faceDetections.filter(fd => fd.people);
    
    if (facesWithPeople.length === 0) {
      return this.generateDefaultQuestion(memory);
    }
    
    // Select a random face
    const randomFace = facesWithPeople[Math.floor(Math.random() * facesWithPeople.length)];
    const correctPerson = randomFace.people;
    
    // Get other people for incorrect options
    const { data: otherPeople, error: peopleError } = await db.supabase
      .from('people')
      .select('*')
      .eq('user_id', userId)
      .neq('id', correctPerson.id)
      .limit(10);
    
    if (peopleError || !otherPeople || otherPeople.length < 3) {
      return this.generateDefaultQuestion(memory);
    }
    
    // Select random incorrect options
    this.shuffleArray(otherPeople);
    const incorrectOptions = otherPeople.slice(0, 3).map(p => p.name);
    
    // Combine options and shuffle
    const allOptions = [correctPerson.name, ...incorrectOptions];
    this.shuffleArray(allOptions);
    
    // Generate hints based on difficulty
    const hints = [];
    if (difficulty !== 'hard') {
      hints.push(`This person is a ${correctPerson.relationship}`);
    }
    if (difficulty === 'easy') {
      hints.push(`Their name starts with "${correctPerson.name[0]}"`);
    }
    
    return {
      id: `question-${Date.now()}`,
      type: 'face_recognition',
      question: 'Who is this person?',
      memory: {
        id: memory.id,
        image_url: memory.image_url,
        thumbnail_url: memory.thumbnail_url,
        face_region: randomFace.bounding_box,
        hints
      },
      options: allOptions,
      correct_answer: correctPerson.name,
      time_limit_seconds: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15,
      points_possible: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
    };
  }

  private generateDefaultQuestion(memory: any): any {
    // Fallback question when specific game type generation fails
    return {
      id: `question-${Date.now()}`,
      type: 'default',
      question: 'What do you remember about this memory?',
      memory: {
        id: memory.id,
        image_url: memory.image_url,
        thumbnail_url: memory.thumbnail_url,
        hints: ['This is an open-ended question']
      },
      options: ['I remember', 'I don\'t remember', 'Not sure', 'Skip'],
      correct_answer: null, // No correct answer for open-ended questions
      time_limit_seconds: 30,
      points_possible: 5
    };
  }

  private async getQuestionById(questionId: string): Promise<any> {
    // In a real implementation, questions would be stored in the database
    // For this example, we'll return a mock question
    return {
      id: questionId,
      type: 'tag_guess',
      memory_id: 'mock-memory-id',
      correct_answer: 'family'
    };
  }

  private checkAnswer(question: any, answer: string): boolean {
    // Check if answer is correct based on question type
    switch (question.type) {
      case 'tag_guess':
        return answer.toLowerCase() === question.correct_answer.toLowerCase();
      case 'memory_match':
        // For memory match, answer would be an array of memory IDs
        return JSON.stringify(answer.sort()) === JSON.stringify(question.correct_answers.sort());
      case 'timeline_quiz':
        // For timeline quiz, answer would be an array of memory IDs in order
        return JSON.stringify(answer) === JSON.stringify(question.correct_order);
      case 'face_recognition':
        return answer.toLowerCase() === question.correct_answer.toLowerCase();
      default:
        return false;
    }
  }

  private calculatePoints(
    isCorrect: boolean,
    difficulty: string,
    timeToAnswer: number,
    hintsUsed: number,
    streak: number
  ): number {
    if (!isCorrect) return 0;

    // Base points by difficulty
    let points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;

    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 10 - Math.floor(timeToAnswer / 3));
    
    // Hint penalty
    const hintPenalty = hintsUsed * 2;
    
    // Streak bonus
    const streakBonus = Math.min(10, streak);
    
    // Calculate total
    const total = points + timeBonus - hintPenalty + streakBonus;
    
    // Ensure minimum points for correct answer
    return Math.max(1, total);
  }

  private getDifficultyModifier(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 1.0;
      case 'medium': return 1.5;
      case 'hard': return 2.0;
      case 'expert': return 2.5;
      default: return 1.0;
    }
  }

  private async checkAchievements(userId: string, gameSession: any): Promise<any[]> {
    try {
      // Get all achievements
      const { data: achievements, error } = await db.supabase
        .from('achievements')
        .select('*');

      if (error || !achievements) {
        logger.error('Failed to get achievements:', error);
        return [];
      }

      // Get user's existing achievements
      const { data: userAchievements, error: userError } = await db.supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (userError) {
        logger.error('Failed to get user achievements:', userError);
        return [];
      }

      const unlockedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];
      const newlyUnlocked = [];

      // Check each achievement
      for (const achievement of achievements) {
        // Skip if already unlocked
        if (unlockedAchievementIds.includes(achievement.id)) {
          continue;
        }

        // Check if achievement criteria are met
        const isUnlocked = await this.checkAchievementCriteria(userId, achievement, gameSession);
        
        if (isUnlocked) {
          // Unlock achievement
          await db.insert('user_achievements', {
            user_id: userId,
            achievement_id: achievement.id
          });
          
          newlyUnlocked.push(achievement);
        }
      }

      return newlyUnlocked;
    } catch (error) {
      logger.error('Error checking achievements:', error);
      return [];
    }
  }

  private async checkAchievementCriteria(userId: string, achievement: any, gameSession: any): Promise<boolean> {
    try {
      const criteria = achievement.criteria;
      
      // If no criteria, achievement can't be unlocked
      if (!criteria) return false;
      
      // Check different types of criteria
      switch (criteria.type) {
        case 'score':
          return gameSession.total_score >= criteria.value;
        
        case 'streak':
          return gameSession.best_streak >= criteria.value;
        
        case 'games_played':
          const { count, error } = await db.supabase
            .from('game_sessions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);
          
          return !error && count !== null && count >= criteria.value;
        
        case 'correct_answers':
          const { count: correctCount, error: correctError } = await db.supabase
            .from('tag_validations')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_correct', true);
          
          return !correctError && correctCount !== null && correctCount >= criteria.value;
        
        default:
          return false;
      }
    } catch (error) {
      logger.error('Error checking achievement criteria:', error);
      return false;
    }
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}