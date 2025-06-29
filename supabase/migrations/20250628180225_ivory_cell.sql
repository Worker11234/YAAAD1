/*
  # Create tags, memory_tags, and comments tables

  1. New Tables
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `color` (text)
      - `family_id` (uuid, references families)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
    - `memory_tags`
      - `memory_id` (uuid, references memories)
      - `tag_id` (uuid, references tags)
    - `comments`
      - `id` (uuid, primary key)
      - `memory_id` (uuid, references memories)
      - `parent_comment_id` (uuid, references comments)
      - `created_by` (uuid, references profiles)
      - `content` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text,
  family_id uuid REFERENCES families(id) ON DELETE CASCADE,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Memory tags junction table
CREATE TABLE IF NOT EXISTS memory_tags (
  memory_id uuid REFERENCES memories(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (memory_id, tag_id)
);

ALTER TABLE memory_tags ENABLE ROW LEVEL SECURITY;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id uuid REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Trigger to update updated_at on comment changes
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- RLS Policies for tags

-- Family members can read family tags
CREATE POLICY "Family members can read tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (
    family_id IS NULL OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = tags.family_id AND user_id = auth.uid()
    )
  );

-- Family members can create tags
CREATE POLICY "Family members can create tags"
  ON tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_id IS NULL OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = tags.family_id AND user_id = auth.uid()
    )
  );

-- Tag creators and family admins can update tags
CREATE POLICY "Tag creators and admins can update tags"
  ON tags
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = tags.family_id AND user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Tag creators and family admins can delete tags
CREATE POLICY "Tag creators and admins can delete tags"
  ON tags
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = tags.family_id AND user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- RLS Policies for memory_tags

-- Memory tags are visible to those who can see the memory
CREATE POLICY "Memory tags visible to memory viewers"
  ON memory_tags
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memories
      WHERE id = memory_tags.memory_id
      AND (
        (NOT is_private AND EXISTS (
          SELECT 1 FROM family_members
          WHERE family_id = memories.family_id AND user_id = auth.uid()
        ))
        OR
        (is_private AND created_by = auth.uid())
      )
    )
  );

-- Memory creators and family admins can manage memory tags
CREATE POLICY "Memory creators and admins can manage memory tags"
  ON memory_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memories
      JOIN family_members ON memories.family_id = family_members.family_id
      WHERE memories.id = memory_tags.memory_id
      AND (
        memories.created_by = auth.uid() OR
        (family_members.user_id = auth.uid() AND family_members.role IN ('admin', 'owner'))
      )
    )
  );

-- RLS Policies for comments

-- Comments are visible to those who can see the memory
CREATE POLICY "Comments visible to memory viewers"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memories
      WHERE id = comments.memory_id
      AND (
        (NOT is_private AND EXISTS (
          SELECT 1 FROM family_members
          WHERE family_id = memories.family_id AND user_id = auth.uid()
        ))
        OR
        (is_private AND created_by = auth.uid())
      )
    )
  );

-- Family members can create comments on family memories
CREATE POLICY "Family members can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memories
      JOIN family_members ON memories.family_id = family_members.family_id
      WHERE memories.id = comments.memory_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Comment creators can update their own comments
CREATE POLICY "Comment creators can update comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Comment creators and family admins can delete comments
CREATE POLICY "Comment creators and admins can delete comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM memories
      JOIN family_members ON memories.family_id = family_members.family_id
      WHERE memories.id = comments.memory_id
      AND family_members.user_id = auth.uid()
      AND family_members.role IN ('admin', 'owner')
    )
  );