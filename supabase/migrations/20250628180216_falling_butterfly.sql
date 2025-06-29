/*
  # Create memories table

  1. New Tables
    - `memories`
      - `id` (uuid, primary key)
      - `family_id` (uuid, references families)
      - `title` (text, not null)
      - `description` (text)
      - `memory_type` (text, with check constraint)
      - `file_url` (text)
      - `thumbnail_url` (text)
      - `date_taken` (date)
      - `location` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_private` (boolean)
  2. Security
    - Enable RLS on `memories` table
    - Add policies for memory access control
*/

CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  memory_type text NOT NULL CHECK (memory_type IN ('photo', 'video', 'audio', 'story')),
  file_url text,
  thumbnail_url text,
  date_taken date,
  location text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_private boolean DEFAULT false
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Family members can read family memories
CREATE POLICY "Family members can read memories"
  ON memories
  FOR SELECT
  TO authenticated
  USING (
    (NOT is_private AND EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = memories.family_id AND user_id = auth.uid()
    ))
    OR
    (is_private AND created_by = auth.uid())
  );

-- Users can create memories in their families
CREATE POLICY "Users can create memories in their families"
  ON memories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = memories.family_id AND user_id = auth.uid()
    )
  );

-- Users can update their own memories
CREATE POLICY "Users can update own memories"
  ON memories
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Users can delete their own memories
CREATE POLICY "Users can delete own memories"
  ON memories
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Family admins can manage all family memories
CREATE POLICY "Family admins can manage all memories"
  ON memories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = memories.family_id AND user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Trigger to update updated_at on memory changes
CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();