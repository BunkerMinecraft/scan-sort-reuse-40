import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecycleIcon, LeafIcon, TrashIcon, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ClassificationData {
  category: 'recyclable' | 'compostable' | 'trash';
  confidence: number;
  material?: string;
  recommendations: string[];
}

interface ClassificationResultProps {
  result: ClassificationData;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'recyclable':
      return <RecycleIcon className="w-5 h-5" />;
    case 'compostable':
      return <LeafIcon className="w-5 h-5" />;
    case 'trash':
      return <TrashIcon className="w-5 h-5" />;
    default:
      return <InfoIcon className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'recyclable':
      return 'bg-recyclable text-recyclable-foreground';
    case 'compostable':
      return 'bg-reusable text-reusable-foreground';
    case 'trash':
      return 'bg-trash text-trash-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'recyclable':
      return 'Recyclable';
    case 'compostable':
      return 'Compostable';
    case 'trash':
      return 'Trash';
    default:
      return 'Unknown';
  }
};

export const ClassificationResult = ({ result }: ClassificationResultProps) => {
  const { category, confidence, material, recommendations } = result;
  
  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="space-y-4">
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              getCategoryColor(category)
            )}>
              {getCategoryIcon(category)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {getCategoryTitle(category)}
              </h3>
            </div>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {Math.round(confidence * 100)}% confident
          </Badge>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500 ease-out",
                category === 'recyclable' && "bg-recyclable",
                category === 'compostable' && "bg-reusable",
                category === 'trash' && "bg-trash"
              )}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              Recommendations
            </h4>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground pl-2 border-l-2 border-primary/30">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};