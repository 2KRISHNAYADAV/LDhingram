import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreVertical,
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveStreamProps {
  isOpen: boolean
  onClose: () => void
  onStartStream: (streamData: any) => void
}

interface Viewer {
  id: string
  name: string
  avatar: string
  isFollowing: boolean
}

interface Comment {
  id: string
  user: Viewer
  message: string
  timestamp: Date
  isHighlighted: boolean
}

const LiveStream = ({ isOpen, onClose, onStartStream }: LiveStreamProps) => {
  const [isLive, setIsLive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [viewerCount, setViewerCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [streamTitle, setStreamTitle] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [viewers, setViewers] = useState<Viewer[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isLive) {
      // Simulate viewer count increase
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3))
      }, 2000)

      // Simulate comments
      const commentInterval = setInterval(() => {
        const mockComments = [
          'Amazing content! 🔥',
          'Love this!',
          'Keep it up!',
          'So cool!',
          'First!',
          'This is awesome!'
        ]
        
        const newComment: Comment = {
          id: Date.now().toString(),
          user: {
            id: Math.random().toString(),
            name: `User${Math.floor(Math.random() * 1000)}`,
            avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop&crop=face`,
            isFollowing: Math.random() > 0.5
          },
          message: mockComments[Math.floor(Math.random() * mockComments.length)],
          timestamp: new Date(),
          isHighlighted: Math.random() > 0.8
        }
        
        setComments(prev => [...prev.slice(-10), newComment])
      }, 3000)

      // Simulate likes
      const likeInterval = setInterval(() => {
        setLikeCount(prev => prev + Math.floor(Math.random() * 5))
      }, 1000)

      return () => {
        clearInterval(interval)
        clearInterval(commentInterval)
        clearInterval(likeInterval)
      }
    }
  }, [isLive])

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      
      setIsLive(true)
      setViewerCount(1)
      onStartStream({ title: streamTitle, isLive: true })
    } catch (error) {
      console.error('Error starting stream:', error)
    }
  }

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsLive(false)
    setViewerCount(0)
    setLikeCount(0)
    setComments([])
  }

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = isVideoOn
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const handleLike = () => {
    setLikeCount(prev => prev + 1)
  }

  const handleComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          id: 'me',
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isFollowing: false
        },
        message: newComment,
        timestamp: new Date(),
        isHighlighted: false
      }
      setComments(prev => [...prev, comment])
      setNewComment('')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-semibold">LIVE</span>
              </div>
              <span className="text-white text-sm">{viewerCount} viewers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Stream */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Overlay when not live */}
          {!isLive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Start Your Live Stream</h3>
                <p className="text-gray-300 mb-6">Share your moments with the world</p>
                <div className="space-y-4">
                  <Input
                    placeholder="Stream title..."
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    className="w-80 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Button
                    onClick={startStream}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
                  >
                    Go Live
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Live Controls */}
          {isLive && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleMute}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
                  )}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={toggleVideo}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    !isVideoOn ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
                  )}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={stopStream}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleLike}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <Heart className="w-6 h-6" />
                </Button>
                <span className="text-white text-sm">{likeCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Comments Sidebar */}
        {isLive && (
          <div className="absolute right-4 top-20 bottom-20 w-80 bg-black/50 backdrop-blur-sm rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Live Comments</h4>
              <div className="flex items-center space-x-1 text-white text-sm">
                <Users className="w-4 h-4" />
                <span>{viewerCount}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={cn(
                      "flex items-start space-x-2 p-2 rounded-lg",
                      comment.isHighlighted && "bg-yellow-500/20 border border-yellow-500/50"
                    )}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {comment.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{comment.user.name}</span>
                        <span className="ml-2">{comment.message}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
              <Button
                onClick={handleComment}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 top-20 w-80 bg-white rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold mb-4">Stream Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Stream Quality</label>
                <select className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
                  <option>1080p (Best)</option>
                  <option>720p (Good)</option>
                  <option>480p (Fair)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Audio Quality</label>
                <select className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
                  <option>High (128kbps)</option>
                  <option>Medium (96kbps)</option>
                  <option>Low (64kbps)</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="saveRecording" className="rounded" />
                <label htmlFor="saveRecording" className="text-sm text-gray-700">
                  Save recording
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default LiveStream
