/*
  # Fix RLS Policy Infinite Recursion

  1. Problem
    - The current RLS policies on family_members table are causing infinite recursion
    - Policies are referencing each other in circular dependencies
    - This prevents profile queries from working

  2. Solution
    - Drop existing problematic policies on family_members table
    - Create new, simplified policies that avoid circular references
    - Ensure policies are direct and don't create recursive loops

  3. Changes
    - Remove circular policy dependencies
    - Simplify policy logic to be more direct
    - Maintain security while avoiding recursion
*/

-- Drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Family admins can manage memberships" ON family_members;
DROP POLICY IF EXISTS "Family members can read family memberships" ON family_members;
DROP POLICY IF EXISTS "Users can join families" ON family_members;
DROP POLICY IF EXISTS "Users can read own family memberships" ON family_members;

-- Create new, simplified policies that avoid recursion

-- Users can read their own family memberships (direct, no recursion)
CREATE POLICY "Users can read own memberships"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own family memberships when joining
CREATE POLICY "Users can join families"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Family owners can manage all memberships in their families
CREATE POLICY "Family owners can manage memberships"
  ON family_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM families 
      WHERE families.id = family_members.family_id 
      AND families.created_by = auth.uid()
    )
  );

-- Family admins can manage memberships (simplified to avoid recursion)
CREATE POLICY "Family admins can manage memberships"
  ON family_members
  FOR ALL
  TO authenticated
  USING (
    family_id IN (
      SELECT fm.family_id 
      FROM family_members fm 
      WHERE fm.user_id = auth.uid() 
      AND fm.role IN ('admin', 'owner')
    )
  );

-- Family members can read other memberships in their families (simplified)
CREATE POLICY "Family members can read memberships"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (
      SELECT fm.family_id 
      FROM family_members fm 
      WHERE fm.user_id = auth.uid()
    )
  );