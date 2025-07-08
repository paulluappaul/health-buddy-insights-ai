
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyView from './dashboard/DailyView';
import WeeklyView from './dashboard/WeeklyView';
import MonthlyView from './dashboard/MonthlyView';
import TabularDataView from './data/TabularDataView';
import PainTableView from './data/PainTableView';
import DailyDataSelector from './dashboard/DailyDataSelector';

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

interface DashboardProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
  onDeleteHealthEntry?: (entryId: string) => void;
}

const Dashboard = ({ foodEntries, healthData, onDeleteHealthEntry }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="flex w-full overflow-x-auto scrollbar-hide p-1 bg-muted rounded-lg">
          <TabsTrigger value="daily" className="flex-shrink-0 px-4 py-2 text-sm">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-shrink-0 px-4 py-2 text-sm">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-shrink-0 px-4 py-2 text-sm">Monthly</TabsTrigger>
          <TabsTrigger value="data" className="flex-shrink-0 px-4 py-2 text-sm">Data Table</TabsTrigger>
          <TabsTrigger value="pain" className="flex-shrink-0 px-4 py-2 text-sm">Pain Table</TabsTrigger>
          <TabsTrigger value="selector" className="flex-shrink-0 px-4 py-2 text-sm">Daily Selector</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          <DailyView 
            foodEntries={foodEntries} 
            healthData={healthData} 
            onDeleteHealthEntry={onDeleteHealthEntry}
          />
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-6">
          <WeeklyView foodEntries={foodEntries} healthData={healthData} />
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-6">
          <MonthlyView foodEntries={foodEntries} healthData={healthData} />
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <TabularDataView foodEntries={foodEntries} healthData={healthData} />
        </TabsContent>
        
        <TabsContent value="pain" className="space-y-6">
          <PainTableView healthData={healthData} />
        </TabsContent>
        
        <TabsContent value="selector" className="space-y-6">
          <DailyDataSelector foodEntries={foodEntries} healthData={healthData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
