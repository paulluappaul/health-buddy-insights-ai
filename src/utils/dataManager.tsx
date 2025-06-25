
import { toast } from '@/hooks/use-toast';

export interface ExportData {
  foodEntries: any[];
  healthData: any[];
  medications: any[];
  exportDate: string;
  version: string;
}

export const exportData = (foodEntries: any[], healthData: any[], medications: any[]) => {
  const exportData: ExportData = {
    foodEntries,
    healthData,
    medications,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health-buddy-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  toast({
    title: "Data Exported",
    description: "Your health data has been downloaded successfully.",
  });
};

export const importData = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate data structure
        if (!data.foodEntries || !data.healthData || !data.medications) {
          throw new Error('Invalid data format');
        }
        
        resolve(data);
        
        toast({
          title: "Data Imported",
          description: "Your health data has been imported successfully.",
        });
      } catch (error) {
        reject(new Error('Failed to parse import file'));
        
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid backup file.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateHealthData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (data.bloodPressure) {
    const { systolic, diastolic } = data.bloodPressure;
    if (systolic < 70 || systolic > 250) {
      errors.push('Systolic pressure must be between 70-250 mmHg');
    }
    if (diastolic < 40 || diastolic > 150) {
      errors.push('Diastolic pressure must be between 40-150 mmHg');
    }
  }
  
  if (data.pulse && (data.pulse < 30 || data.pulse > 220)) {
    errors.push('Pulse rate must be between 30-220 bpm');
  }
  
  if (data.weight && (data.weight < 20 || data.weight > 300)) {
    errors.push('Weight must be between 20-300 kg');
  }
  
  return errors;
};

export const calculateHealthStats = (healthData: any[]) => {
  const stats = {
    totalEntries: healthData.length,
    averageWeight: 0,
    averagePulse: 0,
    averageSystolic: 0,
    averageDiastolic: 0,
    moodDistribution: {} as Record<string, number>,
    weeklyTrends: [] as any[]
  };
  
  if (healthData.length === 0) return stats;
  
  const weights = healthData.filter(d => d.weight).map(d => d.weight);
  const pulses = healthData.filter(d => d.pulse).map(d => d.pulse);
  const systolics = healthData.filter(d => d.bloodPressure?.systolic).map(d => d.bloodPressure.systolic);
  const diastolics = healthData.filter(d => d.bloodPressure?.diastolic).map(d => d.bloodPressure.diastolic);
  
  stats.averageWeight = weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
  stats.averagePulse = pulses.length > 0 ? pulses.reduce((a, b) => a + b, 0) / pulses.length : 0;
  stats.averageSystolic = systolics.length > 0 ? systolics.reduce((a, b) => a + b, 0) / systolics.length : 0;
  stats.averageDiastolic = diastolics.length > 0 ? diastolics.reduce((a, b) => a + b, 0) / diastolics.length : 0;
  
  // Calculate mood distribution
  healthData.forEach(d => {
    if (d.mood) {
      stats.moodDistribution[d.mood] = (stats.moodDistribution[d.mood] || 0) + 1;
    }
  });
  
  return stats;
};
