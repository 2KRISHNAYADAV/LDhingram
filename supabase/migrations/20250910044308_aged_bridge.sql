/*
  # Fix Missing Stories Table

  This script creates the missing 'stories' table and its associated policies
  that are causing the 404 error in the application.

  Run this in your Supabase SQL Editor to resolve the error.
*/

-- Create stories table if it doesn't exist
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on stories table
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stories
CREATE POLICY "Public stories are viewable by everyone" ON stories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for stories if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true);
EXCEPTION
  WHEN unique_violation THEN
    NULL; -- Bucket already exists
END $$;

-- Create storage policies for stories
CREATE POLICY "Public stories are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'stories');
CREATE POLICY "Users can upload stories" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stories' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own stories" ON storage.objects FOR UPDATE USING (bucket_id = 'stories' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own stories" ON storage.objects FOR DELETE USING (bucket_id = 'stories' AND auth.uid()::text = (storage.foldername(name))[1]);