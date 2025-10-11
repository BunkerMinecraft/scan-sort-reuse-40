import { useState } from 'react';
import { CameraComponent } from '@/components/Camera';
import { ClassificationResult } from '@/components/ClassificationResult';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useImageClassification } from '@/hooks/useImageClassification';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LeafIcon, ScanIcon, HomeIcon } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'scan'>('home');
  const { classifyImageData, isProcessing, result, error, resetClassification } = useImageClassification();

  const handleImageCapture = async (imageData: string) => {
    await classifyImageData(imageData);
  };

  const handleNewScan = () => {
    resetClassification();
    setCurrentView('scan');
  };

  const handleBackToHome = () => {
    resetClassification();
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex flex-col">
        {/* Header */}
        <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
          <div className="max-w-md mx-auto flex items-center justify-center gap-2">
            <LeafIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Neurec AI</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 shadow-soft">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <ScanIcon className="w-10 h-10 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Smart Waste Classification</h2>
                  <p className="text-muted-foreground">
                    Snap a photo to instantly identify if items are recyclable, reusable, or trash
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleNewScan}
                  className="w-full bg-gradient-eco shadow-soft hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  <ScanIcon className="w-5 h-5 mr-2" />
                  Start Scanning
                </Button>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-recyclable/20 rounded-full flex items-center justify-center">
                      <span className="w-3 h-3 bg-recyclable rounded-full"></span>
                    </div>
                    <span>Recyclable</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-reusable/20 rounded-full flex items-center justify-center">
                      <span className="w-3 h-3 bg-reusable rounded-full"></span>
                    </div>
                    <span>Reusable</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-trash/20 rounded-full flex items-center justify-center">
                      <span className="w-3 h-3 bg-trash rounded-full"></span>
                    </div>
                    <span>Trash</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="p-2"
          >
            <HomeIcon className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <LeafIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Neurec AI</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
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
              className="w-full max-w-md mx-auto block"
            >
              <ScanIcon className="w-4 h-4 mr-2" />
              Scan Another Item
            </Button>
          </div>
        )}

        {error && (
          <Card className="p-4 max-w-md mx-auto border-destructive/50 bg-destructive/5">
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
      </main>
    </div>
  );
};

export default Index;
