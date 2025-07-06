
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { GeminiService } from '@/services/geminiService';
import { NutritionData, FoodEntry } from '@/types/nutrition';

export const useFoodAnalysis = (onFoodLogged: (entry: FoodEntry) => void) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<NutritionData | null>(null);

  const analyzeWithGemini = async (description: string, imageFile: File | undefined, apiKey: string): Promise<NutritionData> => {
    if (!apiKey.trim()) {
      throw new Error('Please enter your Gemini API key');
    }

    const geminiService = new GeminiService(apiKey);
    
    if (imageFile) {
      return await geminiService.analyzeImage(imageFile);
    } else {
      return await geminiService.analyzeFood(description);
    }
  };

  const handleAnalyze = async (foodText: string, selectedImage: File | null, geminiApiKey: string, customTimestamp?: Date) => {
    if (!foodText.trim() && !selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const nutrition = await analyzeWithGemini(foodText, selectedImage || undefined, geminiApiKey);
      setLastAnalysis(nutrition);
      
      const entry: FoodEntry = {
        id: Date.now().toString(),
        text: selectedImage ? `[Image] ${foodText || 'Food from image'}` : foodText,
        nutrition,
        timestamp: customTimestamp || new Date()
      };
      
      onFoodLogged(entry);
      
      toast({
        title: "Food Analyzed Successfully!",
        description: `${nutrition.calories} calories analyzed with AI and saved for ${entry.timestamp.toLocaleString()}.`,
      });

      return { success: true };
    } catch (error) {
      console.error('Food analysis error:', error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze food. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    lastAnalysis,
    handleAnalyze
  };
};
