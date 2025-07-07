
import React from 'react';
import { Target, Scale, Heart, Calendar, Thermometer } from 'lucide-react';
import MetricCard from './MetricCard';

interface TodaysMetricsProps {
  todayCalories: number;
  latestWeight?: number;
  latestPulse?: number;
  latestTemperature?: {
    temperature: number;
    temperatureUnit: string;
  };
  todaysHealthDataCount: number;
}

const TodaysMetrics = ({
  todayCalories,
  latestWeight,
  latestPulse,
  latestTemperature,
  todaysHealthDataCount
}: TodaysMetricsProps) => {
  const formatTemperature = (temp: number, unit: string) => {
    if (unit === 'fahrenheit') {
      return `${temp.toFixed(1)}°F`;
    }
    return `${temp.toFixed(1)}°C`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        icon={Target}
        value={todayCalories}
        label="Today's Calories"
        colorClass="bg-gradient-to-br from-orange-500 to-red-500"
      />
      <MetricCard
        icon={Scale}
        value={latestWeight ? latestWeight.toFixed(1) : '--'}
        label="Latest Weight (kg)"
        colorClass="bg-gradient-to-br from-blue-500 to-indigo-600"
      />
      <MetricCard
        icon={Heart}
        value={latestPulse || '--'}
        label="Latest Pulse (bpm)"
        colorClass="bg-gradient-to-br from-pink-500 to-rose-600"
      />
      <MetricCard
        icon={Thermometer}
        value={latestTemperature ? formatTemperature(latestTemperature.temperature, latestTemperature.temperatureUnit) : '--'}
        label="Latest Temperature"
        colorClass="bg-gradient-to-br from-red-500 to-orange-500"
      />
      <MetricCard
        icon={Calendar}
        value={todaysHealthDataCount}
        label="Health Entries"
        colorClass="bg-gradient-to-br from-emerald-500 to-teal-600"
      />
    </div>
  );
};

export default TodaysMetrics;
