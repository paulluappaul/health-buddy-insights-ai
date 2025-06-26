
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface FoodDescriptionInputProps {
  foodText: string;
  onFoodTextChange: (text: string) => void;
  hasSelectedImage: boolean;
  isAnalyzing: boolean;
}

const FoodDescriptionInput = ({ 
  foodText, 
  onFoodTextChange, 
  hasSelectedImage, 
  isAnalyzing 
}: FoodDescriptionInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Describe your food {hasSelectedImage ? '(optional - will be combined with image)' : ''}:
      </label>
      <Textarea
        value={foodText}
        onChange={(e) => onFoodTextChange(e.target.value)}
        placeholder="e.g., 'I had 150g grilled chicken breast with 200g steamed broccoli and 100g brown rice for lunch'"
        className="min-h-[80px] resize-none"
        disabled={isAnalyzing}
      />
    </div>
  );
};

export default FoodDescriptionInput;
