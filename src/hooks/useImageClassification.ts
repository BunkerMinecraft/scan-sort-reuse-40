import { useState, useCallback } from 'react';
import { ClassificationData } from '@/components/ClassificationResult';
import { Client } from '@gradio/client';

// Map API material types to our categories and recommendations
const mapMaterialToCategory = (material: string, confidence: number): ClassificationData => {
  const materialLower = material.toLowerCase();
  
  const recommendationsByMaterial: Record<string, string[]> = {
    battery: [
      'Take to designated battery recycling points',
      'Never dispose in regular trash',
      'Check local e-waste collection centers',
      'Keep batteries dry and stored safely'
    ],
    glass: [
      'Rinse and clean before recycling',
      'Remove caps and lids',
      'Check if your area accepts glass recycling',
      'Separate by color if required'
    ],
    metal: [
      'Clean and dry the metal item',
      'Remove any non-metal attachments',
      'Aluminum and steel are highly recyclable',
      'Place in metal recycling bin'
    ],
    organic: [
      'Compost if possible',
      'Use for garden mulch',
      'Check local organic waste programs',
      'Keep separate from other waste'
    ],
    paper: [
      'Keep paper dry and clean',
      'Remove any plastic attachments',
      'Flatten boxes and cardboard',
      'Place in paper recycling bin'
    ],
    plastic: [
      'Check the recycling number on the item',
      'Rinse and clean before recycling',
      'Remove caps and labels if possible',
      'Verify local plastic recycling guidelines'
    ]
  };

  // Determine category based on material type
  let category: ClassificationData['category'];
  if (['battery', 'glass', 'metal', 'paper', 'plastic'].includes(materialLower)) {
    category = 'recyclable';
  } else if (materialLower === 'organic') {
    category = 'reusable';
  } else {
    category = 'trash';
  }

  return {
    category,
    confidence,
    material: material.charAt(0).toUpperCase() + material.slice(1),
    recommendations: recommendationsByMaterial[materialLower] || [
      'Dispose according to local guidelines',
      'Consider if item can be repurposed',
      'Check with local waste management',
      'Minimize similar purchases in future'
    ]
  };
};

// Convert base64 data URL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const classifyImage = async (imageData: string): Promise<ClassificationData> => {
  try {
    // Convert base64 image to Blob
    const imageBlob = dataURLtoBlob(imageData);

    // Connect to Hugging Face Space
    const client = await Client.connect("BunkerMinecraft/NeuRecAI");

    // Send prediction request
    const result = await client.predict("/predict", {
      image: imageBlob
    });

    console.log('API Response:', result);

    // Extract class and confidence from response
    const data = result.data as any;
    const predictedLabel = data?.label || data?.[0]?.label;
    const confidence = data?.confidence || data?.[0]?.confidence || data?.[1];

    // Safety check for unsafe or unrelated content
    if (!predictedLabel) {
      throw new Error('⚠️ For safety, please upload a recyclable material image only.');
    }

    return mapMaterialToCategory(predictedLabel, confidence);
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
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
      return classification;
    } catch (err) {
      setError('Failed to classify image. Please try again.');
      console.error('Classification error:', err);
      return null;
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