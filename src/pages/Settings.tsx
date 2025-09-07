import { useState } from "react";
import { ArrowLeft, User, Bell, Lock, Eye, Globe, HelpCircle, LogOut, Camera, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import logoImage from "@/assets/new-logo.png";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [storySharing, setStorySharing] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const settingsGroups = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Edit Profile", description: "Change your profile information" },
        { label: "Privacy Settings", description: "Control who can see your content" },
        { label: "Account Security", description: "Manage your account security" },
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { 
          label: "Push Notifications", 
          description: "Get notified about likes, comments, and messages",
          toggle: true,
          value: notifications,
          onChange: setNotifications
        },
        { label: "Email Notifications", description: "Receive updates via email" },
        { label: "SMS Notifications", description: "Get text message alerts" },
      ]
    },
    {
      title: "Privacy",
      icon: Lock,
      items: [
        { 
          label: "Private Account", 
          description: "Only approved followers can see your posts",
          toggle: true,
          value: privateAccount,
          onChange: setPrivateAccount
        },
        { 
          label: "Story Sharing", 
          description: "Allow others to share your stories",
          toggle: true,
          value: storySharing,
          onChange: setStorySharing
        },
        { 
          label: "Activity Status", 
          description: "Show when you're active",
          toggle: true,
          value: showActivity,
          onChange: setShowActivity
        },
      ]
    },
    {
      title: "Content",
      icon: Camera,
      items: [
        { label: "Archive Posts", description: "View your archived content" },
        { label: "Download Data", description: "Get a copy of your data" },
        { label: "Content Preferences", description: "Customize what you see" },
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      items: [
        { label: "Help Center", description: "Get help and support" },
        { label: "Report a Problem", description: "Let us know about issues" },
        { label: "Terms of Service", description: "Review our terms" },
        { label: "Privacy Policy", description: "Read our privacy policy" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
          <img src={logoImage} alt="Logo" className="w-8 h-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">John Doe</CardTitle>
                <CardDescription>@johndoe • 1.2K followers</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                About
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Theme Toggle */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <Card key={group.title} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <group.icon className="w-5 h-5" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.items.map((item, index) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.toggle ? (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    ) : (
                      <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                    )}
                  </div>
                  {index < group.items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Logout */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              className="w-full flex items-center gap-3"
              onClick={() => navigate('/login')}
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;