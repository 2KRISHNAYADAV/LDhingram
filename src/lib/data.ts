// Real-time data management for LDhingram
export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  website?: string;
  posts: number;
  followers: number;
  following: number;
  isVerified: boolean;
  isFollowing?: boolean;
}

export interface Post {
  id: number;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked?: boolean;
  isSaved?: boolean;
  type: 'post' | 'reel';
  isReel?: boolean; // For backward compatibility
}

export interface Story {
  id: number;
  user: User;
  media: {
    type: 'image' | 'video';
    url: string;
    duration?: number;
  };
  timestamp: string;
  isViewed: boolean;
}

export interface Message {
  id: number;
  sender: User;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: number;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// Mock data with real functionality
export const mockUsers: User[] = [
  {
    id: 1,
    name: "LDhingram Official",
    username: "@ldhingram",
    avatar: "/src/assets/new-logo.png",
    bio: "Welcome to LDhingram! 🌟 Share your moments, connect with friends, and discover amazing content.",
    website: "ldhingram.com",
    posts: 127,
    followers: 12500,
    following: 892,
    isVerified: true,
    isFollowing: false
  },
  {
    id: 4,
    name: "Priya Sharma",
    username: "@priyasharma",
    avatar: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=150&h=150&fit=crop&crop=face",
    bio: "Bollywood dancer 💃 | Mumbai | Spreading joy through dance ✨",
    posts: 234,
    followers: 45600,
    following: 1200,
    isVerified: true,
    isFollowing: false
  },
  {
    id: 5,
    name: "Arjun Patel",
    username: "@arjunpatel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Tech entrepreneur 🚀 | Bangalore | Building the future 💡",
    posts: 189,
    followers: 23400,
    following: 567,
    isVerified: true,
    isFollowing: true
  },
  {
    id: 6,
    name: "Kavya Reddy",
    username: "@kavyareddy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Food blogger 🍛 | Hyderabad | Authentic Indian recipes 👩‍🍳",
    posts: 156,
    followers: 18900,
    following: 890,
    isVerified: false,
    isFollowing: false
  },
  {
    id: 7,
    name: "Rohit Singh",
    username: "@rohitsingh",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Cricket enthusiast 🏏 | Delhi | MS Dhoni fan forever 💙",
    posts: 298,
    followers: 67800,
    following: 234,
    isVerified: true,
    isFollowing: true
  },
  {
    id: 8,
    name: "Ananya Gupta",
    username: "@ananyagupta",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Fashion influencer 👗 | Kolkata | Sustainable fashion advocate 🌱",
    posts: 445,
    followers: 89200,
    following: 1890,
    isVerified: true,
    isFollowing: false
  }
  {
    id: 2,
    name: "Sarah Chen",
    username: "@sarahc",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b976?w=150&h=150&fit=crop&crop=face",
    bio: "Digital creator & photographer 📸\nLiving life one adventure at a time 🌍",
    posts: 89,
    followers: 3400,
    following: 456,
    isVerified: false,
    isFollowing: true
  },
  {
    id: 3,
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Coffee lover ☕️ | Developer 💻 | Adventure seeker 🏔️",
    posts: 156,
    followers: 2100,
    following: 789,
    isVerified: false,
    isFollowing: false
  }
];

export const mockPosts: Post[] = [
  {
    id: 1,
    user: mockUsers[0],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
    caption: "Welcome to LDhingram! 🌟 Share your moments, connect with friends, and discover amazing content. Tag us in your posts! #LDhingram #Community",
    likes: 15420,
    comments: 892,
    timeAgo: "1d",
    isLiked: false,
    isSaved: false,
    type: 'post'
  },
  {
    id: 2,
    user: mockUsers[1],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    caption: "Golden hour magic ✨ Nothing beats a perfect sunset at the beach 🌅 #goldenhour #beachvibes",
    likes: 2847,
    comments: 156,
    timeAgo: "2h",
    isLiked: true,
    isSaved: false,
    type: 'post'
  },
  {
    id: 3,
    user: mockUsers[2],
    image: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=400&fit=crop",
    caption: "Perfect coffee morning ☕️ Fuel for creativity and good vibes. What's your go-to morning ritual? #coffeelover #morningvibes",
    likes: 1203,
    comments: 87,
    timeAgo: "4h",
    isLiked: false,
    isSaved: true,
    type: 'reel'
  }
];

export const mockStories: Story[] = [
  {
    id: 1,
    user: mockUsers[0],
    media: {
      type: 'video',
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 8
    },
    timestamp: "2h",
    isViewed: false
  },
  {
    id: 2,
    user: mockUsers[1],
    media: {
      type: 'image',
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
    },
    timestamp: "4h",
    isViewed: true
  }
];

export const mockChats: Chat[] = [
  {
    id: 1,
    user: mockUsers[1],
    lastMessage: {
      id: 1,
      sender: mockUsers[1],
      content: "Hey! How are you doing?",
      timestamp: "2m",
      isRead: false
    },
    unreadCount: 2
  },
  {
    id: 2,
    user: mockUsers[2],
    lastMessage: {
      id: 2,
      sender: mockUsers[2],
      content: "Thanks for the follow! 🙌",
      timestamp: "1h",
      isRead: true
    },
    unreadCount: 0
  }
];

// Data management functions
export class DataManager {
  private static instance: DataManager;
  private posts: Post[] = [...mockPosts];
  private stories: Story[] = [...mockStories];
  private chats: Chat[] = [...mockChats];
  private currentUser: User = mockUsers[0];

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Posts
  getPosts(): Post[] {
    return this.posts;
  }

  addPost(post: Omit<Post, 'id'>): Post {
    const newPost: Post = {
      ...post,
      id: Date.now(),
      likes: 0,
      comments: 0,
      timeAgo: 'now',
      isLiked: false,
      isSaved: false
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  likePost(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
  }

  savePost(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isSaved = !post.isSaved;
    }
  }

  // Stories
  getStories(): Story[] {
    return this.stories;
  }

  addStory(story: Omit<Story, 'id'>): Story {
    const newStory: Story = {
      ...story,
      id: Date.now(),
      timestamp: 'now',
      isViewed: false
    };
    this.stories.unshift(newStory);
    return newStory;
  }

  markStoryAsViewed(storyId: number): void {
    const story = this.stories.find(s => s.id === storyId);
    if (story) {
      story.isViewed = true;
    }
  }

  // Messages
  getChats(): Chat[] {
    return this.chats;
  }

  sendMessage(chatId: number, content: string): void {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      const newMessage: Message = {
        id: Date.now(),
        sender: this.currentUser,
        content,
        timestamp: 'now',
        isRead: false
      };
      chat.lastMessage = newMessage;
      chat.unreadCount = 0;
    }
  }

  // User management
  getCurrentUser(): User {
    return this.currentUser;
  }

  updateUser(updates: Partial<Omit<User, 'id'>>): void {
    this.currentUser = { ...this.currentUser, ...updates };
  }

  followUser(userId: number): void {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isFollowing = !user.isFollowing;
      user.followers += user.isFollowing ? 1 : -1;
    }
  }

  // Search
  searchUsers(query: string): User[] {
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchPosts(query: string): Post[] {
    return this.posts.filter(post =>
      post.caption.toLowerCase().includes(query.toLowerCase()) ||
      post.user.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const dataManager = DataManager.getInstance();
