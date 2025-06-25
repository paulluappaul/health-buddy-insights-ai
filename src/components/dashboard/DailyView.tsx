
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Scale, Heart, Calendar } from 'lucide-react';
import MetricCard from './MetricCard';

interface FoodEntry {
  id: string;
  text: string;
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    foods: string[];
  };
  timestamp: Date;
}

interface HealthData {
  id: string;
  date: Date;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  pulse: number;
  mood: string;
  weight: number;
  smoked: boolean;
  cigaretteCount?: number;
}

interface DailyViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const DailyView = ({ foodEntries, healthData }: DailyViewProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter today's data
  const todaysFoodEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  const todaysHealthData = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  // Today's totals
  const todayCalories = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
  const todayCarbs = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.carbs, 0);
  const todayProtein = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.protein, 0);
  const todayFat = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.fat, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          value={todayCalories}
          label="Today's Calories"
          colorClass="from-orange-50 to-red-50 border-orange-200 text-orange-700"
        />
        <MetricCard
          icon={Scale}
          value={todaysHealthData.length > 0 ? todaysHealthData[0].weight : '--'}
          label="Today's Weight (kg)"
          colorClass="from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
        />
        <MetricCard
          icon={Heart}
          value={todaysHealthData.length > 0 ? todaysHealthData[0].pulse : '--'}
          label="Latest Pulse (bpm)"
          colorClass="from-pink-50 to-red-50 border-pink-200 text-pink-700"
        />
        <MetricCard
          icon={Calendar}
          value={todaysHealthData.length}
          label="Health Entries"
          colorClass="from-green-50 to-emerald-50 border-green-200 text-green-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Today's Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysHealthData.length > 0 ? (
              <div className="space-y-3">
                {todaysHealthData.map((data, index) => (
                  <div key={data.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Entry #{index + 1}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(data.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span>BP: {data.bloodPressure.systolic}/{data.bloodPressure.diastolic}</span>
                      <span>Pulse: {data.pulse}</span>
                      <span>Mood: {data.mood}</span>
                      <span>Weight: {data.weight}kg</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No health metrics logged today</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyView;
