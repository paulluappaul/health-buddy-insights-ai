import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '@/components/Dashboard';
import MedicationDashboard from '@/components/medication/MedicationDashboard';
import DataManagement from '@/components/DataManagement';
import HeaderSection from '@/components/layout/HeaderSection';
import FoodTrackingTab from '@/components/tabs/FoodTrackingTab';
import MetricsTab from '@/components/tabs/MetricsTab';
import { Heart, Activity, BarChart3, Utensils, Shield, Settings } from 'lucide-react';
import { MedicationEntry } from '@/components/medication/MedicationInput';
import { ExportData } from '@/utils/dataManager';
import { convertHealthDataForDashboard, createHealthEntry } from '@/utils/healthDataProcessor';
import { loadDataFromStorage, saveToStorage, testStoragePersistence } from '@/utils/localStorage';
import { FoodEntry } from '@/types/nutrition';

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
    console.log('App starting - testing storage persistence...');
    const storageWorking = testStoragePersistence();
    
    if (storageWorking) {
      const { foodEntries: loadedFoodEntries, healthData: loadedHealthData, medications: loadedMedications } = loadDataFromStorage();
      setFoodEntries(loadedFoodEntries);
      setHealthData(loadedHealthData);
      setMedications(loadedMedications);
    } else {
      console.warn('Storage persistence test failed - data may not persist between sessions');
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (foodEntries.length > 0) {
      saveToStorage('myHealthBuddy_foodEntries', foodEntries);
    }
  }, [foodEntries]);

  useEffect(() => {
    if (healthData.length > 0) {
      saveToStorage('myHealthBuddy_healthData', healthData);
    }
  }, [healthData]);

  useEffect(() => {
    if (medications.length > 0) {
      saveToStorage('myHealthBuddy_medications', medications);
    }
  }, [medications]);

  const handleFoodLogged = (entry: FoodEntry) => {
    console.log('Food logged:', entry);
    setFoodEntries(prev => [entry, ...prev]);
  };

  const handleHealthDataLogged = (data: any) => {
    console.log('Health data received:', data);
    const healthEntry = createHealthEntry(data);
    console.log('Health entry created:', healthEntry);
    
    // Only add the entry if it has meaningful data
    if (healthEntry.bloodPressure || healthEntry.pulse || healthEntry.mood || healthEntry.weight || healthEntry.smoked !== undefined) {
      setHealthData(prev => [healthEntry, ...prev]);
    } else {
      console.warn('Health entry rejected - no valid data:', healthEntry);
    }
  };

  const handleMedicationLogged = (medication: MedicationEntry) => {
    console.log('Medication logged:', medication);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <HeaderSection />

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
            <FoodTrackingTab 
              foodEntries={foodEntries}
              onFoodLogged={handleFoodLogged}
            />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsTab 
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
