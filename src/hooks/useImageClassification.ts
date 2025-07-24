import { useState, useCallback } from 'react';
import { ClassificationData } from '@/components/ClassificationResult';

// Mock classification service - In production, this would use ML models
const classifyImage = async (imageData: string): Promise<ClassificationData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock classification results - in reality this would use Hugging Face transformers
  const categories: ClassificationData['category'][] = ['recyclable', 'reusable', 'trash'];
  const materials = ['Plastic (PET)', 'Glass', 'Aluminum', 'Paper', 'Cardboard', 'Electronics', 'Organic waste'];
  
  const mockResults: Record<string, ClassificationData> = {
    recyclable: {
      category: 'recyclable',
      confidence: 0.87,
      material: materials[Math.floor(Math.random() * 4)], // First 4 are recyclable
      recommendations: [
        'Clean the item before recycling',
        'Remove any labels or caps',
        'Check local recycling guidelines',
        'Place in appropriate recycling bin'
      ]
    },
    reusable: {
      category: 'reusable',
      confidence: 0.79,
      material: 'Textile/Fabric',
      recommendations: [
        'Consider donating if in good condition',
        'Repurpose for cleaning rags',
        'Use for craft projects',
        'Check local reuse centers'
      ]
    },
    trash: {
      category: 'trash',
      confidence: 0.92,
      material: materials[Math.floor(Math.random() * materials.length)],
      recommendations: [
        'Dispose in general waste bin',
        'Consider if item can be repaired first',
        'Look for specialized disposal programs',
        'Minimize similar purchases in future'
      ]
    }
  };
  
  // Randomly select a category for demo
  const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  return mockResults[selectedCategory];
};

export const useImageClassification = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyImageData = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    try {
      const classification = await classifyImage(imageData);
      setResult(classification);
    } catch (err) {
      setError('Failed to classify image. Please try again.');
      console.error('Classification error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const resetClassification = useCallback(() => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    classifyImageData,
    isProcessing,
    result,
    error,
    resetClassification
  };
};