import { cn } from "@/lib/utils";
import { Message } from "@/lib/data";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={cn(
      "flex mb-4",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] px-4 py-2 rounded-2xl",
        isOwn 
          ? "bg-gradient-primary text-white" 
          : "bg-muted text-foreground"
      )}>
        <p className="text-sm">{message.content}</p>
        <p className={cn(
          "text-xs mt-1",
          isOwn ? "text-white/70" : "text-muted-foreground"
        )}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
