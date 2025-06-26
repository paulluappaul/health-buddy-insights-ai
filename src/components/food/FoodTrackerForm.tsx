
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GeminiService } from '@/services/geminiService';
import { NutritionData, FoodEntry } from '@/types/nutrition';
import ApiKeyInput from './ApiKeyInput';
import ImageUpload from './ImageUpload';
import FoodDescriptionInput from './FoodDescriptionInput';
import AnalysisResults from './AnalysisResults';

interface FoodTrackerFormProps {
  onFoodLogged: (entry: FoodEntry) => void;
}

const FoodTrackerForm = ({ onFoodLogged }: FoodTrackerFormProps) => {
  const [foodText, setFoodText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<NutritionData | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const analyzeWithGemini = async (description: string, imageFile?: File): Promise<NutritionData> => {
    if (!geminiApiKey.trim()) {
      throw new Error('Please enter your Gemini API key');
    }

    const geminiService = new GeminiService(geminiApiKey);
    
    if (imageFile) {
      return await geminiService.analyzeImage(imageFile);
    } else {
      return await geminiService.analyzeFood(description);
    }
  };

  const handleAnalyze = async () => {
    if (!foodText.trim() && !selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const nutrition = await analyzeWithGemini(foodText, selectedImage || undefined);
      setLastAnalysis(nutrition);
      
      const entry: FoodEntry = {
        id: Date.now().toString(),
        text: selectedImage ? `[Image] ${foodText || 'Food from image'}` : foodText,
        nutrition,
        timestamp: new Date()
      };
      
      onFoodLogged(entry);
      setFoodText('');
      setSelectedImage(null);
      
      toast({
        title: "Food Analyzed Successfully!",
        description: `${nutrition.calories} calories analyzed with AI and saved.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze food. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
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
        onClick={handleAnalyze} 
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
