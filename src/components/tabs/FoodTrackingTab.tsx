
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FoodTracker from '@/components/FoodTracker';
import { Activity } from 'lucide-react';
import { FoodEntry } from '@/types/nutrition';

interface FoodTrackingTabProps {
  foodEntries: FoodEntry[];
  onFoodLogged: (entry: FoodEntry) => void;
}

const FoodTrackingTab = ({ foodEntries, onFoodLogged }: FoodTrackingTabProps) => {
  return (
    <div className="space-y-6">
      <FoodTracker onFoodLogged={onFoodLogged} />
      
      {/* Recent Food Entries */}
      {foodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Recent Food Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {foodEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-800 flex-1">{entry.text}</p>
                    <span className="text-xs text-gray-500 ml-4">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600 font-semibold">{entry.nutrition.calories} cal</span>
                    <span className="text-blue-600">{entry.nutrition.carbs}g carbs</span>
                    <span className="text-green-600">{entry.nutrition.protein}g protein</span>
                    <span className="text-purple-600">{entry.nutrition.fat}g fat</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodTrackingTab;
