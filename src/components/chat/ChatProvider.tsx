import { createContext, useContext, useEffect, useState } from 'react'
import { SupabaseService } from '@/lib/supabaseService'
import { Message } from '@/lib/supabase'

interface ChatContextType {
  messages: Message[]
  sendMessage: (content: string, receiverId: string) => Promise<void>
  loading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (content: string, receiverId: string) => {
    try {
      // For now, use a mock user ID - in real app, get from auth
      const senderId = 'mock-user-id'
      const message = await SupabaseService.sendMessage({
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })
      
      if (message) {
        setMessages(prev => [...prev, message])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Subscribe to real-time messages
  useEffect(() => {
    const subscription = SupabaseService.subscribeToMessages('mock-user-id', (payload) => {
      if (payload.eventType === 'INSERT') {
        setMessages(prev => [...prev, payload.new])
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    messages,
    sendMessage,
    loading
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
