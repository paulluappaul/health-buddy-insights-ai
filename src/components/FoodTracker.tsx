
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Sparkles } from 'lucide-react';
import { FoodEntry } from '@/types/nutrition';
import FoodTrackerForm from './food/FoodTrackerForm';

const FoodTracker = ({ onFoodLogged }: { onFoodLogged: (entry: FoodEntry) => void }) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50/50 to-pink-50/50 border-orange-200/30 shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-2xl translate-x-8 -translate-y-8"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-orange-800">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white shadow-lg">
            <Utensils className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            AI-Powered Food Tracker
            <Sparkles className="h-4 w-4 text-orange-500" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <FoodTrackerForm onFoodLogged={onFoodLogged} />
      </CardContent>
    </Card>
  );
};

export default FoodTracker;
