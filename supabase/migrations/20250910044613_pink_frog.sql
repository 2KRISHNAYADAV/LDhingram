/*
  # Create missing database tables and fix schema issues

  1. New Tables
    - `stories` table with proper structure and expiration
    - Ensure all tables have proper RLS policies
    
  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for all operations
    
  3. Functions
    - Add trigger functions for count updates
    - Add proper indexing for performance
*/

-- Create stories table if it doesn't exist
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on stories table
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policies for stories
CREATE POLICY "Public stories are viewable by everyone"
  ON stories
  FOR SELECT
  TO public
  USING (expires_at > now());

CREATE POLICY "Users can insert their own stories"
  ON stories
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
  ON stories
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Ensure trigger functions exist
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_likes_count_trigger'
  ) THEN
    CREATE TRIGGER update_likes_count_trigger
      AFTER INSERT OR DELETE ON likes
      FOR EACH ROW EXECUTE FUNCTION update_likes_count();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_comments_count_trigger'
  ) THEN
    CREATE TRIGGER update_comments_count_trigger
      AFTER INSERT OR DELETE ON comments
      FOR EACH ROW EXECUTE FUNCTION update_comments_count();
  END IF;
END $$;