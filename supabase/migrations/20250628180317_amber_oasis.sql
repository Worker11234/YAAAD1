/*
  # Create memory_requests table

  1. New Tables
    - `memory_requests`
      - `id` (uuid, primary key)
      - `family_id` (uuid, references families)
      - `requested_by` (uuid, references profiles)
      - `title` (text, not null)
      - `description` (text)
      - `date_range_start` (date)
      - `date_range_end` (date)
      - `location` (text)
      - `people_involved` (text array)
      - `tags_requested` (text array)
      - `status` (text, with check constraint)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on memory_requests table
    - Add appropriate policies
*/

CREATE TABLE IF NOT EXISTS memory_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  requested_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  date_range_start date,
  date_range_end date,
  location text,
  people_involved text[],
  tags_requested text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memory_requests ENABLE ROW LEVEL SECURITY;

-- Trigger to update updated_at on memory request changes
CREATE TRIGGER update_memory_requests_updated_at
  BEFORE UPDATE ON memory_requests
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- RLS Policies for memory_requests

-- Family members can view memory requests in their family
CREATE POLICY "Family members can view memory requests"
  ON memory_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = memory_requests.family_id AND user_id = auth.uid()
    )
  );

-- Users can create memory requests in their families
CREATE POLICY "Users can create memory requests"
  ON memory_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = memory_requests.family_id AND user_id = auth.uid()
    )
  );

-- Request creators can update their own requests
CREATE POLICY "Request creators can update requests"
  ON memory_requests
  FOR UPDATE
  TO authenticated
  USING (requested_by = auth.uid());

-- Request creators and family admins can delete requests
CREATE POLICY "Request creators and admins can delete requests"
  ON memory_requests
  FOR DELETE
  TO authenticated
  USING (
    requested_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = memory_requests.family_id AND user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

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
CREATE TRIGGER on_memory_request_created
  AFTER INSERT ON memory_requests
  FOR EACH ROW EXECUTE PROCEDURE public.create_memory_request_activity();