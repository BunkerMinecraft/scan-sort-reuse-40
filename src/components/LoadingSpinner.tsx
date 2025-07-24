import { Card } from '@/components/ui/card';
import { Loader2Icon, ScanIcon } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Analyzing image..." }: LoadingSpinnerProps) => {
  return (
    <Card className="p-8 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <ScanIcon className="w-12 h-12 text-primary animate-pulse" />
          <Loader2Icon className="w-6 h-6 text-primary-glow animate-spin absolute -top-1 -right-1" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold">Processing Image</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        
        {/* Progress animation */}
        <div className="w-full bg-secondary rounded-full h-2">
          <div className="bg-gradient-eco h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </Card>
  );
};