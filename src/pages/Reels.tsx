import { useState, useRef } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Reels = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Mock reels data
  const reels = [
    {
      id: 1,
      user: { name: "Alex Rivera", username: "@alexr", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      caption: "Mountain vibes 🏔️ #nature #adventure",
      likes: 1240,
      comments: 89,
      shares: 23,
      audio: "Original audio - Alex Rivera"
    },
    {
      id: 2,
      user: { name: "Maya Patel", username: "@mayap", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616c5e5e4a8?w=400&h=600&fit=crop",
      caption: "Dance like nobody's watching 💃 #dance #viral",
      likes: 2156,
      comments: 145,
      shares: 67,
      audio: "Trending song - Artist Name"
    },
    {
      id: 3,
      user: { name: "James Wilson", username: "@jamesw", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      caption: "Cooking hack you need to try! 🍳 #cooking #lifehack",
      likes: 892,
      comments: 56,
      shares: 34,
      audio: "Original audio - James Wilson"
    },
    {
      id: 4,
      user: { name: "Sophie Chen", username: "@sophiec", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
      caption: "Travel goals achieved ✈️ #travel #wanderlust #explore",
      likes: 3421,
      comments: 234,
      shares: 89,
      audio: "Adventure Awaits - Travel Mix"
    },
    {
      id: 5,
      user: { name: "Marcus Johnson", username: "@marcusj", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
      caption: "Fitness motivation Monday 💪 #fitness #motivation #workout",
      likes: 1876,
      comments: 98,
      shares: 45,
      audio: "Pump It Up - Workout Mix"
    },
    {
      id: 6,
      user: { name: "Emma Rodriguez", username: "@emmar", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
      caption: "Art therapy session 🎨 #art #creative #painting",
      likes: 2543,
      comments: 167,
      shares: 78,
      audio: "Calm Vibes - Artistic Flow"
    },
    {
      id: 7,
      user: { name: "David Kim", username: "@davidk", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      caption: "Late night coding session 👨‍💻 #programming #developer #tech",
      likes: 1654,
      comments: 123,
      shares: 56,
      audio: "Lo-fi Code Beats"
    },
    {
      id: 8,
      user: { name: "Aria Thompson", username: "@ariat", avatar: null },
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616c5e5e4a8?w=400&h=600&fit=crop",
      caption: "Sunday brunch vibes 🥐 #food #brunch #weekend",
      likes: 3167,
      comments: 201,
      shares: 94,
      audio: "Sunday Morning Jazz"
    }
  ];

  const currentReelData = reels[currentReel];

  return (
    <div className="relative h-screen bg-black overflow-hidden touch-pan-y">
      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Image (fallback) */}
        <img 
          src={currentReelData.thumbnail}
          alt="Reel thumbnail"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          loop
          muted={isMuted}
          autoPlay
          playsInline
          onError={() => console.log('Video failed to load, showing thumbnail instead')}
        >
          <source src={currentReelData.video} type="video/mp4" />
        </video>

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/10 z-20 cursor-pointer touch-manipulation"
          onClick={togglePlayPause}
          onTouchStart={(e) => e.preventDefault()}
        >
          {!isPlaying && (
            <div className="bg-black/50 rounded-full p-3 sm:p-4 animate-scale-in">
              <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white ml-1" />
            </div>
          )}
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3 sm:p-4 pt-8 sm:pt-12 z-30">
        <div className="flex items-center justify-between text-white">
          <h1 className="text-lg sm:text-xl font-bold">Reels</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10 touch-manipulation"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-2 sm:right-4 bottom-24 sm:bottom-32 flex flex-col items-center gap-4 sm:gap-6 z-30">
        {/* Profile */}
        <div className="flex flex-col items-center">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white">
            <AvatarImage src={currentReelData.user.avatar || currentReelData.thumbnail} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs sm:text-sm">
              {currentReelData.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:bg-white/20 p-0 touch-manipulation"
            onClick={() => toggleLike(currentReelData.id)}
          >
            <Heart 
              className={cn(
                "w-5 h-5 sm:w-7 sm:h-7 transition-smooth",
                likedReels.has(currentReelData.id) 
                  ? "fill-ldh-crimson text-ldh-crimson animate-heart-beat" 
                  : "text-white"
              )} 
            />
          </Button>
          <span className="text-white text-xs font-medium mt-1">
            {currentReelData.likes + (likedReels.has(currentReelData.id) ? 1 : 0)}
          </span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:bg-white/20 p-0 touch-manipulation">
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          <span className="text-white text-xs font-medium mt-1">{currentReelData.comments}</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:bg-white/20 p-0 touch-manipulation">
            <Send className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          <span className="text-white text-xs font-medium mt-1">{currentReelData.shares}</span>
        </div>

        {/* Save */}
        <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:bg-white/20 p-0 touch-manipulation">
          <Bookmark className="w-5 h-5 sm:w-7 sm:h-7" />
        </Button>

        {/* More */}
        <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:bg-white/20 p-0 touch-manipulation">
          <MoreHorizontal className="w-5 h-5 sm:w-7 sm:h-7" />
        </Button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-12 sm:right-16 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 z-20">
        <div className="text-white space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold text-sm sm:text-base">{currentReelData.user.username}</span>
            <Button variant="outline" size="sm" className="border-white text-white bg-transparent hover:bg-white hover:text-black text-xs sm:text-sm px-2 sm:px-3 py-1">
              Follow
            </Button>
          </div>

          {/* Caption */}
          <p className="text-xs sm:text-sm leading-relaxed">{currentReelData.caption}</p>

          {/* Audio */}
          <div className="flex items-center gap-2 text-xs opacity-80">
            <span className="truncate">♪ {currentReelData.audio}</span>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 sm:gap-2 z-30">
        {reels.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReel(index)}
            className={cn(
              "w-0.5 sm:w-1 h-6 sm:h-8 rounded-full transition-smooth touch-manipulation",
              index === currentReel ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Reels;