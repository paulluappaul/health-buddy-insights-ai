
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import { FoodEntry } from '@/types/nutrition';
import FoodTrackerForm from './food/FoodTrackerForm';

const FoodTracker = ({ onFoodLogged }: { onFoodLogged: (entry: FoodEntry) => void }) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Utensils className="h-5 w-5" />
          AI-Powered Food Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FoodTrackerForm onFoodLogged={onFoodLogged} />
      </CardContent>
    </Card>
  );
};

export default FoodTracker;
