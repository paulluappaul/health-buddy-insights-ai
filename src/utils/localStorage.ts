
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

interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  timestamp: Date;
  notes?: string;
}

export const clearAllData = () => {
  try {
    console.log('Clearing all stored data...');
    localStorage.removeItem('myHealthBuddy_foodEntries');
    localStorage.removeItem('myHealthBuddy_healthData');
    localStorage.removeItem('myHealthBuddy_medications');
    console.log('All data cleared successfully');
    
    // Force page reload to reset the app state
    window.location.reload();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export const loadDataFromStorage = () => {
  try {
    const savedFoodEntries = localStorage.getItem('myHealthBuddy_foodEntries');
    const savedHealthData = localStorage.getItem('myHealthBuddy_healthData');
    const savedMedications = localStorage.getItem('myHealthBuddy_medications');
    
    console.log('Loading data from localStorage...');
    console.log('Food entries found:', !!savedFoodEntries);
    console.log('Health data found:', !!savedHealthData);
    console.log('Medications found:', !!savedMedications);
    
    const foodEntries = savedFoodEntries 
      ? JSON.parse(savedFoodEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
      : [];
        
    const healthData = savedHealthData
      ? JSON.parse(savedHealthData).map((data: any) => ({
          ...data,
          date: new Date(data.date)
        }))
      : [];

    const medications = savedMedications
      ? JSON.parse(savedMedications).map((med: any) => ({
          ...med,
          timestamp: new Date(med.timestamp)
        }))
      : [];

    console.log('Loaded data:', {
      foodEntries: foodEntries.length,
      healthData: healthData.length,
      medications: medications.length
    });

    return { foodEntries, healthData, medications };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return { foodEntries: [], healthData: [], medications: [] };
  }
};

export const saveToStorage = (key: string, data: any) => {
  try {
    console.log(`Saving ${key} to localStorage:`, data.length || 'unknown', 'items');
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Successfully saved ${key} to localStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const testStoragePersistence = () => {
  const testKey = 'myHealthBuddy_test';
  const testData = { test: true, timestamp: new Date().toISOString() };
  
  try {
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = localStorage.getItem(testKey);
    const parsed = retrieved ? JSON.parse(retrieved) : null;
    
    localStorage.removeItem(testKey);
    
    console.log('Storage persistence test:', parsed?.test === true ? 'PASSED' : 'FAILED');
    return parsed?.test === true;
  } catch (error) {
    console.error('Storage persistence test FAILED:', error);
    return false;
  }
};
