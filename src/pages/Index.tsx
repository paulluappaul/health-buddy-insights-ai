
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodTracker from '@/components/FoodTracker';
import HealthMetrics from '@/components/HealthMetrics';
import Dashboard from '@/components/Dashboard';
import { Heart, Activity, BarChart3, Utensils } from 'lucide-react';

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

const Index = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFoodEntries = localStorage.getItem('myHealthBuddy_foodEntries');
    const savedHealthData = localStorage.getItem('myHealthBuddy_healthData');
    
    if (savedFoodEntries) {
      const parsed = JSON.parse(savedFoodEntries);
      setFoodEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
    
    if (savedHealthData) {
      const parsed = JSON.parse(savedHealthData);
      setHealthData(parsed.map((data: any) => ({
        ...data,
        date: new Date(data.date)
      })));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('myHealthBuddy_foodEntries', JSON.stringify(foodEntries));
  }, [foodEntries]);

  useEffect(() => {
    localStorage.setItem('myHealthBuddy_healthData', JSON.stringify(healthData));
  }, [healthData]);

  const handleFoodLogged = (entry: FoodEntry) => {
    setFoodEntries(prev => [entry, ...prev]);
  };

  const handleMetricsLogged = (data: HealthData) => {
    setHealthData(prev => [data, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            My Health Buddy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent companion for tracking nutrition, vitals, and wellness with AI-powered insights
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="track" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Track Food
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Health Metrics
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="track" className="space-y-6">
            <FoodTracker onFoodLogged={handleFoodLogged} />
            
            {/* Recent Food Entries */}
            {foodEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Recent Food Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {foodEntries.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-800 flex-1">{entry.text}</p>
                          <span className="text-xs text-gray-500 ml-4">
                            {entry.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-600 font-semibold">{entry.nutrition.calories} cal</span>
                          <span className="text-blue-600">{entry.nutrition.carbs}g carbs</span>
                          <span className="text-green-600">{entry.nutrition.protein}g protein</span>
                          <span className="text-purple-600">{entry.nutrition.fat}g fat</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <HealthMetrics onMetricsLogged={handleMetricsLogged} />
            
            {/* Recent Health Data */}
            {healthData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Recent Health Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthData.slice(0, 3).map((data) => (
                      <div key={data.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            {data.date.toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            Mood: {data.mood}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <span>BP: {data.bloodPressure.systolic}/{data.bloodPressure.diastolic}</span>
                          <span>Pulse: {data.pulse} bpm</span>
                          <span>Weight: {data.weight} kg</span>
                          <span className={data.smoked ? "text-red-600" : "text-green-600"}>
                            {data.smoked ? `Smoked: ${data.cigaretteCount || 1}` : "No smoking"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard foodEntries={foodEntries} healthData={healthData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
