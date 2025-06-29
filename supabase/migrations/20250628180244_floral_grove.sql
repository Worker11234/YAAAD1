/*
  # Create likes and activities tables

  1. New Tables
    - `likes`
      - `id` (uuid, primary key)
      - `created_by` (uuid, references profiles)
      - `memory_id` (uuid, references memories)
      - `comment_id` (uuid, references comments)
      - `created_at` (timestamptz)
    - `activities`
      - `id` (uuid, primary key)
      - `family_id` (uuid, references families)
      - `activity_type` (text)
      - `actor_id` (uuid, references profiles)
      - `target_memory_id` (uuid, references memories)
      - `target_profile_id` (uuid, references profiles)
      - `target_family_id` (uuid, references families)
      - `content` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  memory_id uuid REFERENCES memories(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK (
    (memory_id IS NOT NULL AND comment_id IS NULL) OR
    (memory_id IS NULL AND comment_id IS NOT NULL)
  )
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_memory_id uuid REFERENCES memories(id) ON DELETE SET NULL,
  target_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_family_id uuid REFERENCES families(id) ON DELETE SET NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes

-- Likes are visible to those who can see the related content
CREATE POLICY "Likes visible to content viewers"
  ON likes
  FOR SELECT
  TO authenticated
  USING (
    (memory_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM memories
      WHERE id = likes.memory_id
      AND (
        (NOT is_private AND EXISTS (
          SELECT 1 FROM family_members
          WHERE family_id = memories.family_id AND user_id = auth.uid()
        ))
        OR
        (is_private AND created_by = auth.uid())
      )
    ))
    OR
    (comment_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM comments
      JOIN memories ON comments.memory_id = memories.id
      WHERE comments.id = likes.comment_id
      AND (
        (NOT memories.is_private AND EXISTS (
          SELECT 1 FROM family_members
          WHERE family_id = memories.family_id AND user_id = auth.uid()
        ))
        OR
        (memories.is_private AND memories.created_by = auth.uid())
      )
    ))
  );

-- Users can create their own likes
CREATE POLICY "Users can create likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can delete their own likes
CREATE POLICY "Users can delete likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for activities

-- Family members can view family activities
CREATE POLICY "Family members can view activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = activities.family_id AND user_id = auth.uid()
    )
  );

-- Users can create activities in their families
CREATE POLICY "Users can create activities in their families"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = activities.family_id AND user_id = auth.uid()
    )
  );

-- Trigger functions for activity tracking

-- Function to create activity on memory creation
CREATE OR REPLACE FUNCTION public.create_memory_activity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO activities (family_id, activity_type, actor_id, target_memory_id, content)
  VALUES (NEW.family_id, 'upload', NEW.created_by, NEW.id, 'uploaded a new memory');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for memory creation activity
CREATE TRIGGER on_memory_created
  AFTER INSERT ON memories
  FOR EACH ROW EXECUTE PROCEDURE public.create_memory_activity();

-- Function to create activity on comment creation
CREATE OR REPLACE FUNCTION public.create_comment_activity()
RETURNS trigger AS $$
DECLARE
  memory_family_id uuid;
BEGIN
  SELECT family_id INTO memory_family_id FROM memories WHERE id = NEW.memory_id;
  
  INSERT INTO activities (family_id, activity_type, actor_id, target_memory_id, content)
  VALUES (memory_family_id, 'comment', NEW.created_by, NEW.memory_id, 'commented on a memory');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comment creation activity
CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.create_comment_activity();

-- Function to create activity on like creation
CREATE OR REPLACE FUNCTION public.create_like_activity()
RETURNS trigger AS $$
DECLARE
  memory_id_val uuid;
  memory_family_id uuid;
BEGIN
  IF NEW.memory_id IS NOT NULL THEN
    memory_id_val := NEW.memory_id;
    SELECT family_id INTO memory_family_id FROM memories WHERE id = memory_id_val;
  ELSE
    SELECT memory_id, family_id INTO memory_id_val, memory_family_id 
    FROM comments JOIN memories ON comments.memory_id = memories.id 
    WHERE comments.id = NEW.comment_id;
  END IF;
  
  INSERT INTO activities (family_id, activity_type, actor_id, target_memory_id, content)
  VALUES (memory_family_id, 'like', NEW.created_by, memory_id_val, 'liked a memory');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for like creation activity
CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE PROCEDURE public.create_like_activity();