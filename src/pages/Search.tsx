import { useState } from "react";
import { Search as SearchIcon, Grid3X3, Play, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');

  // Mock trending tags
  const trendingTags = [
    "#summer", "#travel", "#food", "#fashion", "#photography", 
    "#nature", "#workout", "#art", "#music", "#lifestyle"
  ];

  // Mock search results
  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      likes: 1240,
      comments: 89,
      isReel: false
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=300&h=300&fit=crop",
      likes: 856,
      comments: 67,
      isReel: true
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      likes: 2134,
      comments: 145,
      isReel: false
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1494790108755-2616c5e5e4a8?w=300&h=300&fit=crop",
      likes: 923,
      comments: 56,
      isReel: true
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
      likes: 1567,
      comments: 98,
      isReel: false
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
      likes: 734,
      comments: 43,
      isReel: true
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop",
      likes: 1089,
      comments: 72,
      isReel: false
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop",
      likes: 1345,
      comments: 88,
      isReel: true
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      likes: 2001,
      comments: 156,
      isReel: false
    }
  ];

  const filteredPosts = posts.filter(post => 
    activeTab === 'posts' ? !post.isReel : post.isReel
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-40 px-4 py-3">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Search
          </h1>
          
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users, hashtags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-none rounded-2xl focus:bg-muted transition-smooth"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4">
        {searchQuery ? (
          // Search Results
          <div className="space-y-6 py-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'posts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('posts')}
                className={cn(
                  "rounded-full font-medium transition-smooth",
                  activeTab === 'posts' && "bg-gradient-primary text-white shadow-soft"
                )}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Posts
              </Button>
              <Button
                variant={activeTab === 'reels' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('reels')}
                className={cn(
                  "rounded-full font-medium transition-smooth",
                  activeTab === 'reels' && "bg-gradient-primary text-white shadow-soft"
                )}
              >
                <Play className="w-4 h-4 mr-2" />
                Reels
              </Button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-1">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square group cursor-pointer animate-fade-in"
                >
                  <img
                    src={post.image}
                    alt="Search result"
                    className="w-full h-full object-cover rounded-lg transition-smooth group-hover:scale-105"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-white" />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SearchIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reel indicator */}
                  {post.isReel && (
                    <div className="absolute top-2 right-2">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Discover Content
          <div className="space-y-6 py-6">
            {/* Trending Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Trending Now</h2>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-4 py-2 rounded-full bg-gradient-soft text-white border-none cursor-pointer hover:shadow-soft transition-smooth"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Popular Posts Grid */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Popular Posts</h2>
              <div className="grid grid-cols-3 gap-1">
                {posts.slice(0, 9).map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square group cursor-pointer animate-fade-in"
                  >
                    <img
                      src={post.image}
                      alt="Popular post"
                      className="w-full h-full object-cover rounded-lg transition-smooth group-hover:scale-105"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth rounded-lg flex items-center justify-center">
                      <div className="flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-white" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <SearchIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reel indicator */}
                    {post.isReel && (
                      <div className="absolute top-2 right-2">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;