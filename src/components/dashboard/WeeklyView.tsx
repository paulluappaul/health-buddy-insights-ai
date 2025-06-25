
import React from 'react';
import { Target, Scale, Heart, Brain } from 'lucide-react';
import MetricCard from './MetricCard';
import NutritionChart from '../charts/NutritionChart';
import EnhancedWeightChart from '../charts/EnhancedWeightChart';
import EnhancedVitalsChart from '../charts/EnhancedVitalsChart';
import MoodChart from '../charts/MoodChart';

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

interface WeeklyViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const WeeklyView = ({ foodEntries, healthData }: WeeklyViewProps) => {
  // Process data for charts
  const weeklyNutrition = foodEntries.slice(-7).map((entry, index) => ({
    day: `Day ${index + 1}`,
    calories: entry.nutrition.calories,
    carbs: entry.nutrition.carbs,
    protein: entry.nutrition.protein,
    fat: entry.nutrition.fat
  }));

  const weeklyWeight = healthData.slice(-7).map((entry, index) => ({
    day: `Day ${index + 1}`,
    weight: entry.weight
  }));

  const weeklyVitals = healthData.slice(-7).map((entry, index) => ({
    day: `Day ${index + 1}`,
    systolic: entry.bloodPressure.systolic,
    diastolic: entry.bloodPressure.diastolic,
    pulse: entry.pulse
  }));

  // Mood distribution
  const moodCounts = healthData.slice(-7).reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count
  }));

  // Calculate averages
  const avgCalories = Math.round(foodEntries.slice(-7).reduce((sum, entry) => sum + entry.nutrition.calories, 0) / Math.max(foodEntries.slice(-7).length, 1));
  const avgWeight = (healthData.slice(-7).reduce((sum, entry) => sum + entry.weight, 0) / Math.max(healthData.slice(-7).length, 1)).toFixed(1);
  const avgPulse = Math.round(healthData.slice(-7).reduce((sum, entry) => sum + entry.pulse, 0) / Math.max(healthData.slice(-7).length, 1));
  const smokingDays = healthData.slice(-7).filter(entry => entry.smoked).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          value={avgCalories}
          label="Avg Daily Calories"
          colorClass="from-orange-50 to-red-50 border-orange-200 text-orange-700"
        />
        <MetricCard
          icon={Scale}
          value={avgWeight}
          label="Avg Weight (kg)"
          colorClass="from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
        />
        <MetricCard
          icon={Heart}
          value={avgPulse}
          label="Avg Pulse (bpm)"
          colorClass="from-pink-50 to-red-50 border-pink-200 text-pink-700"
        />
        <MetricCard
          icon={Brain}
          value={smokingDays}
          label="Smoking Days"
          colorClass="from-yellow-50 to-orange-50 border-yellow-200 text-yellow-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NutritionChart data={weeklyNutrition} />
        <EnhancedWeightChart data={weeklyWeight} />
        <EnhancedVitalsChart data={weeklyVitals} />
        <MoodChart data={moodData} />
      </div>
    </div>
  );
};

export default WeeklyView;
