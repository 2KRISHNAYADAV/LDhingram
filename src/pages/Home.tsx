import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/new-logo.png";
import StoryViewer from "@/components/StoryViewer";
import UploadModal from "@/components/UploadModal";
import { dataManager, Post, Story } from "@/lib/data";
import { SupabaseService } from "@/lib/supabaseService";
import { Post as SupabasePost, Story as SupabaseStory } from "@/lib/supabase";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'post' | 'reel' | 'story'>('post');

  // Load data on component mount
  useEffect(() => {
    loadPosts();
    loadStories();
  }, []);

  const loadPosts = async () => {
    try {
      const supabasePosts = await SupabaseService.getPosts();
      // Convert Supabase posts to local format for now
      const localPosts = supabasePosts.map(post => ({
        id: post.id,
        user: {
          id: post.profiles?.id || post.user_id,
          name: post.profiles?.full_name || 'Unknown User',
          username: post.profiles?.username || 'unknown',
          avatar: post.profiles?.avatar_url || '',
          isVerified: false
        },
        image: post.image_url,
        caption: post.caption,
        likes: post.likes_count,
        comments: post.comments_count,
        timeAgo: '2h ago', // You can implement time formatting
        isLiked: false, // You can implement like checking
        isSaved: false, // You can implement save checking
        isReel: post.is_reel
      }));
      setPosts(localPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback to mock data
      setPosts(dataManager.getPosts());
    }
  };

  const loadStories = async () => {
    try {
      const supabaseStories = await SupabaseService.getStories();
      // Convert Supabase stories to local format
      const localStories = supabaseStories.map(story => ({
        id: story.id,
        user: {
          id: story.profiles?.id || story.user_id,
          name: story.profiles?.full_name || 'Unknown User',
          username: story.profiles?.username || 'unknown',
          avatar: story.profiles?.avatar_url || '',
          isVerified: false
        },
        image: story.image_url,
        isViewed: false // You can implement view tracking
      }));
      setStories(localStories);
    } catch (error) {
      console.error('Error loading stories:', error);
      // Fallback to mock data
      setStories(dataManager.getStories());
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      // For now, we'll use a mock user ID - in real app, get from auth
      const userId = 'mock-user-id';
      await SupabaseService.likePost(userId, postId);
      // Reload posts to get updated like count
      loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      // Fallback to local data
      dataManager.likePost(parseInt(postId));
      setPosts([...dataManager.getPosts()]);
    }
  };

  const toggleSave = (postId: number) => {
    dataManager.savePost(postId);
    setPosts([...dataManager.getPosts()]);
  };

  const openUploadModal = (type: 'post' | 'reel' | 'story') => {
    setUploadType(type);
    setShowUploadModal(true);
  };

  const handleUploadComplete = () => {
    setPosts([...dataManager.getPosts()]);
    setStories([...dataManager.getStories()]);
  };

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryComplete = (storyId: number) => {
    dataManager.markStoryAsViewed(storyId);
    setStories([...dataManager.getStories()]);
  };

  return (
    <div className="min-h-screen bg-white mobile-content safe-area-top">
      {/* Header - Instagram Style */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <img 
              src={logoImage}
              alt="LDhingram Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold text-black ml-2">
              LDhingram
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 p-0"
              onClick={() => openUploadModal('post')}
            >
              <Plus className="w-6 h-6 text-black" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 p-0"
              onClick={() => window.location.href = '/messages'}
            >
              <MessageCircle className="w-6 h-6 text-black" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stories - Instagram Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto max-w-md mx-auto px-4 py-4 scrollbar-hide">
          {/* Your Story */}
          <div className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0">
            <div className="relative">
              <div 
                className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => openUploadModal('story')}
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium text-center w-16 truncate">Your story</span>
          </div>
          
          {/* Other Stories */}
          {stories.map((story, index) => (
            <div 
              key={`story-${story.id}`} 
              className="flex flex-col items-center gap-1 min-w-0 flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(index)}
            >
              <div className={cn(
                "p-0.5 rounded-full",
                story.isViewed 
                  ? "bg-gray-300" 
                  : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
              )}>
                <Avatar className="w-16 h-16 border-2 border-white">
                  <AvatarImage src={story.user.avatar} className="object-cover" />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-semibold">
                    {story.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center font-medium">
                {story.user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Feed - Instagram Style */}
      <div className="max-w-md mx-auto">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border-b border-gray-200">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.user.avatar || post.image} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                    {post.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-1">
                    {post.user.name}
                    {post.user.isVerified && (
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </h3>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                <MoreHorizontal className="w-5 h-5 text-black" />
              </Button>
            </div>

            {/* Post Image */}
            <div className="relative">
              <img 
                src={post.image} 
                alt="Post image"
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 p-0"
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart 
                      className={cn(
                        "w-6 h-6 transition-smooth",
                        post.isLiked 
                          ? "fill-red-500 text-red-500" 
                          : "text-black hover:text-gray-600"
                      )} 
                    />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                    <MessageCircle className="w-6 h-6 text-black hover:text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                    <Send className="w-6 h-6 text-black hover:text-gray-600" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 p-0"
                  onClick={() => toggleSave(post.id)}
                >
                  <Bookmark 
                    className={cn(
                      "w-6 h-6 transition-smooth",
                      post.isSaved 
                        ? "fill-black text-black" 
                        : "text-black hover:text-gray-600"
                    )} 
                  />
                </Button>
              </div>

              {/* Likes and Caption */}
              <div className="space-y-2">
                <p className="font-semibold text-sm">
                  {post.likes} likes
                </p>
                <p className="text-sm">
                  <span className="font-semibold">{post.user.username}</span>{" "}
                  {post.caption}
                </p>
                <button className="text-gray-500 text-sm hover:text-gray-700 transition-smooth">
                  View all {post.comments} comments
                </button>
                <p className="text-xs text-gray-500">{post.timeAgo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {showStoryViewer && (
        <StoryViewer
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          onClose={() => setShowStoryViewer(false)}
          onNext={() => setCurrentStoryIndex(prev => Math.min(prev + 1, stories.length - 1))}
          onPrevious={() => setCurrentStoryIndex(prev => Math.max(prev - 1, 0))}
          onStoryComplete={handleStoryComplete}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type={uploadType}
      />
    </div>
  );
};

export default Home;