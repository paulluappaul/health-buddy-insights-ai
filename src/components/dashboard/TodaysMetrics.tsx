
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
        colorClass="from-orange-50 to-red-50 border-orange-200 text-orange-700"
      />
      <MetricCard
        icon={Scale}
        value={latestWeight ? latestWeight.toFixed(1) : '--'}
        label="Latest Weight (kg)"
        colorClass="from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
      />
      <MetricCard
        icon={Heart}
        value={latestPulse || '--'}
        label="Latest Pulse (bpm)"
        colorClass="from-pink-50 to-red-50 border-pink-200 text-pink-700"
      />
      <MetricCard
        icon={Thermometer}
        value={latestTemperature ? formatTemperature(latestTemperature.temperature, latestTemperature.temperatureUnit) : '--'}
        label="Latest Temperature"
        colorClass="from-red-50 to-orange-50 border-red-200 text-red-700"
      />
      <MetricCard
        icon={Calendar}
        value={todaysHealthDataCount}
        label="Health Entries"
        colorClass="from-green-50 to-emerald-50 border-green-200 text-green-700"
      />
    </div>
  );
};

export default TodaysMetrics;
