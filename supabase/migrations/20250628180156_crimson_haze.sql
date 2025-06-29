/*
  # Create families table

  1. New Tables
    - `families`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `created_by` (uuid, references profiles)
      - `privacy_level` (text, with check constraint)
      - `family_photo_url` (text)
      - `settings` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `families` table
    - Add policies for family access control
*/

CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid NOT NULL,
  privacy_level text DEFAULT 'family-only' CHECK (privacy_level IN ('public', 'family-only', 'private')),
  family_photo_url text,
  settings jsonb DEFAULT '{"allow_member_invites": true, "require_approval": false, "memory_auto_share": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint after profiles table exists
ALTER TABLE families ADD CONSTRAINT families_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

-- Trigger to update updated_at on family changes
CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Note: We'll add the RLS policies after creating the family_members table
-- For now, we'll just create the table structure