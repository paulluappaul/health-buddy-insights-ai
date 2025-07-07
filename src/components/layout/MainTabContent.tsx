
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import Dashboard from '@/components/Dashboard';
import MedicationDashboard from '@/components/medication/MedicationDashboard';
import DataManagement from '@/components/DataManagement';
import FoodTrackingTab from '@/components/tabs/FoodTrackingTab';
import MetricsTab from '@/components/tabs/MetricsTab';
import { FoodEntry } from '@/types/nutrition';
import { MedicationEntry } from '@/components/medication/MedicationInput';
import { ExportData } from '@/utils/dataManager';

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
  temperature: number;
  temperatureUnit: string;
  smoked: boolean;
  cigaretteCount?: number;
}

interface MainTabContentProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
  medications: MedicationEntry[];
  rawHealthData: any[];
  onFoodLogged: (entry: FoodEntry) => void;
  onHealthDataLogged: (data: any) => void;
  onMedicationLogged: (medication: MedicationEntry) => void;
  onDataImported: (data: ExportData) => void;
  onDeleteHealthEntry?: (entryId: string) => void;
}

const MainTabContent = ({
  foodEntries,
  healthData,
  medications,
  rawHealthData,
  onFoodLogged,
  onHealthDataLogged,
  onMedicationLogged,
  onDataImported,
  onDeleteHealthEntry
}: MainTabContentProps) => {
  return (
    <>
      <TabsContent value="track" className="space-y-6">
        <FoodTrackingTab 
          foodEntries={foodEntries}
          onFoodLogged={onFoodLogged}
        />
      </TabsContent>

      <TabsContent value="metrics" className="space-y-6">
        <MetricsTab 
          onHealthDataLogged={onHealthDataLogged}
          onMedicationLogged={onMedicationLogged}
        />
      </TabsContent>

      <TabsContent value="medications" className="space-y-6">
        <MedicationDashboard medications={medications} />
      </TabsContent>

      <TabsContent value="dashboard">
        <Dashboard 
          foodEntries={foodEntries} 
          healthData={healthData}
          onDeleteHealthEntry={onDeleteHealthEntry}
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <DataManagement
          foodEntries={foodEntries}
          healthData={rawHealthData}
          medications={medications}
          onDataImported={onDataImported}
        />
      </TabsContent>
    </>
  );
};

export default MainTabContent;
