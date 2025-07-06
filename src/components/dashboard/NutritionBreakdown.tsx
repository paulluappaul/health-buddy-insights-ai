
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface NutritionBreakdownProps {
  todayCalories: number;
  todayCarbs: number;
  todayProtein: number;
  todayFat: number;
}

const NutritionBreakdown = ({
  todayCalories,
  todayCarbs,
  todayProtein,
  todayFat
}: NutritionBreakdownProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-600" />
          Today's Nutrition Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Calories</span>
            <span className="text-lg font-bold text-orange-600">{todayCalories}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Carbohydrates</span>
            <span className="text-lg font-bold text-blue-600">{todayCarbs.toFixed(1)}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Protein</span>
            <span className="text-lg font-bold text-green-600">{todayProtein.toFixed(1)}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Fat</span>
            <span className="text-lg font-bold text-purple-600">{todayFat.toFixed(1)}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionBreakdown;
