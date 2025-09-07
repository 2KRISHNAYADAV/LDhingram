import { useState, useRef, useEffect } from "react";
import { Settings, Grid3X3, Play, Bookmark, UserPlus, MessageCircle, MoreHorizontal, Edit3, Camera, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import UploadModal from "@/components/UploadModal";
import { dataManager, User, Post } from "@/lib/data";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'post' | 'reel' | 'story'>('post');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // User data with editing state
  const [user, setUser] = useState<User>(dataManager.getCurrentUser());
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const [editData, setEditData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    website: user.website
  });

  // Load data on component mount
  useEffect(() => {
    setUser(dataManager.getCurrentUser());
    setUserPosts(dataManager.getPosts().filter(post => post.user.id === dataManager.getCurrentUser().id));
  }, []);



  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'reels':
        return userPosts.filter(post => post.isReel);
      case 'saved':
        return userPosts.slice(0, 3); // Mock saved posts
      default:
        return userPosts.filter(post => !post.isReel);
    }
  };

  const filteredPosts = getFilteredPosts();

  // Editing functions
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user.name,
      username: user.username,
      bio: user.bio,
      website: user.website
    });
  };

  const handleSave = () => {
    dataManager.updateUser(editData);
    setUser(dataManager.getCurrentUser());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      username: user.username,
      bio: user.bio,
      website: user.website
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dataManager.updateUser({ avatar: e.target?.result as string });
        setUser(dataManager.getCurrentUser());
      };
      reader.readAsDataURL(file);
    }
  };

  const openUploadDialog = (type: 'post' | 'reel' | 'story') => {
    setUploadType(type);
    setShowUploadDialog(true);
  };

  const handleUploadComplete = () => {
    setUserPosts(dataManager.getPosts().filter(post => post.user.id === dataManager.getCurrentUser().id));
  };

  return (
    <div className="min-h-screen bg-white mobile-content safe-area-top">
      {/* Header - Instagram Style */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-semibold text-black">{user.username}</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 p-0"
              onClick={handleEdit}
            >
              <Edit3 className="w-5 h-5 text-black" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 p-0"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5 text-black" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 p-0"
              onClick={() => navigate('/settings')}
            >
              <MoreHorizontal className="w-5 h-5 text-black" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mobile-container">
        {/* Profile Info */}
        <div className="py-6 space-y-6 animate-fade-in">
          {/* Avatar and Stats - Instagram Style */}
          <div className="flex items-start gap-6 px-4">
            <div className="relative group">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {/* Avatar upload overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                   onClick={() => avatarInputRef.current?.click()}>
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-black">{user.posts}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div>
                <div className="text-xl font-bold text-black">{user.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-black">{user.following}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
            </div>
          </div>

          {/* Name and Bio - Instagram Style */}
          <div className="space-y-3 px-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                    className="text-lg font-semibold"
                  />
                  <Input
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Username"
                    className="text-sm text-gray-600"
                  />
                </div>
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Bio"
                  className="min-h-[80px] resize-none"
                />
                <Input
                  value={editData.website}
                  onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Website"
                  className="text-blue-500"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1 bg-blue-500 text-white hover:bg-blue-600">
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-black">{user.name}</h2>
                <p className="text-gray-600 whitespace-pre-line">{user.bio}</p>
                {user.website && (
                  <a href={`https://${user.website}`} className="text-blue-500 hover:underline">
                    {user.website}
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons - Instagram Style */}
            {!isEditing && (
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gray-100 text-black hover:bg-gray-200 font-semibold rounded-lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" className="flex-1 font-semibold rounded-lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['Travel', 'Food', 'Art', 'Nature'].map((highlight) => (
              <div key={highlight} className="flex flex-col items-center gap-2 min-w-0">
                <div className="w-16 h-16 rounded-full bg-gradient-soft flex items-center justify-center">
                  <span className="text-2xl">
                    {highlight === 'Travel' && '✈️'}
                    {highlight === 'Food' && '🍕'}
                    {highlight === 'Art' && '🎨'}
                    {highlight === 'Nature' && '🌿'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground text-center w-16 truncate">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs - Instagram Style */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={cn(
                "flex-1 flex items-center justify-center py-4 transition-smooth",
                activeTab === 'posts' 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-600"
              )}
            >
              <Grid3X3 className="w-5 h-5 mr-2" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={cn(
                "flex-1 flex items-center justify-center py-4 transition-smooth",
                activeTab === 'reels' 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-600"
              )}
            >
              <Play className="w-5 h-5 mr-2" />
              Reels
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={cn(
                "flex-1 flex items-center justify-center py-4 transition-smooth",
                activeTab === 'saved' 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-600"
              )}
            >
              <Bookmark className="w-5 h-5 mr-2" />
              Saved
            </button>
          </div>
          
          {/* Upload Button */}
          <div className="flex justify-center py-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => openUploadDialog('post')}
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post
              </Button>
              <Button 
                onClick={() => openUploadDialog('reel')}
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Reel
              </Button>
              <Button 
                onClick={() => openUploadDialog('story')}
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Story
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="py-4">
          {filteredPosts.length > 0 ? (
            <div className="mobile-grid">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square group cursor-pointer animate-fade-in"
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover rounded-lg transition-smooth group-hover:scale-105"
                  />
                  
                  {/* Reel indicator */}
                  {post.isReel && (
                    <div className="absolute top-2 right-2">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'posts' && <Grid3X3 className="w-8 h-8 text-muted-foreground" />}
                {activeTab === 'reels' && <Play className="w-8 h-8 text-muted-foreground" />}
                {activeTab === 'saved' && <Bookmark className="w-8 h-8 text-muted-foreground" />}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {activeTab === 'posts' && 'No Posts Yet'}
                {activeTab === 'reels' && 'No Reels Yet'}
                {activeTab === 'saved' && 'No Saved Posts'}
              </h3>
              <p className="text-muted-foreground">
                {activeTab === 'posts' && 'Share your first post to get started!'}
                {activeTab === 'reels' && 'Create your first reel to get started!'}
                {activeTab === 'saved' && 'Save posts you love to see them here'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        type={uploadType}
      />
    </div>
  );
};

export default Profile;