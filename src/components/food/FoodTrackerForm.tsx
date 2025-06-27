
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle } from 'lucide-react';
import { FoodEntry } from '@/types/nutrition';
import { useFoodAnalysis } from '@/hooks/useFoodAnalysis';
import ApiKeyInput from './ApiKeyInput';
import ImageUpload from './ImageUpload';
import FoodDescriptionInput from './FoodDescriptionInput';
import AnalysisResults from './AnalysisResults';

interface FoodTrackerFormProps {
  onFoodLogged: (entry: FoodEntry) => void;
}

const FoodTrackerForm = ({ onFoodLogged }: FoodTrackerFormProps) => {
  const [foodText, setFoodText] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const { isAnalyzing, lastAnalysis, handleAnalyze } = useFoodAnalysis(onFoodLogged);

  const onAnalyzeClick = async () => {
    const result = await handleAnalyze(foodText, selectedImage, geminiApiKey);
    if (result?.success) {
      setFoodText('');
      setSelectedImage(null);
    }
  };

  return (
    <div className="space-y-4">
      <ApiKeyInput 
        apiKey={geminiApiKey}
        onApiKeyChange={setGeminiApiKey}
      />

      <ImageUpload 
        selectedImage={selectedImage}
        onImageSelect={setSelectedImage}
      />

      <FoodDescriptionInput 
        foodText={foodText}
        onFoodTextChange={setFoodText}
        hasSelectedImage={!!selectedImage}
        isAnalyzing={isAnalyzing}
      />
      
      <Button 
        onClick={onAnalyzeClick} 
        disabled={(!foodText.trim() && !selectedImage) || !geminiApiKey.trim() || isAnalyzing}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isAnalyzing ? (
          <>
            <Brain className="h-4 w-4 mr-2 animate-pulse" />
            AI Analyzing with Gemini...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Analyze with AI {selectedImage ? '& Image' : ''}
          </>
        )}
      </Button>

      {lastAnalysis && (
        <AnalysisResults analysis={lastAnalysis} />
      )}
    </div>
  );
};

export default FoodTrackerForm;
