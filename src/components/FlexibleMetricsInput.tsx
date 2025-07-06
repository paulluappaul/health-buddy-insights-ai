
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BloodPressureInput from './metrics/BloodPressureInput';
import PulseInput from './metrics/PulseInput';
import WeightInput from './metrics/WeightInput';
import MoodInput from './metrics/MoodInput';
import TemperatureInput from './metrics/TemperatureInput';
import SmokingInput from './metrics/SmokingInput';
import MedicationInput, { MedicationEntry } from './medication/MedicationInput';
import { Activity, Heart, Scale, Smile, Shield, Thermometer, Cigarette } from 'lucide-react';

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
    console.log('Logging health data:', healthData);
    onHealthDataLogged(healthData);
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Track Your Health Metrics</h2>
        <p className="text-gray-600 text-sm sm:text-base">Log individual metrics as needed throughout your day</p>
      </div>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7 mb-6 h-auto">
          <TabsTrigger value="vitals" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Activity className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="pulse" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Heart className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Pulse</span>
          </TabsTrigger>
          <TabsTrigger value="weight" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Scale className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Weight</span>
          </TabsTrigger>
          <TabsTrigger value="temperature" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Thermometer className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Temp</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Smile className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="smoking" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Cigarette className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Smoking</span>
          </TabsTrigger>
          <TabsTrigger value="medication" className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3">
            <Shield className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Meds</span>
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

        <TabsContent value="temperature" className="space-y-4">
          <TemperatureInput 
            onDataLogged={(data) => handleMetricLogged('temperature', data)}
          />
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <MoodInput 
            onDataLogged={(data) => handleMetricLogged('mood', data)}
          />
        </TabsContent>

        <TabsContent value="smoking" className="space-y-4">
          <SmokingInput 
            onDataLogged={(data) => handleMetricLogged('smoking', data)}
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
