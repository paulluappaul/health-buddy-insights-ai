
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
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  pulse?: number;
  mood?: string;
  weight?: number;
  smoked?: boolean;
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

  const weeklyWeight = healthData
    .filter(entry => entry.weight !== undefined)
    .slice(-7)
    .map((entry, index) => ({
      day: `Day ${index + 1}`,
      weight: entry.weight!
    }));

  const weeklyVitals = healthData
    .filter(entry => entry.bloodPressure || entry.pulse)
    .slice(-7)
    .map((entry, index) => ({
      day: `Day ${index + 1}`,
      systolic: entry.bloodPressure?.systolic || 0,
      diastolic: entry.bloodPressure?.diastolic || 0,
      pulse: entry.pulse || 0
    }));

  // Mood distribution
  const moodCounts = healthData
    .filter(entry => entry.mood)
    .slice(-7)
    .reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count
  }));

  // Calculate averages (only from entries that have the data)
  const calorieEntries = foodEntries.slice(-7);
  const avgCalories = calorieEntries.length > 0 
    ? Math.round(calorieEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0) / calorieEntries.length)
    : 0;

  const weightEntries = healthData.filter(entry => entry.weight !== undefined).slice(-7);
  const avgWeight = weightEntries.length > 0
    ? (weightEntries.reduce((sum, entry) => sum + entry.weight!, 0) / weightEntries.length).toFixed(1)
    : '--';

  const pulseEntries = healthData.filter(entry => entry.pulse !== undefined).slice(-7);
  const avgPulse = pulseEntries.length > 0
    ? Math.round(pulseEntries.reduce((sum, entry) => sum + entry.pulse!, 0) / pulseEntries.length)
    : '--';

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
        {weeklyWeight.length > 0 && <EnhancedWeightChart data={weeklyWeight} />}
        {weeklyVitals.length > 0 && <EnhancedVitalsChart data={weeklyVitals} />}
        {moodData.length > 0 && <MoodChart data={moodData} />}
      </div>
    </div>
  );
};

export default WeeklyView;
