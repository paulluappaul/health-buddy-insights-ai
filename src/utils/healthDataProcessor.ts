
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
}

interface DashboardHealthData {
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
  painLevel?: number;
  painNotes?: string;
  movementLevel?: string;
  sport?: boolean;
}

export const convertHealthDataForDashboard = (healthData: HealthData[]): DashboardHealthData[] => {
  return healthData.map(data => ({
    id: data.id,
    date: data.date,
    bloodPressure: data.bloodPressure || { systolic: 0, diastolic: 0 },
    pulse: data.pulse || 0,
    mood: data.mood || 'neutral',
    weight: data.weight || 0,
    temperature: data.temperature || 0,
    temperatureUnit: data.temperatureUnit || 'celsius',
    smoked: data.smoked || false,
    cigaretteCount: data.cigaretteCount,
    painLevel: data.painLevel,
    painNotes: data.painNotes,
    movementLevel: data.movementLevel,
    sport: data.sport
  }));
};

export const createHealthEntry = (data: any): HealthData => {
  // Create a clean date object without circular references
  let entryDate: Date;
  
  if (data.timestamp) {
    entryDate = new Date(data.timestamp);
  } else if (data.date) {
    if (data.date instanceof Date) {
      entryDate = new Date(data.date.getTime());
    } else if (typeof data.date === 'string') {
      entryDate = new Date(data.date);
    } else if (data.date._type === 'Date' && data.date.value) {
      entryDate = new Date(data.date.value.iso || data.date.value.value);
    } else {
      entryDate = new Date();
    }
  } else {
    entryDate = new Date();
  }

  console.log('Processing health entry with date:', entryDate.toISOString());

  const healthEntry: HealthData = {
    id: data.id || Date.now().toString(),
    date: entryDate
  };

  // Only add fields that have meaningful values
  if (data.type === 'bloodPressure' && data.systolic && data.diastolic) {
    if (data.systolic > 0 && data.diastolic > 0) {
      healthEntry.bloodPressure = {
        systolic: data.systolic,
        diastolic: data.diastolic
      };
    }
  } else if (data.type === 'pulse' && data.pulse && data.pulse > 0) {
    healthEntry.pulse = data.pulse;
  } else if (data.type === 'weight' && data.weight && data.weight > 0) {
    healthEntry.weight = data.weight;
  } else if (data.type === 'temperature' && data.temperature && data.temperature > 0) {
    healthEntry.temperature = data.temperature;
    healthEntry.temperatureUnit = data.originalUnit || data.unit || 'celsius';
  } else if (data.type === 'mood' && data.mood && data.mood !== '') {
    healthEntry.mood = data.mood;
  } else if (data.type === 'smoking') {
    healthEntry.smoked = data.smoked;
    if (data.cigaretteCount && data.cigaretteCount > 0) {
      healthEntry.cigaretteCount = data.cigaretteCount;
    }
  } else if (data.type === 'pain' && data.painLevel && data.painLevel > 0) {
    healthEntry.painLevel = data.painLevel;
    if (data.notes) {
      healthEntry.painNotes = data.notes;
    }
  } else if (data.type === 'movement' && data.movementLevel) {
    healthEntry.movementLevel = data.movementLevel;
  } else if (data.type === 'sport') {
    healthEntry.sport = data.sport;
  }

  console.log('Created clean health entry:', healthEntry);
  return healthEntry;
};

export const validateHealthValue = (type: string, value: any): boolean => {
  switch (type) {
    case 'bloodPressure':
      return value.systolic > 0 && value.diastolic > 0 && 
             value.systolic >= 70 && value.systolic <= 250 && 
             value.diastolic >= 40 && value.diastolic <= 150;
    case 'pulse':
      return value > 0 && value >= 30 && value <= 220;
    case 'weight':
      return value > 0 && value >= 20 && value <= 300;
    case 'temperature':
      return value > 0 && value >= 30 && value <= 45; // Celsius range
    case 'mood':
      return value && value !== '';
    default:
      return true;
  }
};
