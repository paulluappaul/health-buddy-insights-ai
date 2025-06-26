
export interface IngredientBreakdown {
  ingredient: string;
  amount: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  foods: string[];
  breakdown?: IngredientBreakdown[];
}

export interface FoodEntry {
  id: string;
  text: string;
  nutrition: NutritionData;
  timestamp: Date;
}
