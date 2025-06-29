/*
  # Create games, game_scores, achievements, and user_achievements tables

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `category` (text)
      - `difficulty` (text)
      - `created_at` (timestamptz)
    - `game_scores`
      - `id` (uuid, primary key)
      - `game_id` (uuid, references games)
      - `user_id` (uuid, references profiles)
      - `family_id` (uuid, references families)
      - `score` (integer)
      - `duration_seconds` (integer)
      - `correct_answers` (integer)
      - `total_questions` (integer)
      - `played_at` (timestamptz)
    - `achievements`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `icon` (text)
      - `rarity` (text)
      - `criteria` (jsonb)
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (uuid, references achievements)
      - `unlocked_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  difficulty text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Game scores table
CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  duration_seconds integer,
  correct_answers integer,
  total_questions integer,
  played_at timestamptz DEFAULT now()
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  rarity text,
  criteria jsonb
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games

-- All authenticated users can view games
CREATE POLICY "All users can view games"
  ON games
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for game_scores

-- Users can view their own scores
CREATE POLICY "Users can view own game scores"
  ON game_scores
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Family members can view family scores
CREATE POLICY "Family members can view family game scores"
  ON game_scores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = game_scores.family_id AND user_id = auth.uid()
    )
  );

-- Users can create their own scores
CREATE POLICY "Users can create own game scores"
  ON game_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for achievements

-- All authenticated users can view achievements
CREATE POLICY "All users can view achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_achievements

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Family members can view family achievements
CREATE POLICY "Family members can view family achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm1
      JOIN family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.user_id = auth.uid() AND fm2.user_id = user_achievements.user_id
    )
  );

-- Function to create activity on game completion
CREATE OR REPLACE FUNCTION public.create_game_activity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO activities (family_id, activity_type, actor_id, content)
  VALUES (NEW.family_id, 'game_played', NEW.user_id, 'played a memory game');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for game completion activity
CREATE TRIGGER on_game_score_created
  AFTER INSERT ON game_scores
  FOR EACH ROW EXECUTE PROCEDURE public.create_game_activity();