/*
  # Create family_members table and add RLS policies

  1. New Tables
    - `family_members`
      - `id` (uuid, primary key)
      - `family_id` (uuid, references families)
      - `user_id` (uuid, references profiles)
      - `role` (text, with check constraint)
      - `joined_at` (timestamptz)
      - `invited_by` (uuid, references profiles)
      - `status` (text, with check constraint)
  2. Security
    - Enable RLS on `family_members` table
    - Add policies for family membership access control
  3. Functions
    - Create function to automatically add family creator as owner
*/

CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamptz DEFAULT now(),
  invited_by uuid,
  status text DEFAULT 'active' CHECK (status IN ('active', 'invited', 'inactive')),
  UNIQUE(family_id, user_id)
);

-- Add foreign key constraints
ALTER TABLE family_members ADD CONSTRAINT family_members_family_id_fkey 
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE;
  
ALTER TABLE family_members ADD CONSTRAINT family_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE family_members ADD CONSTRAINT family_members_invited_by_fkey 
  FOREIGN KEY (invited_by) REFERENCES profiles(id);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Family members can read their own memberships
CREATE POLICY "Users can read own family memberships"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Family members can read other memberships in their families
CREATE POLICY "Family members can read family memberships"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id AND fm.user_id = auth.uid()
    )
  );

-- Family admins and owners can manage memberships
CREATE POLICY "Family admins can manage memberships"
  ON family_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id 
      AND fm.user_id = auth.uid() 
      AND fm.role IN ('owner', 'admin')
    )
  );

-- Users can join families (for invitations)
CREATE POLICY "Users can join families"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to automatically add family creator as owner
CREATE OR REPLACE FUNCTION public.add_family_creator_as_owner()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.family_members (family_id, user_id, role, status)
  VALUES (NEW.id, NEW.created_by, 'owner', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add family creator as owner
CREATE TRIGGER on_family_created
  AFTER INSERT ON families
  FOR EACH ROW EXECUTE PROCEDURE public.add_family_creator_as_owner();

-- Now add the RLS policies for families that depend on family_members
CREATE POLICY "Family members can read families"
  ON families
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = families.id AND user_id = auth.uid()
    )
  );

-- Family creators and admins can update families
CREATE POLICY "Family admins can update families"
  ON families
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = families.id AND user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Authenticated users can create families
CREATE POLICY "Authenticated users can create families"
  ON families
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Family creators and admins can delete families
CREATE POLICY "Family owners can delete families"
  ON families
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = families.id AND user_id = auth.uid() AND role = 'owner'
    )
  );

-- Now add the family-related policy to profiles
CREATE POLICY "Family members can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm1
      JOIN family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.user_id = auth.uid() AND fm2.user_id = profiles.id
    )
  );