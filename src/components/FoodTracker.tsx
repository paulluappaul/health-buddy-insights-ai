
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Utensils, Brain, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  foods: string[];
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

  // Simulate AI food analysis
  const analyzeFood = async (text: string): Promise<NutritionData> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple AI simulation - in real app, this would call an AI service
    const foods = text.toLowerCase().match(/\b(?:chicken|beef|fish|eggs?|rice|bread|apple|banana|salad|pasta|pizza|burger|sandwich|soup|yogurt|milk|cheese|nuts|vegetables|broccoli|carrots|spinach|potatoes?|tomatoes?|avocado|salmon|tuna|turkey|pork|quinoa|oats|berries|orange|grapes)\b/g) || ['mixed meal'];
    
    const baseCalories = foods.length * 150 + Math.random() * 200;
    const calories = Math.round(baseCalories);
    const carbs = Math.round(calories * (0.4 + Math.random() * 0.2));
    const protein = Math.round(calories * (0.2 + Math.random() * 0.15));
    const fat = Math.round(calories * (0.15 + Math.random() * 0.1));
    
    return {
      calories,
      carbs: Math.round(carbs / 4), // Convert to grams
      protein: Math.round(protein / 4),
      fat: Math.round(fat / 9),
      foods: Array.from(new Set(foods))
    };
  };

  const handleAnalyze = async () => {
    if (!foodText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const nutrition = await analyzeFood(foodText);
      setLastAnalysis(nutrition);
      
      const entry: FoodEntry = {
        id: Date.now().toString(),
        text: foodText,
        nutrition,
        timestamp: new Date()
      };
      
      onFoodLogged(entry);
      setFoodText('');
      
      toast({
        title: "Food Logged Successfully!",
        description: `${nutrition.calories} calories analyzed and saved.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze food. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Utensils className="h-5 w-5" />
          Smart Food Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            What did you eat? Describe it naturally:
          </label>
          <Textarea
            value={foodText}
            onChange={(e) => setFoodText(e.target.value)}
            placeholder="e.g., 'I had grilled chicken breast with steamed broccoli and brown rice for lunch' or 'Breakfast: 2 scrambled eggs, whole wheat toast, and coffee with milk'"
            className="min-h-[100px] resize-none"
            disabled={isAnalyzing}
          />
        </div>
        
        <Button 
          onClick={handleAnalyze} 
          disabled={!foodText.trim() || isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isAnalyzing ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-pulse" />
              AI Analyzing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Analyze & Log Food
            </>
          )}
        </Button>

        {lastAnalysis && (
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-700 mb-3">Last Analysis Results:</h4>
            <div className="grid grid-cols-2 gap-3">
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
