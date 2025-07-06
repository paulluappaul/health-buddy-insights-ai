
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Scale, Heart, Calendar, Thermometer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MetricCard from './MetricCard';
import { clearAllData } from '@/utils/localStorage';

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
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  pulse?: number;
  mood?: string;
  weight?: number;
  temperature?: number;
  temperatureUnit?: string;
  smoked?: boolean;
  cigaretteCount?: number;
}

interface DailyViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const DailyView = ({ foodEntries, healthData }: DailyViewProps) => {
  const today = new Date();
  const todayString = today.toDateString();
  
  console.log('DailyView - Today:', todayString);
  console.log('DailyView - Food entries:', foodEntries.length);
  console.log('DailyView - Health data:', healthData.length);

  // Filter today's data using date strings for more reliable comparison
  const todaysFoodEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const entryString = entryDate.toDateString();
    console.log('Food entry date:', entryString, 'matches today:', entryString === todayString);
    return entryString === todayString;
  });

  const todaysHealthData = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryString = entryDate.toDateString();
    console.log('Health entry date:', entryString, 'matches today:', entryString === todayString);
    return entryString === todayString;
  });

  console.log('Filtered - Today\'s food entries:', todaysFoodEntries.length);
  console.log('Filtered - Today\'s health data:', todaysHealthData.length);

  // Today's totals
  const todayCalories = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
  const todayCarbs = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.carbs, 0);
  const todayProtein = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.protein, 0);
  const todayFat = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.fat, 0);

  // Get latest values for today
  const latestWeight = todaysHealthData.find(d => d.weight !== undefined)?.weight;
  const latestPulse = todaysHealthData.find(d => d.pulse !== undefined)?.pulse;
  const latestTemperature = todaysHealthData.find(d => d.temperature !== undefined);
  const latestBloodPressure = todaysHealthData.find(d => d.bloodPressure !== undefined)?.bloodPressure;

  const formatTemperature = (temp: number, unit: string) => {
    if (unit === 'fahrenheit') {
      return `${temp.toFixed(1)}°F`;
    }
    return `${temp.toFixed(1)}°C`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Today's Overview</h2>
        <Button 
          onClick={clearAllData}
          variant="destructive" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard
          icon={Target}
          value={todayCalories}
          label="Today's Calories"
          colorClass="from-orange-50 to-red-50 border-orange-200 text-orange-700"
        />
        <MetricCard
          icon={Scale}
          value={latestWeight ? latestWeight.toFixed(1) : '--'}
          label="Latest Weight (kg)"
          colorClass="from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
        />
        <MetricCard
          icon={Heart}
          value={latestPulse || '--'}
          label="Latest Pulse (bpm)"
          colorClass="from-pink-50 to-red-50 border-pink-200 text-pink-700"
        />
        <MetricCard
          icon={Thermometer}
          value={latestTemperature ? formatTemperature(latestTemperature.temperature!, latestTemperature.temperatureUnit!) : '--'}
          label="Latest Temperature"
          colorClass="from-red-50 to-orange-50 border-red-200 text-red-700"
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
                      {data.bloodPressure && (
                        <span>BP: {data.bloodPressure.systolic}/{data.bloodPressure.diastolic}</span>
                      )}
                      {data.pulse && <span>Pulse: {data.pulse}</span>}
                      {data.mood && <span>Mood: {data.mood}</span>}
                      {data.weight && <span>Weight: {data.weight}kg</span>}
                      {data.temperature && (
                        <span>Temp: {formatTemperature(data.temperature, data.temperatureUnit!)}</span>
                      )}
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
