
import React from 'react';
import { Target, Scale, Heart, Brain, Thermometer } from 'lucide-react';
import MetricCard from './MetricCard';
import EnhancedWeightChart from '../charts/EnhancedWeightChart';
import MoodChart from '../charts/MoodChart';
import CigaretteChart from '../charts/CigaretteChart';
import PulseChart from '../charts/PulseChart';
import BloodPressureChart from '../charts/BloodPressureChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

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

interface WeeklyViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const WeeklyView = ({ foodEntries, healthData }: WeeklyViewProps) => {
  // Process data for charts - last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  // Weekly calories data (simplified)
  const weeklyCalories = last7Days.map(dateStr => {
    const dayEntries = foodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === dateStr;
    });
    const totalCalories = dayEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
    
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: totalCalories
    };
  });

  // Weekly weight data
  const weeklyWeight = last7Days.map(dateStr => {
    const dayHealthData = healthData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === dateStr && entry.weight && entry.weight > 0;
    });
    const latestWeight = dayHealthData.length > 0 ? dayHealthData[dayHealthData.length - 1].weight : 0;
    
    return {
      day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      weight: latestWeight || 0
    };
  }).filter(day => day.weight > 0);

  // Weekly cigarette data
  const weeklyCigarettes = last7Days.map(dateStr => {
    const dayHealthData = healthData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === dateStr;
    });
    const cigaretteCount = dayHealthData.reduce((sum, entry) => sum + (entry.cigaretteCount || 0), 0);
    const smoked = dayHealthData.some(entry => entry.smoked);
    
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      cigarettes: cigaretteCount,
      smoked: smoked
    };
  });

  // Weekly pulse data
  const weeklyPulse = last7Days.map(dateStr => {
    const dayHealthData = healthData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === dateStr && entry.pulse && entry.pulse > 0;
    });
    const avgPulse = dayHealthData.length > 0 
      ? Math.round(dayHealthData.reduce((sum, entry) => sum + (entry.pulse || 0), 0) / dayHealthData.length)
      : 0;
    
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      pulse: avgPulse
    };
  }).filter(day => day.pulse > 0);

  // Weekly blood pressure data
  const weeklyBloodPressure = last7Days.map(dateStr => {
    const dayHealthData = healthData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === dateStr && entry.bloodPressure && entry.bloodPressure.systolic > 0;
    });
    const avgSystolic = dayHealthData.length > 0 
      ? Math.round(dayHealthData.reduce((sum, entry) => sum + (entry.bloodPressure?.systolic || 0), 0) / dayHealthData.length)
      : 0;
    const avgDiastolic = dayHealthData.length > 0 
      ? Math.round(dayHealthData.reduce((sum, entry) => sum + (entry.bloodPressure?.diastolic || 0), 0) / dayHealthData.length)
      : 0;
    
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      systolic: avgSystolic,
      diastolic: avgDiastolic
    };
  }).filter(day => day.systolic > 0);

  // Mood distribution
  const moodCounts = healthData
    .filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entry.mood && entry.mood !== '' && entryDate >= weekAgo;
    })
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

  // Calculate averages
  const calorieEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });
  const avgCalories = calorieEntries.length > 0 
    ? Math.round(calorieEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0) / calorieEntries.length)
    : 0;

  const actualWeightEntries = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entry.weight && entry.weight > 0 && entryDate >= weekAgo;
  });
  const avgWeight = actualWeightEntries.length > 0
    ? (actualWeightEntries.reduce((sum, entry) => sum + entry.weight!, 0) / actualWeightEntries.length).toFixed(1)
    : '--';

  const actualPulseEntries = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entry.pulse && entry.pulse > 0 && entryDate >= weekAgo;
  });
  const avgPulse = actualPulseEntries.length > 0
    ? Math.round(actualPulseEntries.reduce((sum, entry) => sum + entry.pulse!, 0) / actualPulseEntries.length)
    : '--';

  const actualTemperatureEntries = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entry.temperature && entry.temperature > 0 && entryDate >= weekAgo;
  });
  const avgTemperature = actualTemperatureEntries.length > 0
    ? (actualTemperatureEntries.reduce((sum, entry) => sum + entry.temperature!, 0) / actualTemperatureEntries.length).toFixed(1)
    : '--';

  const smokingDays = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entry.smoked === true && entryDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {(avgCalories > 0 || avgWeight !== '--' || avgPulse !== '--' || avgTemperature !== '--' || smokingDays > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {avgCalories > 0 && (
            <MetricCard
              icon={Target}
              value={avgCalories}
              label="Avg Daily Calories"
              colorClass="from-orange-50 to-red-50 border-orange-200 text-orange-700"
            />
          )}
          {avgWeight !== '--' && (
            <MetricCard
              icon={Scale}
              value={avgWeight}
              label="Avg Weight (kg)"
              colorClass="from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
            />
          )}
          {avgPulse !== '--' && (
            <MetricCard
              icon={Heart}
              value={avgPulse}
              label="Avg Pulse (bpm)"
              colorClass="from-pink-50 to-red-50 border-pink-200 text-pink-700"
            />
          )}
          {avgTemperature !== '--' && (
            <MetricCard
              icon={Thermometer}
              value={`${avgTemperature}°C`}
              label="Avg Temperature"
              colorClass="from-red-50 to-orange-50 border-red-200 text-red-700"
            />
          )}
          {smokingDays > 0 && (
            <MetricCard
              icon={Brain}
              value={smokingDays}
              label="Smoking Days"
              colorClass="from-yellow-50 to-orange-50 border-yellow-200 text-yellow-700"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Simplified Calories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Weekly Calories Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyCalories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} kcal`, 'Calories']} />
                <Line type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {weeklyWeight.length > 0 && <EnhancedWeightChart data={weeklyWeight} />}
        <CigaretteChart data={weeklyCigarettes} title="Weekly Cigarette Tracking" />
        {weeklyPulse.length > 0 && <PulseChart data={weeklyPulse} />}
        {weeklyBloodPressure.length > 0 && <BloodPressureChart data={weeklyBloodPressure} />}
        {moodData.length > 0 && <MoodChart data={moodData} />}
      </div>
    </div>
  );
};

export default WeeklyView;
