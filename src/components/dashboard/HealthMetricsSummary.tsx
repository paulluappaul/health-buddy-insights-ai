
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
  temperature?: number;
  temperatureUnit?: string;
  smoked?: boolean;
  cigaretteCount?: number;
}

interface HealthMetricsSummaryProps {
  todaysHealthData: HealthData[];
  onDeleteEntry?: (entryId: string) => void;
}

const HealthMetricsSummary = ({ todaysHealthData, onDeleteEntry }: HealthMetricsSummaryProps) => {
  const formatTemperature = (temp: number, unit: string) => {
    if (unit === 'fahrenheit') {
      return `${temp.toFixed(1)}°F`;
    }
    return `${temp.toFixed(1)}°C`;
  };

  const handleDeleteEntry = (entryId: string) => {
    if (onDeleteEntry) {
      onDeleteEntry(entryId);
      toast.success('Health entry deleted');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Today's Health Metrics  
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaysHealthData.length > 0 ? (
          <div className="space-y-3">
            {todaysHealthData.map((data, index) => (
              <div key={data.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Entry #{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(data.date).toLocaleTimeString()}
                    </span>
                    {onDeleteEntry && (
                      <Button
                        onClick={() => handleDeleteEntry(data.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {data.bloodPressure && data.bloodPressure.systolic > 0 && (
                    <span>BP: {data.bloodPressure.systolic}/{data.bloodPressure.diastolic}</span>
                  )}
                  {data.pulse && data.pulse > 0 && <span>Pulse: {data.pulse}</span>}
                  {data.mood && <span>Mood: {data.mood}</span>}
                  {data.weight && data.weight > 0 && <span>Weight: {data.weight}kg</span>}
                  {data.temperature && data.temperature > 0 && (
                    <span>Temp: {formatTemperature(data.temperature, data.temperatureUnit!)}</span>
                  )}
                  {data.smoked && (
                    <span>Smoked: {data.cigaretteCount || 0} cigarettes</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No health metrics logged today</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricsSummary;
