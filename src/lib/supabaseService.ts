import { supabase, Profile, Post, Story, Like, Comment, Message, Follow, Save } from './supabase'

export class SupabaseService {
  // Profile operations
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating profile:', error)
      return null
    }
    return data
  }

  // Post operations
  static async getPosts(limit = 20, offset = 0): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    
      if (error) {
        console.error('Error fetching posts:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Posts fetch error:', error)
      return []
    }
  }

  static async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()
    
    if (error) {
      console.error('Error creating post:', error)
      return null
    }
    return data
  }

  static async likePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, post_id: postId })
    
    if (error) {
      console.error('Error liking post:', error)
      return false
    }
    return true
  }

  static async unlikePost(userId: string, postId: string): Promise<boolean> {
    try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
    
    if (error) {
      console.error('Error unliking post:', error)
      return false
    }
    return true
  }

  // Story operations
  static async getStories(): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching stories:', error)
      return []
    }
    return data || []
  }

  static async createStory(story: Omit<Story, 'id' | 'created_at'>): Promise<Story | null> {
    const { data, error } = await supabase
      .from('stories')
      .insert(story)
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()
    
    if (error) {
      console.error('Error creating story:', error)
      return null
    }
    return data
  }

  // Comment operations
  static async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching comments:', error)
      return []
    }
    return data || []
  }

  static async addComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()
    
    if (error) {
      console.error('Error adding comment:', error)
      return null
    }
    return data
  }

  // Follow operations
  static async followUser(followerId: string, followingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId })
    
    if (error) {
      console.error('Error following user:', error)
      return false
    }
    return true
  }

  static async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
    
    if (error) {
      console.error('Error unfollowing user:', error)
      return false
    }
    return true
  }

  // Save operations
  static async savePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('saves')
      .insert({ user_id: userId, post_id: postId })
    
    if (error) {
      console.error('Error saving post:', error)
      return false
    }
    return true
  }

  static async unsavePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('saves')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
    
    if (error) {
      console.error('Error unsaving post:', error)
      return false
    }
    return true
  }

  // Message operations
  static async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }
    return data || []
  }

  static async sendMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()
    
    if (error) {
      console.error('Error sending message:', error)
      return null
    }
    return data
  }

  // Realtime subscriptions
  static subscribeToPosts(callback: (payload: any) => void) {
    return supabase
      .channel('posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        callback
      )
      .subscribe()
  }

  static subscribeToLikes(callback: (payload: any) => void) {
    return supabase
      .channel('likes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'likes' }, 
        callback
      )
      .subscribe()
  }

  static subscribeToComments(callback: (payload: any) => void) {
    return supabase
      .channel('comments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'comments' }, 
        callback
      )
      .subscribe()
  }

  static subscribeToMessages(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages', filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})` }, 
        callback
      )
      .subscribe()
  }
}