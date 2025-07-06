
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, TrendingUp, Target, Award } from 'lucide-react';

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
  temperature: number;
  temperatureUnit: string;
  smoked: boolean;
  cigaretteCount?: number;
}

interface MonthlyAnalysisProps {
  foodEntries?: FoodEntry[];
  healthData?: HealthData[];
}

const MonthlyView = ({ foodEntries = [], healthData = [] }: MonthlyAnalysisProps) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter data for last 30 days
  const monthlyFoodEntries = foodEntries.filter(entry => 
    new Date(entry.timestamp) >= thirtyDaysAgo
  );
  
  const monthlyHealthData = healthData.filter(entry => 
    new Date(entry.date) >= thirtyDaysAgo
  );

  // Calculate monthly insights
  const totalDays = monthlyHealthData.length > 0 ? 30 : 0;
  const daysWithData = new Set(monthlyHealthData.map(d => 
    new Date(d.date).toDateString()
  )).size;
  
  const avgCalories = monthlyFoodEntries.length > 0 
    ? Math.round(monthlyFoodEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0) / monthlyFoodEntries.length)
    : 0;

  const avgWeight = monthlyHealthData.filter(d => d.weight).length > 0
    ? (monthlyHealthData.filter(d => d.weight).reduce((sum, d) => sum + d.weight, 0) / monthlyHealthData.filter(d => d.weight).length).toFixed(1)
    : '0';

  const avgTemperature = monthlyHealthData.filter(d => d.temperature && d.temperature > 0).length > 0
    ? (monthlyHealthData.filter(d => d.temperature && d.temperature > 0).reduce((sum, d) => sum + d.temperature, 0) / monthlyHealthData.filter(d => d.temperature && d.temperature > 0).length).toFixed(1)
    : '0';

  const consistencyScore = totalDays > 0 ? Math.round((daysWithData / totalDays) * 100) : 0;

  // Mood analysis
  const moodCounts = monthlyHealthData.reduce((acc, d) => {
    acc[d.mood] = (acc[d.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

  const insights = [
    {
      title: "Tracking Consistency",
      value: `${consistencyScore}%`,
      description: `You logged data on ${daysWithData} out of ${totalDays} days`,
      icon: Target,
      color: consistencyScore >= 80 ? 'text-green-600' : consistencyScore >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: "Average Daily Calories",
      value: avgCalories.toString(),
      description: "Based on your food tracking",
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: "Dominant Mood",
      value: dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1),
      description: `Most common mood this month`,
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {monthlyHealthData.length > 0 ? (
        <>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <CalendarDays className="h-5 w-5" />
                Monthly Health Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${insight.color}`} />
                      <p className="text-2xl font-bold text-gray-800">{insight.value}</p>
                      <p className="text-sm font-medium text-gray-700">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Tracking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Health Entries</span>
                  <span className="font-semibold">{monthlyHealthData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days with Data</span>
                  <span className="font-semibold">{daysWithData} / 30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Weight</span>
                  <span className="font-semibold">{avgWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Temperature</span>
                  <span className="font-semibold">{avgTemperature !== '0' ? `${avgTemperature}°C` : 'No data'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consistency Score</span>
                  <span className={`font-semibold ${consistencyScore >= 80 ? 'text-green-600' : consistencyScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {consistencyScore}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutrition Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Food Entries</span>
                  <span className="font-semibold">{monthlyFoodEntries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Daily Calories</span>
                  <span className="font-semibold">{avgCalories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Dominant Mood</span>
                  <span className="font-semibold capitalize">{dominantMood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Streak</span>
                  <span className="font-semibold">{daysWithData} days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Monthly Health Analysis</h3>
            <p className="text-gray-600">
              Comprehensive monthly trends and detailed analysis will be available once you have more data logged.
              Keep tracking your daily metrics to unlock detailed monthly insights, correlations, and personalized health recommendations!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MonthlyView;
