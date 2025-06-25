
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodTracker from '@/components/FoodTracker';
import FlexibleMetricsInput from '@/components/FlexibleMetricsInput';
import Dashboard from '@/components/Dashboard';
import MedicationDashboard from '@/components/medication/MedicationDashboard';
import DataManagement from '@/components/DataManagement';
import { Heart, Activity, BarChart3, Utensils, Shield, Settings } from 'lucide-react';
import { MedicationEntry } from '@/components/medication/MedicationInput';
import { ExportData } from '@/utils/dataManager';

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
  type?: string;
}

const Index = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFoodEntries = localStorage.getItem('myHealthBuddy_foodEntries');
    const savedHealthData = localStorage.getItem('myHealthBuddy_healthData');
    const savedMedications = localStorage.getItem('myHealthBuddy_medications');
    
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

    if (savedMedications) {
      const parsed = JSON.parse(savedMedications);
      setMedications(parsed.map((med: any) => ({
        ...med,
        timestamp: new Date(med.timestamp)
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

  useEffect(() => {
    localStorage.setItem('myHealthBuddy_medications', JSON.stringify(medications));
  }, [medications]);

  const handleFoodLogged = (entry: FoodEntry) => {
    setFoodEntries(prev => [entry, ...prev]);
  };

  const handleHealthDataLogged = (data: any) => {
    // Convert flexible metric data to compatible format
    const healthEntry: HealthData = {
      id: data.id,
      date: data.timestamp || new Date(),
      type: data.type
    };

    if (data.type === 'bloodPressure') {
      healthEntry.bloodPressure = {
        systolic: data.systolic,
        diastolic: data.diastolic
      };
    } else if (data.type === 'pulse') {
      healthEntry.pulse = data.pulse;
    } else if (data.type === 'weight') {
      healthEntry.weight = data.weight;
    } else if (data.type === 'mood') {
      healthEntry.mood = data.mood;
    }

    setHealthData(prev => [healthEntry, ...prev]);
  };

  const handleMedicationLogged = (medication: MedicationEntry) => {
    setMedications(prev => [medication, ...prev]);
  };

  const handleDataImported = (data: ExportData) => {
    // Process imported data
    const processedFoodEntries = data.foodEntries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));

    const processedHealthData = data.healthData.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));

    const processedMedications = data.medications.map((med: any) => ({
      ...med,
      timestamp: new Date(med.timestamp)
    }));

    // Merge with existing data (or replace - you can customize this)
    setFoodEntries(prev => [...processedFoodEntries, ...prev]);
    setHealthData(prev => [...processedHealthData, ...prev]);
    setMedications(prev => [...processedMedications, ...prev]);
  };

  // Convert health data for dashboard compatibility
  const convertHealthDataForDashboard = (healthData: HealthData[]) => {
    return healthData.map(data => ({
      id: data.id,
      date: data.date,
      bloodPressure: data.bloodPressure || { systolic: 0, diastolic: 0 },
      pulse: data.pulse || 0,
      mood: data.mood || 'neutral',
      weight: data.weight || 0,
      smoked: data.smoked || false,
      cigaretteCount: data.cigaretteCount
    }));
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
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Food</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Meds</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
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
            <FlexibleMetricsInput 
              onHealthDataLogged={handleHealthDataLogged}
              onMedicationLogged={handleMedicationLogged}
            />
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <MedicationDashboard medications={medications} />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard 
              foodEntries={foodEntries} 
              healthData={convertHealthDataForDashboard(healthData)} 
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <DataManagement
              foodEntries={foodEntries}
              healthData={healthData}
              medications={medications}
              onDataImported={handleDataImported}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
