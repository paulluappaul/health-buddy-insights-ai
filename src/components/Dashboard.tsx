
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, Scale, Brain, Target } from 'lucide-react';

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

interface DashboardProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const Dashboard = ({ foodEntries, healthData }: DashboardProps) => {
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

  const moodColors = {
    excellent: '#10B981',
    good: '#3B82F6',
    neutral: '#6B7280',
    tired: '#F59E0B',
    stressed: '#F97316',
    unwell: '#EF4444'
  };

  // Calculate averages
  const avgCalories = Math.round(foodEntries.slice(-7).reduce((sum, entry) => sum + entry.nutrition.calories, 0) / Math.max(foodEntries.slice(-7).length, 1));
  const avgWeight = (healthData.slice(-7).reduce((sum, entry) => sum + entry.weight, 0) / Math.max(healthData.slice(-7).length, 1)).toFixed(1);
  const avgPulse = Math.round(healthData.slice(-7).reduce((sum, entry) => sum + entry.pulse, 0) / Math.max(healthData.slice(-7).length, 1));
  const smokingDays = healthData.slice(-7).filter(entry => entry.smoked).length;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-orange-700">{avgCalories}</p>
                    <p className="text-xs text-orange-600">Avg Daily Calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{avgWeight}</p>
                    <p className="text-xs text-blue-600">Avg Weight (kg)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-red-50 border-pink-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <div>
                    <p className="text-2xl font-bold text-pink-700">{avgPulse}</p>
                    <p className="text-xs text-pink-600">Avg Pulse (bpm)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-700">{smokingDays}</p>
                    <p className="text-xs text-yellow-600">Smoking Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nutrition Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Weekly Nutrition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyNutrition}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weight Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Weight Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyWeight}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Vitals Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyVitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pulse" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="systolic" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="diastolic" stroke="#06B6D4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mood Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Mood Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={moodColors[entry.name.toLowerCase() as keyof typeof moodColors] || '#6B7280'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-6">
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Monthly Overview</h3>
              <p className="text-gray-600">
                Monthly trends and comprehensive analysis will be available once you have more data logged.
                Keep tracking your daily metrics to unlock detailed monthly insights!
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
