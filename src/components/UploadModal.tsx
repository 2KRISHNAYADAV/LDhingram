import { useState, useRef } from "react";
import { X, Upload, Image, Video, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dataManager } from "@/lib/data";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'reel' | 'story';
}

const UploadModal = ({ isOpen, onClose, type }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to data manager
    const currentUser = dataManager.getCurrentUser();
    
    if (type === 'story') {
      dataManager.addStory({
        user: currentUser,
        media: {
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: preview!,
          duration: file.type.startsWith('video/') ? 10 : undefined
        },
        timestamp: 'now',
        isViewed: false
      });
    } else {
      dataManager.addPost({
        user: currentUser,
        image: preview!,
        caption,
        likes: 0,
        comments: 0,
        timeAgo: 'now',
        isLiked: false,
        isSaved: false,
        type: type as 'post' | 'reel'
      });
    }

    setIsUploading(false);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    onClose();
  };

  const getAcceptTypes = () => {
    switch (type) {
      case 'post':
        return 'image/*';
      case 'reel':
        return 'video/*';
      case 'story':
        return 'image/*,video/*';
      default:
        return '*/*';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'post':
        return <Image className="w-6 h-6" />;
      case 'reel':
        return <Video className="w-6 h-6" />;
      case 'story':
        return <Camera className="w-6 h-6" />;
      default:
        return <Upload className="w-6 h-6" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            Upload {type === 'post' ? 'Post' : type === 'reel' ? 'Reel' : 'Story'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!file ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {type === 'post' && 'PNG, JPG or GIF (MAX. 10MB)'}
                    {type === 'reel' && 'MP4, MOV or AVI (MAX. 100MB)'}
                    {type === 'story' && 'PNG, JPG, MP4 (MAX. 10MB)'}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept={getAcceptTypes()}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative">
                {file.type.startsWith('video/') ? (
                  <video
                    src={preview!}
                    className="w-full h-48 object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <img
                    src={preview!}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Caption */}
              {(type === 'post' || type === 'reel') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption</label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  `Upload ${type === 'post' ? 'Post' : type === 'reel' ? 'Reel' : 'Story'}`
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
