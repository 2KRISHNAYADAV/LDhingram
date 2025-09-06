import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Story {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  media: {
    type: 'image' | 'video';
    url: string;
    duration?: number;
  };
  timestamp: string;
  isViewed: boolean;
}

interface StoryViewerProps {
  stories: Story[];
  currentStoryIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onStoryComplete: (storyId: number) => void;
}

const StoryViewer = ({ 
  stories, 
  currentStoryIndex, 
  onClose, 
  onNext, 
  onPrevious, 
  onStoryComplete 
}: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const currentStory = stories[currentStoryIndex];
  const duration = currentStory?.media.type === 'video' ? 
    (currentStory.media.duration || 10) * 1000 : 5000;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        
        if (newProgress >= 100) {
          onStoryComplete(currentStory.id);
          
          if (currentStoryIndex < stories.length - 1) {
            onNext();
            return 0;
          } else {
            onClose();
            return 0;
          }
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, duration, isPlaying, currentStory.id, onNext, onClose, onStoryComplete, stories.length]);

  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex]);

  const handleMediaLoad = () => {
    setIsPlaying(true);
  };

  const handleTouchStart = () => {
    setIsPlaying(false);
  };

  const handleTouchEnd = () => {
    setIsPlaying(true);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: index < currentStoryIndex ? '100%' : 
                       index === currentStoryIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={currentStory.user.avatar} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {currentStory.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white text-sm">
              {currentStory.user.name}
            </h3>
            <p className="text-white/70 text-xs">{currentStory.timestamp}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation areas */}
      <div className="absolute inset-0 flex">
        <div 
          className="flex-1 flex items-center justify-start pl-4"
          onClick={onPrevious}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentStoryIndex > 0 && (
            <ChevronLeft className="w-8 h-8 text-white/70" />
          )}
        </div>
        <div 
          className="flex-1 flex items-center justify-end pr-4"
          onClick={onNext}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentStoryIndex < stories.length - 1 && (
            <ChevronRight className="w-8 h-8 text-white/70" />
          )}
        </div>
      </div>

      {/* Media content */}
      <div className="w-full h-full flex items-center justify-center">
        {currentStory.media.type === 'image' ? (
          <img
            src={currentStory.media.url}
            alt="Story content"
            className="max-w-full max-h-full object-contain"
            onLoad={handleMediaLoad}
          />
        ) : (
          <video
            src={currentStory.media.url}
            className="max-w-full max-h-full object-contain"
            autoPlay
            muted={false}
            onLoadedData={handleMediaLoad}
            onEnded={() => {
              onStoryComplete(currentStory.id);
              if (currentStoryIndex < stories.length - 1) {
                onNext();
              } else {
                onClose();
              }
            }}
          />
        )}
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-8 left-4 right-4 flex items-center gap-4 z-10">
        <div className="flex-1 flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Send message..."
            className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="w-10 h-10 text-white hover:bg-white/20">
          <Heart className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10 text-white hover:bg-white/20">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StoryViewer;