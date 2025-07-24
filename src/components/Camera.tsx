import { useState, useRef, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CameraIcon, RotateCcwIcon, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraComponentProps {
  onImageCapture: (imageData: string) => void;
  isProcessing: boolean;
}

export const CameraComponent = ({ onImageCapture, isProcessing }: CameraComponentProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        setImagePreview(image.dataUrl);
        onImageCapture(image.dataUrl);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const selectFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (image.dataUrl) {
        setImagePreview(image.dataUrl);
        onImageCapture(image.dataUrl);
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      // Fallback to file input for web
      fileInputRef.current?.click();
    }
  };

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onImageCapture(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageCapture]);

  const retakePicture = () => {
    setImagePreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {imagePreview ? (
        <Card className="p-4 space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={imagePreview}
              alt="Captured item"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="outline"
            onClick={retakePicture}
            disabled={isProcessing}
            className="w-full"
          >
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        </Card>
      ) : (
        <Card className="p-8">
          <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-gradient-subtle flex items-center justify-center mb-6">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Capture or select an image to classify
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={takePicture}
              disabled={isProcessing}
              className="w-full bg-gradient-eco shadow-soft hover:shadow-glow transition-all duration-300"
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            
            <Button
              variant="outline"
              onClick={selectFromGallery}
              disabled={isProcessing}
              className="w-full"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose from Gallery
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};