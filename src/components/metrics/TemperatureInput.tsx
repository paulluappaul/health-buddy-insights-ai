
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Thermometer, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TemperatureInputProps {
  onDataLogged: (data: any) => void;
}

const TemperatureInput = ({ onDataLogged }: TemperatureInputProps) => {
  const [temperature, setTemperature] = useState('');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue) || tempValue < 30 || tempValue > 45) {
      toast({
        title: "Invalid Temperature",
        description: "Please enter a valid body temperature between 30-45°C or 86-113°F",
        variant: "destructive"
      });
      return;
    }

    // Convert to Celsius for storage consistency
    const tempInCelsius = unit === 'fahrenheit' 
      ? (tempValue - 32) * 5/9 
      : tempValue;

    const data = {
      temperature: tempInCelsius,
      unit: 'celsius',
      originalValue: tempValue,
      originalUnit: unit,
      timestamp: new Date()
    };

    console.log('Temperature logged:', data);
    onDataLogged(data);
    
    toast({
      title: "Temperature Recorded",
      description: `${tempValue}°${unit.charAt(0).toUpperCase()} logged successfully`,
    });
    
    setTemperature('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          Body Temperature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              step="0.1"
              min={unit === 'celsius' ? '30' : '86'}
              max={unit === 'celsius' ? '45' : '113'}
              className="flex-1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'celsius' | 'fahrenheit')}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="celsius">°C</option>
              <option value="fahrenheit">°F</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={!temperature.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Log Temperature
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TemperatureInput;
