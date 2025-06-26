
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Utensils, Brain, CheckCircle, Info, Camera, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GeminiService } from '@/services/geminiService';

interface IngredientBreakdown {
  ingredient: string;
  amount: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  foods: string[];
  breakdown?: IngredientBreakdown[];
}

interface FoodEntry {
  id: string;
  text: string;
  nutrition: NutritionData;
  timestamp: Date;
}

const FoodTracker = ({ onFoodLogged }: { onFoodLogged: (entry: FoodEntry) => void }) => {
  const [foodText, setFoodText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<NutritionData | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        toast({
          title: "Image Selected",
          description: "Image ready for AI analysis.",
        });
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Utensils className="h-5 w-5" />
          AI-Powered Food Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Gemini API Key (required for accurate analysis):
          </label>
          <Input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="Enter your Gemini Pro API key"
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Get your API key from Google AI Studio. Your key is stored locally and not sent anywhere except Google's API.
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Scan Food Image (optional):
          </label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <Camera className="h-4 w-4 mr-2" />
              Select
            </Button>
          </div>
          {selectedImage && (
            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {selectedImage.name} selected for analysis
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Describe your food {selectedImage ? '(optional - will be combined with image)' : ''}:
          </label>
          <Textarea
            value={foodText}
            onChange={(e) => setFoodText(e.target.value)}
            placeholder="e.g., 'I had 150g grilled chicken breast with 200g steamed broccoli and 100g brown rice for lunch'"
            className="min-h-[80px] resize-none"
            disabled={isAnalyzing}
          />
        </div>
        
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
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-700">AI Analysis Results:</h4>
              {lastAnalysis.breakdown && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-xs"
                >
                  <Info className="h-3 w-3 mr-1" />
                  {showBreakdown ? 'Hide' : 'Show'} Breakdown
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{lastAnalysis.calories}</div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lastAnalysis.carbs}g</div>
                <div className="text-xs text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{lastAnalysis.protein}g</div>
                <div className="text-xs text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{lastAnalysis.fat}g</div>
                <div className="text-xs text-gray-600">Fat</div>
              </div>
            </div>

            {showBreakdown && lastAnalysis.breakdown && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-sm text-gray-700 mb-2">AI Ingredient Breakdown:</h5>
                <div className="space-y-2">
                  {lastAnalysis.breakdown.map((item, index) => (
                    <div key={index} className="text-xs bg-white p-2 rounded border">
                      <div className="font-medium text-gray-800 capitalize">
                        {item.amount} {item.ingredient}
                      </div>
                      <div className="flex justify-between mt-1 text-gray-600">
                        <span>{item.calories} cal</span>
                        <span>{item.carbs}g carbs</span>
                        <span>{item.protein}g protein</span>
                        <span>{item.fat}g fat</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Detected Foods:</div>
              <div className="flex flex-wrap gap-1">
                {lastAnalysis.foods.map((food, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodTracker;
