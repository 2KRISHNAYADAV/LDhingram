import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Phone, Video, MoreVertical, Smile, Paperclip, Camera, Mic, Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: Date
  isRead: boolean
  type: 'text' | 'image' | 'video' | 'audio'
  replyTo?: string
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  isTyping: boolean
}

const RealTimeChat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data
  useEffect(() => {
    setChats([
      {
        id: '1',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        lastMessage: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        unreadCount: 2,
        isOnline: true,
        isTyping: false
      },
      {
        id: '2',
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        lastMessage: 'Thanks for the great post!',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        unreadCount: 0,
        isOnline: false,
        isTyping: false
      },
      {
        id: '3',
        name: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        lastMessage: 'See you tomorrow!',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        unreadCount: 1,
        isOnline: true,
        isTyping: true
      }
    ])

    setMessages([
      {
        id: '1',
        content: 'Hey! How are you doing?',
        senderId: 'other',
        receiverId: 'me',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: '2',
        content: "I'm doing great! Thanks for asking. How about you?",
        senderId: 'me',
        receiverId: 'other',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: '3',
        content: "I'm good too! Just working on some new projects.",
        senderId: 'other',
        receiverId: 'me',
        timestamp: new Date(Date.now() - 30 * 1000),
        isRead: false,
        type: 'text'
      }
    ])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: 'me',
      receiverId: selectedChat,
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate reply
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message!',
        senderId: selectedChat,
        receiverId: 'me',
        timestamp: new Date(),
        isRead: false,
        type: 'text'
      }
      setMessages(prev => [...prev, reply])
    }, 2000)
  }

  const selectedChatData = chats.find(chat => chat.id === selectedChat)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Input
              placeholder="Search messages..."
              className="pl-10 rounded-2xl border-gray-200 focus:border-pink-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={cn(
                "p-4 cursor-pointer border-b border-gray-100 transition-colors",
                selectedChat === chat.id && "bg-pink-50 border-pink-200"
              )}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                      {chat.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{formatDate(chat.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {chat.isTyping ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-pink-500 text-sm italic"
                      >
                        typing...
                      </motion.div>
                    ) : (
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    )}
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat View */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChatData?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                    {selectedChatData?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChatData?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChatData?.isOnline ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex",
                    msg.senderId === 'me' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                      msg.senderId === 'me'
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.senderId === 'me' && (
                        <div className="text-xs">
                          {msg.isRead ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                <Camera className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="rounded-2xl border-gray-200 focus:border-pink-500 pr-12"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealTimeChat
