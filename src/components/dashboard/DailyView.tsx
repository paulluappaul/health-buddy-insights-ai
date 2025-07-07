
import React from 'react';
import TodaysMetrics from './TodaysMetrics';
import NutritionBreakdown from './NutritionBreakdown';
import HealthMetricsSummary from './HealthMetricsSummary';


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
  onDeleteHealthEntry?: (entryId: string) => void;
}

const DailyView = ({ foodEntries, healthData, onDeleteHealthEntry }: DailyViewProps) => {
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

  // Get latest ACTUAL values for today (not default zeros from dashboard conversion)
  const latestWeight = todaysHealthData.find(d => d.weight !== undefined && d.weight > 0)?.weight;
  const latestPulse = todaysHealthData.find(d => d.pulse !== undefined && d.pulse > 0)?.pulse;
  const latestTemperature = todaysHealthData.find(d => d.temperature !== undefined && d.temperature > 0);
  const latestBloodPressure = todaysHealthData.find(d => 
    d.bloodPressure !== undefined && 
    d.bloodPressure.systolic > 0 && 
    d.bloodPressure.diastolic > 0
  )?.bloodPressure;

  // Calculate today's cigarettes
  const todayCigarettes = todaysHealthData.reduce((sum, entry) => {
    return sum + (entry.smoked ? (entry.cigaretteCount || 0) : 0);
  }, 0);

  console.log('Latest values found:', {
    weight: latestWeight,
    pulse: latestPulse,
    temperature: latestTemperature?.temperature,
    bloodPressure: latestBloodPressure
  });

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Today's Overview</h2>
      </div>

      <TodaysMetrics
        todayCalories={todayCalories}
        latestWeight={latestWeight}
        latestPulse={latestPulse}
        latestTemperature={latestTemperature ? {
          temperature: latestTemperature.temperature!,
          temperatureUnit: latestTemperature.temperatureUnit!
        } : undefined}
        todaysHealthDataCount={todaysHealthData.length}
        todayCigarettes={todayCigarettes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NutritionBreakdown
          todayCalories={todayCalories}
          todayCarbs={todayCarbs}
          todayProtein={todayProtein}
          todayFat={todayFat}
        />
        <HealthMetricsSummary 
          todaysHealthData={todaysHealthData} 
          onDeleteEntry={onDeleteHealthEntry}
        />
      </div>
    </div>
  );
};

export default DailyView;
