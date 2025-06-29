import { supabase } from '../utils/supabase';
import logger from '../utils/logger';
import { ApiError } from '../utils/apiError';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: AchievementRequirement[];
}

interface AchievementRequirement {
  type: string;
  value: number;
}

export class AchievementService {
  private achievements: Achievement[] = [
    {
      id: 'memory_master',
      name: 'Memory Master',
      description: 'Correctly identify 100 tags in your yaadein',
      icon: '🧠',
      points: 500,
      rarity: 'epic',
      requirements: [
        { type: 'tag_validations_correct', value: 100 }
      ]
    },
    {
      id: 'face_detective',
      name: 'Face Detective',
      description: 'Identify 50 people in your memories',
      icon: '🕵️',
      points: 300,
      rarity: 'rare',
      requirements: [
        { type: 'people_identified', value: 50 }
      ]
    },
    {
      id: 'memory_collector',
      name: 'Memory Collector',
      description: 'Upload 100 memories',
      icon: '📸',
      points: 200,
      rarity: 'common',
      requirements: [
        { type: 'memories_uploaded', value: 100 }
      ]
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Get a perfect score in a memory game',
      icon: '🏆',
      points: 100,
      rarity: 'rare',
      requirements: [
        { type: 'perfect_game', value: 1 }
      ]
    },
    {
      id: 'organization_guru',
      name: 'Organization Guru',
      description: 'Create 10 memory collections',
      icon: '📁',
      points: 150,
      rarity: 'common',
      requirements: [
        { type: 'collections_created', value: 10 }
      ]
    }
  ];

  async getUserAchievements(userId: string) {
    try {
      // Get user achievements
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw new Error(`Failed to get user achievements: ${error.message}`);
      }
      
      // Map to full achievement details
      const achievements = userAchievements.map(ua => {
        const achievement = this.achievements.find(a => a.id === ua.achievement_id);
        return {
          ...achievement,
          unlocked_at: ua.unlocked_at
        };
      });
      
      // Get progress for locked achievements
      const lockedAchievements = this.achievements
        .filter(a => !userAchievements.some(ua => ua.achievement_id === a.id))
        .map(a => ({
          ...a,
          progress: 0, // This would be calculated from user stats in a real implementation
          unlocked: false
        }));
      
      return {
        unlocked: achievements.map(a => ({
          ...a,
          unlocked: true
        })),
        locked: lockedAchievements,
        total_points: achievements.reduce((sum, a) => sum + a.points, 0)
      };
    } catch (error) {
      logger.error('Error getting user achievements:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to get user achievements');
    }
  }

  async checkForAchievements(userId: string) {
    try {
      // Get user stats
      const stats = await this.getUserStats(userId);
      
      // Get user's existing achievements
      const { data: existingAchievements, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
      
      if (error) {
        throw new Error(`Failed to get existing achievements: ${error.message}`);
      }
      
      const existingIds = existingAchievements.map(a => a.achievement_id);
      
      // Check each achievement
      const newAchievements = [];
      
      for (const achievement of this.achievements) {
        // Skip if already unlocked
        if (existingIds.includes(achievement.id)) {
          continue;
        }
        
        // Check if requirements are met
        const requirementsMet = achievement.requirements.every(req => {
          switch (req.type) {
            case 'tag_validations_correct':
              return stats.correctTagValidations >= req.value;
            case 'people_identified':
              return stats.peopleIdentified >= req.value;
            case 'memories_uploaded':
              return stats.memoriesUploaded >= req.value;
            case 'perfect_game':
              return stats.perfectGames >= req.value;
            case 'collections_created':
              return stats.collectionsCreated >= req.value;
            default:
              return false;
          }
        });
        
        if (requirementsMet) {
          // Unlock achievement
          await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              unlocked_at: new Date().toISOString()
            });
          
          newAchievements.push(achievement);
        }
      }
      
      return newAchievements;
    } catch (error) {
      logger.error('Error checking for achievements:', error);
      return []; // Return empty array on error to prevent blocking game flow
    }
  }

  private async getUserStats(userId: string) {
    // In a real implementation, this would query the database for user stats
    // For this example, we'll return mock stats
    
    // Get memory count
    const { count: memoriesCount } = await supabase
      .from('memories')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    // Get collection count
    const { count: collectionsCount } = await supabase
      .from('collections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    // Get correct tag validations count
    const { count: correctValidationsCount } = await supabase
      .from('tag_validations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_correct', true);
    
    return {
      memoriesUploaded: memoriesCount || 0,
      collectionsCreated: collectionsCount || 0,
      correctTagValidations: correctValidationsCount || 0,
      peopleIdentified: 10, // Mock value
      perfectGames: 0 // Mock value
    };
  }
}