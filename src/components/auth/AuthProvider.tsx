import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
  updateProfile: (updates: any) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signInWithApple: () => Promise<any>
  verifyOTP: (phone: string, token: string) => Promise<any>
  sendOTP: (phone: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        toast.success('Welcome back!')
      } else if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || email.split('@')[0],
            username: userData.username || email.split('@')[0],
            avatar_url: userData.avatar_url || null,
          }
        }
      })
      
      if (error) throw error
      
      if (data.user && !error) {
        // Create profile in database
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username: userData.username || email.split('@')[0],
          full_name: userData.full_name || email.split('@')[0],
          avatar_url: userData.avatar_url || null,
          bio: userData.bio || null,
          website: userData.website || null,
          followers_count: 0,
          following_count: 0,
          posts_count: 0
        })
        
        if (profileError) throw profileError
        toast.success('Account created successfully!')
      }
      
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in with Google')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in with Apple')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const sendOTP = async (phone: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      })
      
      if (error) throw error
      toast.success('OTP sent successfully!')
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (phone: string, token: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      })
      
      if (error) throw error
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify OTP')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      toast.success('Password reset email sent!')
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) throw error
      
      // Also update the profiles table
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
        
        if (profileError) throw profileError
      }
      
      toast.success('Profile updated successfully!')
      return { data, error }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    signInWithGoogle,
    signInWithApple,
    sendOTP,
    verifyOTP,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}