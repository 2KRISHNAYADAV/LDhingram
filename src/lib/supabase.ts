import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zwlumwlqirexpkluebfw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bHVtd2xxaXJleHBrbHVlYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjI3MjIsImV4cCI6MjA3MjczODcyMn0.ZWDl6oSmyf4MFN0xQi1HXrt7Ey4A7mGvbgIqrSLIBOk';

// Log configuration for debugging
console.log('Supabase configuration:');
console.log('URL:', supabaseUrl);
console.log('Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Test connection on initialization
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
      console.error('Please check:');
      console.error('1. Supabase project is active in dashboard');
      console.error('2. URL and API key are correct');
      console.error('3. CORS is configured for localhost:8080');
    } else {
      console.log('✅ Supabase connection test successful');
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection test failed with network error:', error);
    console.error('This indicates a network connectivity or CORS issue');
  });

// Database types
export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  website?: string
  followers_count: number
  following_count: number
  posts_count: number
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  caption: string
  image_url: string
  is_reel: boolean
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Story {
  id: string
  user_id: string
  image_url: string
  expires_at: string
  created_at: string
  profiles?: Profile
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Save {
  id: string
  user_id: string
  post_id: string
  created_at: string
}
