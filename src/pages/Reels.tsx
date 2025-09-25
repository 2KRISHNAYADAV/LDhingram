import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoveHorizontal as MoreHorizontal, Volume2, VolumeX, Play, Pause, UserPlus, Share, Music, EggFried as Verified, Eye, Download, Flag, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { mockUsers } from "@/lib/data";

const Reels = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set([5, 7])); // Pre-follow some users
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced reels data with Indian creators
  const reels = [
    {
      id: 1,
      user: mockUsers[3], // Priya Sharma
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      caption: "Classical Bharatanatyam fusion 💃✨ Bringing tradition to modern beats! #IndianDance #Bharatanatyam #Fusion #Mumbai",
      likes: 45600,
      comments: 1234,
      shares: 567,
      views: 234000,
      audio: "Raag Fusion Mix - Priya Sharma",
      hashtags: ["#IndianDance", "#Bharatanatyam", "#Fusion", "#Mumbai"],
      location: "Mumbai, Maharashtra"
    },
    {
      id: 2,
      user: mockUsers[4], // Arjun Patel
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      caption: "Building the next unicorn 🚀 From garage to global! Tech startup journey in 60 seconds 💡 #TechLife #Startup #Bangalore #Innovation",
      likes: 23400,
      comments: 890,
      shares: 234,
      views: 156000,
      audio: "Motivational Tech Beats",
      hashtags: ["#TechLife", "#Startup", "#Bangalore", "#Innovation"],
      location: "Bangalore, Karnataka"
    },
    {
      id: 3,
      user: mockUsers[5], // Kavya Reddy
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
      caption: "Authentic Hyderabadi Biryani recipe 🍛 Secret family recipe revealed! Grandma's special masala ❤️ #BiryaniLove #HyderabadFood #IndianCuisine",
      likes: 18900,
      comments: 567,
      shares: 189,
      views: 89000,
      audio: "Cooking Vibes - Desi Kitchen",
      hashtags: ["#BiryaniLove", "#HyderabadFood", "#IndianCuisine"],
      location: "Hyderabad, Telangana"
    },
    {
      id: 4,
      user: mockUsers[6], // Rohit Singh
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
      caption: "MS Dhoni's helicopter shot practice 🏏 Captain Cool forever! Delhi cricket ground vibes 💙 #Cricket #MSDhoni #Delhi #Sports",
      likes: 67800,
      comments: 2345,
      shares: 890,
      views: 456000,
      audio: "Cricket Anthem - Rohit Singh",
      hashtags: ["#Cricket", "#MSDhoni", "#Delhi", "#Sports"],
      location: "Delhi, India"
    },
    {
      id: 5,
      user: mockUsers[7], // Ananya Gupta
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
      caption: "Sustainable fashion haul 👗🌱 Eco-friendly ethnic wear from local artisans! Supporting Indian craftsmanship ✨ #SustainableFashion #EthnicWear #Kolkata",
      likes: 89200,
      comments: 3456,
      shares: 1234,
      views: 567000,
      audio: "Fashion Forward - Ananya",
      hashtags: ["#SustainableFashion", "#EthnicWear", "#Kolkata"],
      location: "Kolkata, West Bengal"
    },
    {
      id: 6,
      user: mockUsers[1], // Sarah Chen
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b976?w=400&h=600&fit=crop",
      caption: "Golden hour magic in Goa 🌅 Beach vibes and sunset dreams! Perfect end to an amazing day ✨ #GoaVibes #SunsetLover #BeachLife",
      likes: 34500,
      comments: 1567,
      shares: 456,
      views: 234000,
      audio: "Sunset Chill - Beach Vibes",
      hashtags: ["#GoaVibes", "#SunsetLover", "#BeachLife"],
      location: "Goa, India"
    }
  ];

  const currentReelData = reels[currentReel];

  useEffect(() => {
    // Simulate view count increase
    const timer = setTimeout(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentReel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        navigateReel('up');
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        navigateReel('down');
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted(!isMuted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted, isPlaying]);

  const toggleLike = (reelId: number) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const toggleSave = (reelId: number) => {
    setSavedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const toggleFollow = (userId: number) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navigateReel = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentReel < reels.length - 1) {
      setCurrentReel(prev => prev + 1);
    } else if (direction === 'up' && currentReel > 0) {
      setCurrentReel(prev => prev - 1);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Left Sidebar - VK Style */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white mb-4">Reels</h1>
            <div className="flex items-center gap-3 text-gray-300">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{formatNumber(currentReelData.views + viewCount)} views</span>
            </div>
          </div>

          {/* Creator Info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-pink-500">
                <AvatarImage src={currentReelData.user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-lg">
                  {currentReelData.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">{currentReelData.user.name}</h3>
                  {currentReelData.user.isVerified && (
                    <Verified className="w-5 h-5 text-blue-500 fill-blue-500" />
                  )}
                </div>
                <p className="text-gray-400 text-sm">{currentReelData.user.username}</p>
                <p className="text-gray-500 text-xs">{formatNumber(currentReelData.user.followers)} followers</p>
              </div>
            </div>
            
            <Button
              onClick={() => toggleFollow(currentReelData.user.id)}
              className={cn(
                "w-full rounded-xl font-semibold transition-all duration-300",
                followedUsers.has(currentReelData.user.id)
                  ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg"
              )}
            >
              {followedUsers.has(currentReelData.user.id) ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          </div>

          {/* Caption and Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-white leading-relaxed">{currentReelData.caption}</p>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-2">
                {currentReelData.hashtags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 cursor-pointer transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">📍 {currentReelData.location}</span>
              </div>

              {/* Audio */}
              <div className="flex items-center gap-2 text-gray-400 bg-gray-800/50 rounded-xl p-3">
                <Music className="w-4 h-4" />
                <span className="text-sm truncate">♪ {currentReelData.audio}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatNumber(currentReelData.likes + (likedReels.has(currentReelData.id) ? 1 : 0))}</div>
                  <div className="text-gray-400 text-sm">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatNumber(currentReelData.comments)}</div>
                  <div className="text-gray-400 text-sm">Comments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Video Container */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Background Image */}
            <img 
              src={currentReelData.thumbnail}
              alt="Reel thumbnail"
              className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30"
            />
            
            {/* Main Video */}
            <video
              ref={videoRef}
              className="relative max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              loop
              muted={isMuted}
              autoPlay
              playsInline
              style={{ maxWidth: '400px', aspectRatio: '9/16' }}
            >
              <source src={currentReelData.video} type="video/mp4" />
            </video>

            {/* Play/Pause Overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlayPause}
            >
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="bg-black/70 rounded-full p-6 backdrop-blur-sm"
                  >
                    <Play className="w-12 h-12 text-white ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Volume Control */}
            <div className="absolute top-6 right-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {reels.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReel(index)}
                className={cn(
                  "w-2 h-8 rounded-full transition-all duration-300",
                  index === currentReel 
                    ? "bg-white shadow-lg" 
                    : "bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right Actions Panel */}
        <div className="w-20 flex flex-col items-center justify-center gap-8 bg-gray-900 border-l border-gray-800">
          {/* Like */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 rounded-full text-white hover:bg-white/10"
              onClick={() => toggleLike(currentReelData.id)}
            >
              <Heart 
                className={cn(
                  "w-8 h-8 transition-all duration-300",
                  likedReels.has(currentReelData.id) 
                    ? "fill-red-500 text-red-500 animate-pulse" 
                    : "text-white hover:text-red-400"
                )} 
              />
            </Button>
            <span className="text-white text-xs font-medium mt-1">
              {formatNumber(currentReelData.likes + (likedReels.has(currentReelData.id) ? 1 : 0))}
            </span>
          </motion.div>

          {/* Comment */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-14 h-14 rounded-full text-white hover:bg-white/10"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="w-8 h-8" />
            </Button>
            <span className="text-white text-xs font-medium mt-1">{formatNumber(currentReelData.comments)}</span>
          </motion.div>

          {/* Share */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-14 h-14 rounded-full text-white hover:bg-white/10"
              onClick={() => setShowShare(true)}
            >
              <Send className="w-8 h-8" />
            </Button>
            <span className="text-white text-xs font-medium mt-1">{formatNumber(currentReelData.shares)}</span>
          </motion.div>

          {/* Save */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-14 h-14 rounded-full text-white hover:bg-white/10"
              onClick={() => toggleSave(currentReelData.id)}
            >
              <Bookmark 
                className={cn(
                  "w-8 h-8 transition-all duration-300",
                  savedReels.has(currentReelData.id) 
                    ? "fill-yellow-500 text-yellow-500" 
                    : "text-white hover:text-yellow-400"
                )} 
              />
            </Button>
          </motion.div>

          {/* More */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-14 h-14 rounded-full text-white hover:bg-white/10"
            >
              <MoreHorizontal className="w-8 h-8" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative h-full">
        {/* Video Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center touch-pan-y"
        >
          {/* Background Image */}
          <img 
            src={currentReelData.thumbnail}
            alt="Reel thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Video Element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted={isMuted}
            autoPlay
            playsInline
          >
            <source src={currentReelData.video} type="video/mp4" />
          </video>

          {/* Play/Pause Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer touch-manipulation"
            onClick={togglePlayPause}
          >
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-black/70 rounded-full p-4 backdrop-blur-sm"
                >
                  <Play className="w-12 h-12 text-white ml-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pt-12 z-30">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-bold">REELS</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(currentReelData.views + viewCount)}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 w-10 h-10 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Right Side Actions - Mobile */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-6 z-30">
          {/* Profile */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <Avatar className="w-14 h-14 border-3 border-white shadow-lg">
                <AvatarImage src={currentReelData.user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                  {currentReelData.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {currentReelData.user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Verified className="w-3 h-3 text-white fill-white" />
                </div>
              )}
              {!followedUsers.has(currentReelData.user.id) && (
                <motion.button
                  onClick={() => toggleFollow(currentReelData.user.id)}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <UserPlus className="w-3 h-3 text-white" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Like */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full text-white hover:bg-white/20 p-0"
              onClick={() => toggleLike(currentReelData.id)}
            >
              <Heart 
                className={cn(
                  "w-8 h-8 transition-all duration-300",
                  likedReels.has(currentReelData.id) 
                    ? "fill-red-500 text-red-500 animate-pulse" 
                    : "text-white drop-shadow-lg"
                )} 
              />
            </Button>
            <span className="text-white text-xs font-bold mt-1 drop-shadow-lg">
              {formatNumber(currentReelData.likes + (likedReels.has(currentReelData.id) ? 1 : 0))}
            </span>
          </motion.div>

          {/* Comment */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 rounded-full text-white hover:bg-white/20 p-0"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="w-8 h-8 drop-shadow-lg" />
            </Button>
            <span className="text-white text-xs font-bold mt-1 drop-shadow-lg">{formatNumber(currentReelData.comments)}</span>
          </motion.div>

          {/* Share */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 rounded-full text-white hover:bg-white/20 p-0"
              onClick={() => setShowShare(true)}
            >
              <Send className="w-8 h-8 drop-shadow-lg" />
            </Button>
            <span className="text-white text-xs font-bold mt-1 drop-shadow-lg">{formatNumber(currentReelData.shares)}</span>
          </motion.div>

          {/* Save */}
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 rounded-full text-white hover:bg-white/20 p-0"
              onClick={() => toggleSave(currentReelData.id)}
            >
              <Bookmark 
                className={cn(
                  "w-8 h-8 transition-all duration-300 drop-shadow-lg",
                  savedReels.has(currentReelData.id) 
                    ? "fill-yellow-500 text-yellow-500" 
                    : "text-white"
                )} 
              />
            </Button>
          </motion.div>

          {/* More */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 rounded-full text-white hover:bg-white/20 p-0"
            >
              <MoreHorizontal className="w-8 h-8 drop-shadow-lg" />
            </Button>
          </motion.div>
        </div>

        {/* Bottom Content - Mobile */}
        <div className="absolute bottom-20 left-0 right-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-20">
          <div className="text-white space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{currentReelData.user.username}</span>
              {currentReelData.user.isVerified && (
                <Verified className="w-5 h-5 text-blue-500 fill-blue-500" />
              )}
              {!followedUsers.has(currentReelData.user.id) && (
                <Button 
                  onClick={() => toggleFollow(currentReelData.user.id)}
                  size="sm" 
                  className="bg-white text-black hover:bg-gray-200 font-bold px-4 py-1 rounded-full"
                >
                  Follow
                </Button>
              )}
            </div>

            {/* Caption */}
            <p className="text-sm leading-relaxed drop-shadow-lg">{currentReelData.caption}</p>

            {/* Audio */}
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Music className="w-4 h-4" />
              <span className="truncate">♪ {currentReelData.audio}</span>
            </div>
          </div>
        </div>

        {/* Navigation Indicators - Mobile */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReel(index)}
              className={cn(
                "w-1 h-8 rounded-full transition-all duration-300",
                index === currentReel ? "bg-white shadow-lg" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4"
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6 text-center">Share Reel</h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { icon: "📱", label: "WhatsApp", color: "bg-green-500" },
                  { icon: "📘", label: "Facebook", color: "bg-blue-600" },
                  { icon: "🐦", label: "Twitter", color: "bg-blue-400" },
                  { icon: "📧", label: "Email", color: "bg-gray-600" },
                  { icon: "💬", label: "Telegram", color: "bg-blue-500" },
                  { icon: "📋", label: "Copy Link", color: "bg-gray-500" },
                  { icon: "⬇️", label: "Download", color: "bg-purple-600" },
                  { icon: "🚩", label: "Report", color: "bg-red-500" }
                ].map((option, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl", option.color)}>
                      {option.icon}
                    </div>
                    <span className="text-xs text-gray-600 text-center">{option.label}</span>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setShowShare(false)}
                className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-2xl"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-md h-2/3 lg:h-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden" />
                <h3 className="text-xl font-bold text-center">Comments</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Mock comments */}
                {[
                  { user: "Raj Kumar", comment: "Amazing dance moves! 🔥", time: "2m" },
                  { user: "Sneha Patel", comment: "Love this! Can you teach me? 💕", time: "5m" },
                  { user: "Vikram Singh", comment: "Incredible talent! 👏", time: "8m" }
                ].map((comment, index) => (
                  <div key={index} className="flex gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs">
                        {comment.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{comment.user}</span> {comment.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{comment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reels;