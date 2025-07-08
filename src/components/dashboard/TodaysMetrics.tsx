
import React from 'react';
import { Target, Scale, Heart, Calendar, Thermometer, Cigarette, Activity, Footprints, Trophy } from 'lucide-react';
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
  todayCigarettes: number;
  latestPainLevel?: number;
  latestMovementLevel?: string;
  sportActivities: number;
}

const TodaysMetrics = ({
  todayCalories,
  latestWeight,
  latestPulse,
  latestTemperature,
  todaysHealthDataCount,
  todayCigarettes,
  latestPainLevel,
  latestMovementLevel,
  sportActivities
}: TodaysMetricsProps) => {
  const formatTemperature = (temp: number, unit: string) => {
    if (unit === 'fahrenheit') {
      return `${temp.toFixed(1)}°F`;
    }
    return `${temp.toFixed(1)}°C`;
  };

  const formatMovementLevel = (level: string) => {
    switch (level) {
      case 'mostly-laying': return 'Mostly laying';
      case 'sitting': return 'Sitting';
      case 'more-walking': return 'More walking';
      default: return level;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9 gap-4">
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
      <MetricCard
        icon={Cigarette}
        value={todayCigarettes}
        label="Today's Cigarettes"
        colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
      />
      <MetricCard
        icon={Activity}
        value={latestPainLevel ? `${latestPainLevel}/10` : '--'}
        label="Latest Pain Level"
        colorClass="bg-gradient-to-br from-red-500 to-pink-600"
      />
      <MetricCard
        icon={Footprints}
        value={latestMovementLevel ? formatMovementLevel(latestMovementLevel) : '--'}
        label="Movement Level"
        colorClass="bg-gradient-to-br from-green-500 to-emerald-600"
      />
      <MetricCard
        icon={Trophy}
        value={sportActivities}
        label="Sport Activities"
        colorClass="bg-gradient-to-br from-purple-500 to-violet-600"
      />
    </div>
  );
};

export default TodaysMetrics;
