import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CameraComponent } from '@/components/Camera';
import { ClassificationResult } from '@/components/ClassificationResult';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useImageClassification } from '@/hooks/useImageClassification';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanIcon, InfoIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Analysis = () => {
  const { user } = useAuth();
  const { classifyImageData, isProcessing, result, error, resetClassification } = useImageClassification();

  const handleImageCapture = async (imageData: string) => {
    const result = await classifyImageData(imageData);
    
    // Save to database if user is logged in and classification was successful
    if (user && result) {
      try {
        await supabase.from('image_analyses').insert({
          user_id: user.id,
          image_url: imageData,
          category: result.category,
          confidence: result.confidence,
          material: result.material,
          recommendations: result.recommendations.join(', '),
        });
      } catch (error) {
        console.error('Error saving analysis:', error);
      }
    }
  };

  const handleNewScan = () => {
    resetClassification();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Image Analysis</h1>
            <p className="text-muted-foreground">
              Upload or capture an image to classify waste items
            </p>
          </div>

          {!user && (
            <Alert className="border-primary/30 bg-primary/5">
              <InfoIcon className="h-4 w-4 text-primary" />
              <AlertDescription className="text-muted-foreground">
                You're using guest mode. Results won't be saved.{' '}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>{' '}
                to track your progress!
              </AlertDescription>
            </Alert>
          )}

          {!result && !isProcessing && (
            <CameraComponent 
              onImageCapture={handleImageCapture}
              isProcessing={isProcessing}
            />
          )}

          {isProcessing && (
            <LoadingSpinner message="Analyzing your item..." />
          )}

          {result && (
            <div className="space-y-4">
              <ClassificationResult result={result} />
              <Button
                onClick={handleNewScan}
                variant="outline"
                className="w-full"
              >
                <ScanIcon className="w-4 h-4 mr-2" />
                Scan Another Item
              </Button>
            </div>
          )}

          {error && (
            <Card className="p-4 border-destructive/50 bg-destructive/5">
              <p className="text-destructive text-center">{error}</p>
              <Button
                onClick={handleNewScan}
                variant="outline"
                className="w-full mt-3"
              >
                Try Again
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
