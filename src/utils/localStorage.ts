
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
}

interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  timestamp: Date;
  notes?: string;
}

export const loadDataFromStorage = () => {
  const savedFoodEntries = localStorage.getItem('myHealthBuddy_foodEntries');
  const savedHealthData = localStorage.getItem('myHealthBuddy_healthData');
  const savedMedications = localStorage.getItem('myHealthBuddy_medications');
  
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

  return { foodEntries, healthData, medications };
};

export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
