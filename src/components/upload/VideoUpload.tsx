import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Upload, Play, Pause, Volume2, VolumeX, Camera, Mic, Edit3, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (video: File, metadata: any) => void
}

const VideoUpload = ({ isOpen, onClose, onUpload }: VideoUploadProps) => {
  const [step, setStep] = useState(1) // 1: Select video, 2: Edit, 3: Add details
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [location, setLocation] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setStep(2)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setStep(2)
    }
  }, [])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleUpload = async () => {
    if (!videoFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onUpload(videoFile, {
            caption,
            hashtags: hashtags.split(' ').filter(tag => tag.trim()),
            location
          })
          onClose()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const resetForm = () => {
    setStep(1)
    setVideoFile(null)
    setVideoUrl('')
    setIsPlaying(false)
    setIsMuted(false)
    setCaption('')
    setHashtags('')
    setLocation('')
    setUploadProgress(0)
    setIsUploading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 1 ? 'Upload Video' : step === 2 ? 'Edit Video' : 'Add Details'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-10 h-10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {step === 1 && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div
                  className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Video</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Drag and drop your video here, or click to browse
                  </p>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Choose File
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-4">
                  Supported formats: MP4, MOV, AVI, MKV
                </p>
              </motion.div>
            )}

            {step === 2 && videoUrl && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="relative w-full max-w-md">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-64 object-cover rounded-2xl"
                      onEnded={() => setIsPlaying(false)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={togglePlayPause}
                        className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        onClick={toggleMute}
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="caption" className="text-gray-700 font-medium">Caption</Label>
                    <Textarea
                      id="caption"
                      placeholder="Write a caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="min-h-24 rounded-2xl border-gray-200 focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags" className="text-gray-700 font-medium flex items-center">
                      <Hash className="w-4 h-4 mr-2" />
                      Hashtags
                    </Label>
                    <Input
                      id="hashtags"
                      placeholder="#fun #viral #trending"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="rounded-2xl border-gray-200 focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                    <Input
                      id="location"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="rounded-2xl border-gray-200 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {isUploading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading... {uploadProgress}%</span>
                      </div>
                    ) : (
                      'Upload Video'
                    )}
                  </Button>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VideoUpload
