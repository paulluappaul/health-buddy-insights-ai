
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
  smoked: boolean;
  cigaretteCount?: number;
}

export const convertHealthDataForDashboard = (healthData: HealthData[]): DashboardHealthData[] => {
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

export const createHealthEntry = (data: any) => {
  const healthEntry: HealthData = {
    id: data.id,
    date: data.timestamp || new Date(),
    type: data.type
  };

  // Only add fields that have actual values
  if (data.type === 'bloodPressure' && data.systolic && data.diastolic) {
    healthEntry.bloodPressure = {
      systolic: data.systolic,
      diastolic: data.diastolic
    };
  } else if (data.type === 'pulse' && data.pulse) {
    healthEntry.pulse = data.pulse;
  } else if (data.type === 'weight' && data.weight) {
    healthEntry.weight = data.weight;
  } else if (data.type === 'mood' && data.mood) {
    healthEntry.mood = data.mood;
  }

  return healthEntry;
};
