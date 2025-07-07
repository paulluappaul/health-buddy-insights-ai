
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays, Search } from 'lucide-react';

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

interface DailyDataSelectorProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const DailyDataSelector = ({ foodEntries, healthData }: DailyDataSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedDateData = {
    food: foodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === selectedDate;
    }),
    health: healthData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === selectedDate;
    })
  };

  const totalCalories = selectedDateData.food.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
  const totalCarbs = selectedDateData.food.reduce((sum, entry) => sum + entry.nutrition.carbs, 0);
  const totalProtein = selectedDateData.food.reduce((sum, entry) => sum + entry.nutrition.protein, 0);
  const totalFat = selectedDateData.food.reduce((sum, entry) => sum + entry.nutrition.fat, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          Daily Data Viewer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            variant="outline"
            size="sm"
          >
            Today
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Food Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Food & Nutrition</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Calories:</span>
                <span className="font-medium">{totalCalories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbohydrates:</span>
                <span className="font-medium">{totalCarbs.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protein:</span>
                <span className="font-medium">{totalProtein.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fat:</span>
                <span className="font-medium">{totalFat.toFixed(1)}g</span>
              </div>
            </div>
            
            {selectedDateData.food.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Food Entries:</h4>
                {selectedDateData.food.map((entry, index) => (
                  <div key={entry.id} className="text-sm bg-gray-50 p-2 rounded">
                    <span className="font-medium">{index + 1}.</span> {entry.text}
                    <span className="text-gray-600 ml-2">({entry.nutrition.calories} kcal)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No food entries for this date</p>
            )}
          </div>

          {/* Health Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Health Metrics</h3>
            <div className="space-y-2">
              {selectedDateData.health.map((entry, index) => (
                <div key={`${entry.id}-${index}`} className="bg-gray-50 p-3 rounded space-y-1">
                  <div className="text-sm font-medium text-gray-700">
                    Entry {index + 1} - {new Date(entry.date).toLocaleTimeString()}
                  </div>
                  
                  {entry.bloodPressure && entry.bloodPressure.systolic > 0 && (
                    <div className="text-sm flex justify-between">
                      <span>Blood Pressure:</span>
                      <span>{entry.bloodPressure.systolic}/{entry.bloodPressure.diastolic} mmHg</span>
                    </div>
                  )}
                  
                  {entry.pulse && entry.pulse > 0 && (
                    <div className="text-sm flex justify-between">
                      <span>Pulse:</span>
                      <span>{entry.pulse} bpm</span>
                    </div>
                  )}
                  
                  {entry.weight && entry.weight > 0 && (
                    <div className="text-sm flex justify-between">
                      <span>Weight:</span>
                      <span>{entry.weight.toFixed(1)} kg</span>
                    </div>
                  )}
                  
                  {entry.temperature && entry.temperature > 0 && (
                    <div className="text-sm flex justify-between">
                      <span>Temperature:</span>
                      <span>{entry.temperature.toFixed(1)}°{entry.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}</span>
                    </div>
                  )}
                  
                  {entry.mood && entry.mood !== '' && (
                    <div className="text-sm flex justify-between">
                      <span>Mood:</span>
                      <span className="capitalize">{entry.mood}</span>
                    </div>
                  )}
                  
                  {entry.smoked !== undefined && (
                    <div className="text-sm flex justify-between">
                      <span>Smoking:</span>
                      <span>{entry.smoked ? `${entry.cigaretteCount || 0} cigarettes` : 'No smoking'}</span>
                    </div>
                  )}
                </div>
              ))}
              
              {selectedDateData.health.length === 0 && (
                <p className="text-gray-500 text-sm">No health entries for this date</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyDataSelector;
