
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

interface MonthlyViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const MonthlyView = ({ foodEntries, healthData }: MonthlyViewProps) => {
  // Process data for charts - last 30 days, grouped by week
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  // Group by weeks
  const weeklyData = [];
  for (let i = 0; i < 30; i += 7) {
    const weekStart = last30Days[i];
    const weekEnd = last30Days[Math.min(i + 6, 29)];
    const weekNumber = Math.floor(i / 7) + 1;
    
    const weekFoodEntries = foodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    const weekHealthData = healthData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    // Calculate weekly averages
    weeklyData.push({
      week: `Week ${weekNumber}`,
      calories: weekFoodEntries.length > 0 
        ? Math.round(weekFoodEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0) / weekFoodEntries.length)
        : 0,
      weight: weekHealthData.filter(d => d.weight && d.weight > 0).length > 0
        ? weekHealthData.filter(d => d.weight && d.weight > 0).reduce((sum, d) => sum + d.weight!, 0) / weekHealthData.filter(d => d.weight && d.weight > 0).length
        : 0,
      cigarettes: weekHealthData.reduce((sum, d) => sum + (d.cigaretteCount || 0), 0),
      smoked: weekHealthData.some(d => d.smoked),
      pulse: weekHealthData.filter(d => d.pulse && d.pulse > 0).length > 0
        ? Math.round(weekHealthData.filter(d => d.pulse && d.pulse > 0).reduce((sum, d) => sum + d.pulse!, 0) / weekHealthData.filter(d => d.pulse && d.pulse > 0).length)
        : 0,
      systolic: weekHealthData.filter(d => d.bloodPressure && d.bloodPressure.systolic > 0).length > 0
        ? Math.round(weekHealthData.filter(d => d.bloodPressure && d.bloodPressure.systolic > 0).reduce((sum, d) => sum + d.bloodPressure!.systolic, 0) / weekHealthData.filter(d => d.bloodPressure && d.bloodPressure.systolic > 0).length)
        : 0,
      diastolic: weekHealthData.filter(d => d.bloodPressure && d.bloodPressure.diastolic > 0).length > 0
        ? Math.round(weekHealthData.filter(d => d.bloodPressure && d.bloodPressure.diastolic > 0).reduce((sum, d) => sum + d.bloodPressure!.diastolic, 0) / weekHealthData.filter(d => d.bloodPressure && d.bloodPressure.diastolic > 0).length)
        : 0
    });
  }

  // Monthly calories data
  const monthlyCalories = weeklyData.map(week => ({
    date: week.week,
    calories: week.calories
  }));

  // Monthly weight data
  const monthlyWeight = weeklyData
    .filter(week => week.weight > 0)
    .map(week => ({
      day: week.week,
      weight: week.weight
    }));

  // Monthly cigarette data
  const monthlyCigarettes = weeklyData.map(week => ({
    date: week.week,
    cigarettes: week.cigarettes,
    smoked: week.smoked
  }));

  // Monthly pulse data
  const monthlyPulse = weeklyData
    .filter(week => week.pulse > 0)
    .map(week => ({
      date: week.week,
      pulse: week.pulse
    }));

  // Monthly blood pressure data
  const monthlyBloodPressure = weeklyData
    .filter(week => week.systolic > 0)
    .map(week => ({
      date: week.week,
      systolic: week.systolic,
      diastolic: week.diastolic
    }));

  // Mood distribution for the month
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  
  const moodCounts = healthData
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.mood && entry.mood !== '' && entryDate >= monthAgo;
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

  // Calculate monthly averages
  const monthlyFoodEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= monthAgo;
  });
  const avgCalories = monthlyFoodEntries.length > 0 
    ? Math.round(monthlyFoodEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0) / monthlyFoodEntries.length)
    : 0;

  const monthlyHealthEntries = healthData.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= monthAgo;
  });

  const actualWeightEntries = monthlyHealthEntries.filter(entry => entry.weight && entry.weight > 0);
  const avgWeight = actualWeightEntries.length > 0
    ? (actualWeightEntries.reduce((sum, entry) => sum + entry.weight!, 0) / actualWeightEntries.length).toFixed(1)
    : '--';

  const actualPulseEntries = monthlyHealthEntries.filter(entry => entry.pulse && entry.pulse > 0);
  const avgPulse = actualPulseEntries.length > 0
    ? Math.round(actualPulseEntries.reduce((sum, entry) => sum + entry.pulse!, 0) / actualPulseEntries.length)
    : '--';

  const actualTemperatureEntries = monthlyHealthEntries.filter(entry => entry.temperature && entry.temperature > 0);
  const avgTemperature = actualTemperatureEntries.length > 0
    ? (actualTemperatureEntries.reduce((sum, entry) => sum + entry.temperature!, 0) / actualTemperatureEntries.length).toFixed(1)
    : '--';

  const smokingDays = monthlyHealthEntries.filter(entry => entry.smoked === true).length;

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
        {/* Monthly Calories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Monthly Calories Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCalories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} kcal`, 'Calories']} />
                <Line type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {monthlyWeight.length > 0 && <EnhancedWeightChart data={monthlyWeight} />}
        <CigaretteChart data={monthlyCigarettes} title="Monthly Cigarette Tracking" />
        {monthlyPulse.length > 0 && <PulseChart data={monthlyPulse} />}
        {monthlyBloodPressure.length > 0 && <BloodPressureChart data={monthlyBloodPressure} />}
        {moodData.length > 0 && <MoodChart data={moodData} />}
      </div>
    </div>
  );
};

export default MonthlyView;
