/*
  # Create Activity Triggers

  1. New Triggers
    - Creates triggers for various activities in the system
    - Adds functions to handle activity creation for different events
  
  2. Changes
    - Adds IF NOT EXISTS to all trigger creation statements
    - Ensures triggers won't cause errors if they already exist
*/

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
DROP TRIGGER IF EXISTS on_memory_created ON memories;
CREATE TRIGGER on_memory_created
  AFTER INSERT ON memories
  FOR EACH ROW EXECUTE FUNCTION public.create_memory_activity();

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
DROP TRIGGER IF EXISTS on_comment_created ON comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION public.create_comment_activity();

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
DROP TRIGGER IF EXISTS on_like_created ON likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION public.create_like_activity();

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
DROP TRIGGER IF EXISTS on_game_score_created ON game_scores;
CREATE TRIGGER on_game_score_created
  AFTER INSERT ON game_scores
  FOR EACH ROW EXECUTE FUNCTION public.create_game_activity();

-- Function to create activity on memory request creation
CREATE OR REPLACE FUNCTION public.create_memory_request_activity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO activities (family_id, activity_type, actor_id, content)
  VALUES (NEW.family_id, 'memory_request', NEW.requested_by, 'requested a memory');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for memory request creation activity
DROP TRIGGER IF EXISTS on_memory_request_created ON memory_requests;
CREATE TRIGGER on_memory_request_created
  AFTER INSERT ON memory_requests
  FOR EACH ROW EXECUTE FUNCTION public.create_memory_request_activity();