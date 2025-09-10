import { useState } from "react";
import { Heart, MessageCircle, UserPlus, AtSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: { 
        name: 'Sarah Chen', 
        username: '@sarahc', 
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b976?w=150&h=150&fit=crop&crop=face'
      },
      action: 'liked your post',
      time: '2m',
      isNew: true,
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      type: 'follow',
      user: { 
        name: 'Mike Johnson', 
        username: '@mikej', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'started following you',
      time: '5m',
      isNew: true,
      isFollowing: false
    },
    {
      id: 3,
      type: 'comment',
      user: { 
        name: 'Emma Wilson', 
        username: '@emmaw', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      action: 'commented on your post: "Amazing shot! 📸"',
      time: '1h',
      isNew: true,
      postImage: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      type: 'mention',
      user: { 
        name: 'Alex Rivera', 
        username: '@alexr', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      action: 'mentioned you in a comment',
      time: '2h',
      isNew: false,
      postImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: 5,
      type: 'like',
      user: { 
        name: 'Maya Patel', 
        username: '@mayap', 
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616c5e5e4a8?w=150&h=150&fit=crop&crop=face'
      },
      action: 'liked your reel',
      time: '3h',
      isNew: false,
      postImage: 'https://images.unsplash.com/photo-1494790108755-2616c5e5e4a8?w=100&h=100&fit=crop'
    },
    {
      id: 6,
      type: 'follow',
      user: { 
        name: 'James Wilson', 
        username: '@jamesw', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'started following you',
      time: '1d',
      isNew: false,
      isFollowing: true
    },
    {
      id: 7,
      type: 'comment',
      user: { 
        name: 'Lisa Chen', 
        username: '@lisac', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      action: 'commented on your post: "Love this! Where was this taken?"',
      time: '2d',
      isNew: false,
      postImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-ldh-crimson fill-ldh-crimson" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-primary" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-primary" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-primary" />;
      default:
        return <Heart className="w-5 h-5 text-primary" />;
    }
  };

  const filteredNotifications = activeTab === 'following' 
    ? notifications.filter(n => n.user.username === '@sarahc' || n.user.username === '@emmaw') // Mock following filter
    : notifications;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Notifications
          </h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "flex-1 py-4 px-6 text-sm font-medium transition-smooth",
              activeTab === 'all'
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={cn(
              "flex-1 py-4 px-6 text-sm font-medium transition-smooth",
              activeTab === 'following'
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Following
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-border">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-center gap-3 p-4 transition-smooth hover:bg-muted/50 animate-fade-in",
                notification.isNew && "bg-secondary/20"
              )}
            >
              {/* User Avatar with notification icon */}
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={notification.user.avatar} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                    {notification.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{notification.user.username}</span>{' '}
                  <span className="text-muted-foreground">{notification.action}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>

              {/* Action Button or Post Thumbnail */}
              <div className="flex-shrink-0">
                {notification.type === 'follow' ? (
                  <Button
                    size="sm"
                    variant={notification.isFollowing ? "outline" : "default"}
                    className={cn(
                      "text-xs font-medium transition-smooth",
                      !notification.isFollowing && "bg-gradient-primary text-white hover:opacity-90 shadow-soft"
                    )}
                  >
                    {notification.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                ) : notification.postImage ? (
                  <img
                    src={notification.postImage}
                    alt="Post thumbnail"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : null}
              </div>

              {/* New indicator */}
              {notification.isNew && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              {activeTab === 'following' 
                ? "No notifications from people you follow yet"
                : "You're all caught up! No new notifications"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;