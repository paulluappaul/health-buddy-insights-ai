
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
  painLevel?: number;
  painNotes?: string;
  movementLevel?: string;
  sport?: boolean;
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
      console.log('Setting loaded data:', {
        foodEntries: loadedFoodEntries.length,
        healthData: loadedHealthData.length,
        medications: loadedMedications.length
      });
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
    console.log('Health data received for processing:', data);
    
    try {
      const healthEntry = createHealthEntry(data);
      console.log('Processed health entry:', healthEntry);
      
      // Only add the entry if it has meaningful data
      const hasValidData = healthEntry.bloodPressure || 
                          healthEntry.pulse || 
                          healthEntry.mood || 
                          healthEntry.weight || 
                          healthEntry.temperature || 
                          healthEntry.smoked !== undefined ||
                          healthEntry.painLevel ||
                          healthEntry.movementLevel ||
                          healthEntry.sport;
      
      if (hasValidData) {
        setHealthData(prev => {
          const newData = [healthEntry, ...prev];
          console.log('Updated health data array length:', newData.length);
          return newData;
        });
      } else {
        console.warn('Health entry rejected - no valid data:', healthEntry);
      }
    } catch (error) {
      console.error('Error processing health data:', error);
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

  const handleDeleteHealthEntry = (entryId: string) => {
    setHealthData(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleRemoveEntry = (id: string, type: string) => {
    console.log('Removing entry:', { id, type });
    
    if (type === 'Food') {
      setFoodEntries(prev => prev.filter(entry => entry.id !== id));
    } else if (type === 'Smoking') {
      // Handle health data entries by their composite ID
      const originalId = id.replace('-smoking', '');
      setHealthData(prev => prev.filter(entry => entry.id !== originalId));
    } else {
      // Handle other health data entries (blood pressure, pulse, weight, etc.)
      const originalId = id.split('-')[0]; // Extract original ID from composite ID like "123-bp"
      setHealthData(prev => prev.filter(entry => entry.id !== originalId));
    }
    
    // Handle medication entries  
    if (type === 'Medication') {
      setMedications(prev => prev.filter(entry => entry.id !== id));
    }
  };

  return {
    foodEntries,
    healthData: convertHealthDataForDashboard(healthData),
    medications,
    rawHealthData: healthData,
    handleFoodLogged,
    handleHealthDataLogged,
    handleMedicationLogged,
    handleDataImported,
    handleDeleteHealthEntry,
    handleRemoveEntry
  };
};
