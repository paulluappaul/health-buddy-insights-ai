
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyView from './dashboard/DailyView';
import WeeklyView from './dashboard/WeeklyView';
import MonthlyView from './dashboard/MonthlyView';
import TabularDataView from './data/TabularDataView';
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
}

interface DashboardProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const Dashboard = ({ foodEntries, healthData }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="selector">Daily Selector</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          <DailyView foodEntries={foodEntries} healthData={healthData} />
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
        
        <TabsContent value="selector" className="space-y-6">
          <DailyDataSelector foodEntries={foodEntries} healthData={healthData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
