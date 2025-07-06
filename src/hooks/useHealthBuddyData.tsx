
import { useState, useEffect } from 'react';
import { FoodEntry } from '@/types/nutrition';
import { MedicationEntry } from '@/components/medication/MedicationInput';
import { ExportData } from '@/utils/dataManager';
import { convertHealthDataForDashboard, createHealthEntry } from '@/utils/healthDataProcessor';
import { loadDataFromStorage, saveToStorage, testStoragePersistence } from '@/utils/localStorage';

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
  type?: string;
}

export const useHealthBuddyData = () => {
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
    if (healthEntry.bloodPressure || healthEntry.pulse || healthEntry.mood || healthEntry.weight || healthEntry.temperature || healthEntry.smoked !== undefined) {
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

  return {
    foodEntries,
    healthData: convertHealthDataForDashboard(healthData),
    medications,
    rawHealthData: healthData,
    handleFoodLogged,
    handleHealthDataLogged,
    handleMedicationLogged,
    handleDataImported
  };
};
