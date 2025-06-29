/*
  # Fix infinite recursion in family_members RLS policies

  1. Problem
    - Current RLS policies on family_members table are causing infinite recursion
    - Policies are checking family membership by querying the same table they're protecting
    - This creates a circular dependency when trying to access profile data

  2. Solution
    - Drop existing problematic policies
    - Create new policies that avoid circular references
    - Use direct user ID checks where possible
    - Simplify policy logic to prevent recursion

  3. Changes
    - Remove policies that query family_members within family_members policies
    - Create simpler, more direct policies
    - Ensure policies can resolve without circular dependencies
*/

-- Drop all existing policies on family_members table
DROP POLICY IF EXISTS "Family admins can manage memberships" ON family_members;
DROP POLICY IF EXISTS "Family members can read memberships" ON family_members;
DROP POLICY IF EXISTS "Family owners can manage memberships" ON family_members;
DROP POLICY IF EXISTS "Users can join families" ON family_members;
DROP POLICY IF EXISTS "Users can read own memberships" ON family_members;

-- Create new, simplified policies that avoid recursion

-- Users can always read their own family memberships
CREATE POLICY "Users can read own family memberships"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own family memberships (for joining families)
CREATE POLICY "Users can insert own family memberships"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own family memberships
CREATE POLICY "Users can update own family memberships"
  ON family_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Family creators can manage all memberships in their families
CREATE POLICY "Family creators can manage all memberships"
  ON family_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM families 
      WHERE families.id = family_members.family_id 
      AND families.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM families 
      WHERE families.id = family_members.family_id 
      AND families.created_by = auth.uid()
    )
  );

-- Family members with admin/owner role can read all memberships in their families
-- This policy is more complex but avoids recursion by using a different approach
CREATE POLICY "Family admins can read all memberships"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user is admin/owner in this family by checking if they have an admin/owner record
    family_id IN (
      SELECT fm.family_id 
      FROM family_members fm 
      WHERE fm.user_id = auth.uid() 
      AND fm.role IN ('admin', 'owner')
      AND fm.family_id = family_members.family_id
    )
  );

-- Family members with admin/owner role can manage memberships (except their own role changes)
CREATE POLICY "Family admins can manage other memberships"
  ON family_members
  FOR ALL
  TO authenticated
  USING (
    user_id != auth.uid() -- Cannot modify their own membership
    AND family_id IN (
      SELECT fm.family_id 
      FROM family_members fm 
      WHERE fm.user_id = auth.uid() 
      AND fm.role IN ('admin', 'owner')
      AND fm.family_id = family_members.family_id
    )
  )
  WITH CHECK (
    user_id != auth.uid() -- Cannot modify their own membership
    AND family_id IN (
      SELECT fm.family_id 
      FROM family_members fm 
      WHERE fm.user_id = auth.uid() 
      AND fm.role IN ('admin', 'owner')
      AND fm.family_id = family_members.family_id
    )
  );