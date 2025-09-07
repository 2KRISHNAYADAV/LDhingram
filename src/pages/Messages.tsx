import { useState } from "react";
import { ArrowLeft, Phone, Video, Info, Search, Send, Heart, Camera, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/new-logo.png";
import MessageBubble from "@/components/MessageBubble";
import RealTimeChat from "@/components/chat/RealTimeChat";
import { dataManager, Chat, Message } from "@/lib/data";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useState(() => {
    setChats(dataManager.getChats());
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      dataManager.sendMessage(selectedChat, newMessage);
      setNewMessage("");
      setChats([...dataManager.getChats()]);
    }
  };

  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b976?w=150&h=150&fit=crop&crop=face",
      lastMessage: "That sunset photo is amazing! 📸",
      time: "2m",
      unread: 2
    },
    {
      id: 2,
      name: "Mike Johnson",
      username: "@mikej",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Thanks for the follow! 🙌",
      time: "1h",
      unread: 0
    },
    {
      id: 3,
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Love your mountain photos! 🏔️",
      time: "3h",
      unread: 1
    }
  ];

  const selectedConversation = conversations.find(chat => chat.id === selectedChat);

  return (
    <div className="min-h-screen bg-white">
      {/* Use the new real-time chat component */}
      <RealTimeChat />
    </div>
  );
};

export default Messages;