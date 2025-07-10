
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

    console.log('Starting Gemini analysis...', { description: description.substring(0, 50), hasImage: !!imageFile });
    const geminiService = new GeminiService(apiKey);
    
    try {
      if (imageFile) {
        console.log('Analyzing image with Gemini...');
        return await geminiService.analyzeImage(imageFile);
      } else {
        console.log('Analyzing text with Gemini...');
        return await geminiService.analyzeFood(description);
      }
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('overloaded')) {
          throw new Error('Gemini AI is currently overloaded. Please wait a moment and try again.');
        } else if (error.message.includes('API key')) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
        }
      }
      
      throw error;
    }
  };

  const handleAnalyze = async (foodText: string, selectedImage: File | null, geminiApiKey: string, customTimestamp?: Date) => {
    if (!foodText.trim() && !selectedImage) {
      toast({
        title: "Input Required",
        description: "Please enter a food description or select an image.",
        variant: "destructive"
      });
      return { success: false };
    }
    
    if (!geminiApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first.",
        variant: "destructive"
      });
      return { success: false };
    }
    
    setIsAnalyzing(true);
    console.log('handleAnalyze called:', { foodText: foodText.substring(0, 50), hasImage: !!selectedImage });
    
    try {
      const nutrition = await analyzeWithGemini(foodText, selectedImage || undefined, geminiApiKey);
      console.log('Analysis successful:', nutrition);
      setLastAnalysis(nutrition);
      
      const entry: FoodEntry = {
        id: Date.now().toString(),
        text: selectedImage ? `[Image] ${foodText || 'Food from image'}` : foodText,
        nutrition,
        timestamp: customTimestamp || new Date()
      };
      
      console.log('Logging food entry:', entry);
      onFoodLogged(entry);
      
      toast({
        title: "Food Analyzed Successfully!",
        description: `${nutrition.calories} calories analyzed with AI and saved for ${entry.timestamp.toLocaleString()}.`,
      });

      return { success: true };
    } catch (error) {
      console.error('Food analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze food. Please try again.";
      
      toast({
        title: "Analysis Error",
        description: errorMessage,
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
