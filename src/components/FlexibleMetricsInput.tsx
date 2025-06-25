
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BloodPressureInput from './metrics/BloodPressureInput';
import PulseInput from './metrics/PulseInput';
import WeightInput from './metrics/WeightInput';
import MoodInput from './metrics/MoodInput';
import MedicationInput, { MedicationEntry } from './medication/MedicationInput';
import { Activity, Heart, Scale, Smile, Shield } from 'lucide-react';

interface FlexibleMetricsInputProps {
  onHealthDataLogged: (data: any) => void;
  onMedicationLogged: (data: MedicationEntry) => void;
}

const FlexibleMetricsInput = ({ onHealthDataLogged, onMedicationLogged }: FlexibleMetricsInputProps) => {
  const handleMetricLogged = (type: string, data: any) => {
    const healthData = {
      id: Date.now().toString(),
      date: data.timestamp,
      type,
      ...data
    };
    onHealthDataLogged(healthData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Health Metrics</h2>
        <p className="text-gray-600">Log individual metrics as needed throughout your day</p>
      </div>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="vitals" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="pulse" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Pulse</span>
          </TabsTrigger>
          <TabsTrigger value="weight" className="flex items-center gap-1">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Weight</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-1">
            <Smile className="h-4 w-4" />
            <span className="hidden sm:inline">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="medication" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Meds</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <BloodPressureInput 
            onDataLogged={(data) => handleMetricLogged('bloodPressure', data)}
          />
        </TabsContent>

        <TabsContent value="pulse" className="space-y-4">
          <PulseInput 
            onDataLogged={(data) => handleMetricLogged('pulse', data)}
          />
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <WeightInput 
            onDataLogged={(data) => handleMetricLogged('weight', data)}
          />
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <MoodInput 
            onDataLogged={(data) => handleMetricLogged('mood', data)}
          />
        </TabsContent>

        <TabsContent value="medication" className="space-y-4">
          <MedicationInput onMedicationLogged={onMedicationLogged} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlexibleMetricsInput;
