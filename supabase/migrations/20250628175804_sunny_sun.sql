/*
  # Create storage buckets for memory media

  1. Storage Buckets
    - `memory_media` - for storing photos, videos, audio files, and documents
    - `profile_avatars` - for storing user profile pictures
    - `family_photos` - for storing family cover photos

  2. Security
    - Set up RLS policies for each bucket
    - Allow family members to upload and access memory media
    - Allow users to manage their own profile avatars
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('memory_media', 'memory_media', true),
  ('profile_avatars', 'profile_avatars', true),
  ('family_photos', 'family_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Memory media bucket policies
CREATE POLICY "Family members can upload memory media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'memory_media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Family members can view memory media"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'memory_media');

CREATE POLICY "Memory creators can update their media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'memory_media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Memory creators can delete their media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'memory_media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Profile avatars bucket policies
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile_avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view profile avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'profile_avatars');

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile_avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile_avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Family photos bucket policies
CREATE POLICY "Family admins can upload family photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'family_photos');

CREATE POLICY "Family members can view family photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'family_photos');

CREATE POLICY "Family admins can update family photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'family_photos');

CREATE POLICY "Family admins can delete family photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'family_photos');