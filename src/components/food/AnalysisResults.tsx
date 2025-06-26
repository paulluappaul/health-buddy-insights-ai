
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { NutritionData } from '@/types/nutrition';
import IngredientBreakdown from './IngredientBreakdown';

interface AnalysisResultsProps {
  analysis: NutritionData;
}

const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="bg-white rounded-lg p-4 border border-green-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-green-700">AI Analysis Results:</h4>
        {analysis.breakdown && (
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
          <div className="text-2xl font-bold text-orange-600">{analysis.calories}</div>
          <div className="text-xs text-gray-600">Calories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{analysis.carbs}g</div>
          <div className="text-xs text-gray-600">Carbs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{analysis.protein}g</div>
          <div className="text-xs text-gray-600">Protein</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{analysis.fat}g</div>
          <div className="text-xs text-gray-600">Fat</div>
        </div>
      </div>

      {showBreakdown && analysis.breakdown && (
        <IngredientBreakdown breakdown={analysis.breakdown} />
      )}
      
      <div className="mt-3">
        <div className="text-sm text-gray-600 mb-1">Detected Foods:</div>
        <div className="flex flex-wrap gap-1">
          {analysis.foods.map((food, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {food}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
