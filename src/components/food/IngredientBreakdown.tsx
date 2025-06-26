
import React from 'react';
import { IngredientBreakdown as IngredientBreakdownType } from '@/types/nutrition';

interface IngredientBreakdownProps {
  breakdown: IngredientBreakdownType[];
}

const IngredientBreakdown = ({ breakdown }: IngredientBreakdownProps) => {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h5 className="font-medium text-sm text-gray-700 mb-2">AI Ingredient Breakdown:</h5>
      <div className="space-y-2">
        {breakdown.map((item, index) => (
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
  );
};

export default IngredientBreakdown;
