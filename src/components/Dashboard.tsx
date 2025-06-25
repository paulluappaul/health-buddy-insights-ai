
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Heart, Scale, Brain, Target, Calendar } from 'lucide-react';

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

  // Today's totals
  const todayCalories = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
  const todayCarbs = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.carbs, 0);
  const todayProtein = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.protein, 0);
  const todayFat = todaysFoodEntries.reduce((sum, entry) => sum + entry.nutrition.fat, 0);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-orange-700">{todayCalories}</p>
                    <p className="text-xs text-orange-600">Today's Calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{todaysHealthData.length > 0 ? todaysHealthData[0].weight : '--'}</p>
                    <p className="text-xs text-blue-600">Today's Weight (kg)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-red-50 border-pink-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <div>
                    <p className="text-2xl font-bold text-pink-700">{todaysHealthData.length > 0 ? todaysHealthData[0].pulse : '--'}</p>
                    <p className="text-xs text-pink-600">Latest Pulse (bpm)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-700">{todaysHealthData.length}</p>
                    <p className="text-xs text-green-600">Health Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Detailed View */}
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
        </TabsContent>
        
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

          {/* Charts with Legends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nutrition Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Weekly Nutrition Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyNutrition}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} name="Calories" />
                    <Line type="monotone" dataKey="carbs" stroke="#3B82F6" strokeWidth={2} name="Carbs (g)" />
                    <Line type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={2} name="Protein (g)" />
                    <Line type="monotone" dataKey="fat" stroke="#8B5CF6" strokeWidth={2} name="Fat (g)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weight Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Weight Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyWeight}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Vitals Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Vital Signs Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyVitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pulse" stroke="#EF4444" strokeWidth={2} name="Pulse (bpm)" />
                    <Line type="monotone" dataKey="systolic" stroke="#8B5CF6" strokeWidth={2} name="Systolic BP" />
                    <Line type="monotone" dataKey="diastolic" stroke="#06B6D4" strokeWidth={2} name="Diastolic BP" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mood Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Weekly Mood Analysis
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-6">
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Monthly Health Analysis</h3>
              <p className="text-gray-600">
                Comprehensive monthly trends and detailed analysis will be available once you have more data logged.
                Keep tracking your daily metrics to unlock detailed monthly insights, correlations, and personalized health recommendations!
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
