import { useState } from 'react';
import { CameraComponent } from '@/components/Camera';
import { ClassificationResult } from '@/components/ClassificationResult';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useImageClassification } from '@/hooks/useImageClassification';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanIcon } from 'lucide-react';

const Analysis = () => {
  const { classifyImageData, isProcessing, result, error, resetClassification } = useImageClassification();

  const handleImageCapture = async (imageData: string) => {
    await classifyImageData(imageData);
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
