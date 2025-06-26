
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
}

const ImageUpload = ({ selectedImage, onImageSelect }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
        toast({
          title: "Image Selected",
          description: "Image ready for AI analysis.",
        });
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Scan Food Image (optional):
      </label>
      <div className="flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
        >
          <Camera className="h-4 w-4 mr-2" />
          Select
        </Button>
      </div>
      {selectedImage && (
        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              {selectedImage.name} selected for analysis
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
