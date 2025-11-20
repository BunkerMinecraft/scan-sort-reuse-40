import { useState, useCallback } from 'react';
import { ClassificationData } from '@/components/ClassificationResult';
import * as tf from '@tensorflow/tfjs';

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

const TEACHABLE_MACHINE_URL = 'https://teachablemachine.withgoogle.com/models/oHMM__QNy/';

const classifyImage = async (imageData: string): Promise<ClassificationData> => {
  try {
    // Load the Teachable Machine model
    const model = await tf.loadLayersModel(TEACHABLE_MACHINE_URL + 'model.json');
    
    // Load metadata to get class names
    const metadataResponse = await fetch(TEACHABLE_MACHINE_URL + 'metadata.json');
    const metadata = await metadataResponse.json();
    const classLabels = metadata.labels;

    // Create an image element from the base64 data
    const img = new Image();
    img.src = imageData;
    await new Promise((resolve) => { img.onload = resolve; });

    // Preprocess the image for the model
    const tensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224]) // Teachable Machine uses 224x224
      .toFloat()
      .div(255.0) // Normalize to [0, 1]
      .expandDims(0); // Add batch dimension

    // Run inference
    const predictions = await model.predict(tensor) as tf.Tensor;
    const predictionData = await predictions.data();
    
    // Find the class with highest confidence
    let maxConfidence = 0;
    let predictedClassIndex = 0;
    for (let i = 0; i < predictionData.length; i++) {
      if (predictionData[i] > maxConfidence) {
        maxConfidence = predictionData[i];
        predictedClassIndex = i;
      }
    }

    const predictedLabel = classLabels[predictedClassIndex];
    const confidence = maxConfidence;

    // Clean up tensors
    tensor.dispose();
    predictions.dispose();

    console.log('Teachable Machine Response:', { predictedLabel, confidence });

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