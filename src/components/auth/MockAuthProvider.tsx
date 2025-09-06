import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name: string
    username: string
  }
}

interface AuthContextType {
  user: User | null
  session: any
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
  updateProfile: (updates: any) => Promise<any>
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
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('ldhingram_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setSession({ user: JSON.parse(savedUser) })
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      user_metadata: {
        full_name: userData.full_name || email.split('@')[0],
        username: userData.username || email.split('@')[0]
      }
    }
    
    setUser(newUser)
    setSession({ user: newUser })
    localStorage.setItem('ldhingram_user', JSON.stringify(newUser))
    
    setLoading(false)
    return { data: { user: newUser }, error: null }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any email/password
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      user_metadata: {
        full_name: email.split('@')[0],
        username: email.split('@')[0]
      }
    }
    
    setUser(user)
    setSession({ user })
    localStorage.setItem('ldhingram_user', JSON.stringify(user))
    
    setLoading(false)
    return { data: { user }, error: null }
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem('ldhingram_user')
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    return { data: {}, error: null }
  }

  const updateProfile = async (updates: any) => {
    if (user) {
      const updatedUser = { ...user, user_metadata: { ...user.user_metadata, ...updates } }
      setUser(updatedUser)
      setSession({ user: updatedUser })
      localStorage.setItem('ldhingram_user', JSON.stringify(updatedUser))
    }
    return { data: { user }, error: null }
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
