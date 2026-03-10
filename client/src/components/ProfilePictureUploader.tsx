import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';
import { Api } from '@/api/api';
import { BACKEND_URL as apiUrl } from '@/lib/constants';

interface ProfilePictureUploaderProps {
  userId: string;
  currentPictureId?: string;
  userName?: string;
  onUploadSuccess?: (pictureId: string) => void;
  className?: string;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  userId,
  currentPictureId,
  userName = 'User',
  onUploadSuccess,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const api = Api.getInstance(); 

  // Construct image URL for display
  const getImageUrl = (pictureId: string) => {
    return `${apiUrl}/uploads/image/${pictureId}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Create temporary preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setTempPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post(`user/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to upload profile picture');
      }

      setTempPreview(null);

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!'
      });

      // Call the success callback with new pictureId
      if (onUploadSuccess && data.data?.pictureId) {
        onUploadSuccess(data.data.pictureId);
      }
    } catch (error) {
      // Reset preview on error
      setTempPreview(null);

      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload profile picture',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const displayPictureId = tempPreview ? null : currentPictureId;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative group">
        <img
          src={getImageUrl(currentPictureId) || `http://ui-avatars.com/api/?name=${userName.split(' ')[0]}+${userName.split(' ')[1]}`}
          alt={userName}
          className="h-32 w-32 rounded-full object-cover"
        />

        {/* Overlay button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50"
          title="Upload profile picture"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Upload className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isLoading}
      />

      {/* Upload button (alternative) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Change Picture
          </>
        )}
      </Button>

      {tempPreview && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
