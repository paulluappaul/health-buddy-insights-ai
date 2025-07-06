
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cigarette, Plus, Minus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DateTimePicker from '@/components/common/DateTimePicker';

interface SmokingInputProps {
  onDataLogged: (data: any) => void;
}

const SmokingInput = ({ onDataLogged }: SmokingInputProps) => {
  const [cigaretteCount, setCigaretteCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5));

  const handleAddCigarette = () => {
    setCigaretteCount(prev => prev + 1);
  };

  const handleRemoveCigarette = () => {
    if (cigaretteCount > 0) {
      setCigaretteCount(prev => prev - 1);
    }
  };

  const handleLogSmoking = () => {
    const timestamp = new Date(`${selectedDate}T${selectedTime}`);
    
    const smokingData = {
      type: 'smoking',
      smoked: cigaretteCount > 0,
      cigaretteCount: cigaretteCount,
      timestamp: timestamp
    };

    console.log('Logging smoking data:', smokingData);
    onDataLogged(smokingData);

    // Reset form
    setCigaretteCount(0);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedTime(new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5));

    toast({
      title: "Smoking Data Logged!",
      description: `Logged ${cigaretteCount} cigarette${cigaretteCount !== 1 ? 's' : ''}.`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <Cigarette className="h-5 w-5" />
          Smoking Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          label="When did you smoke?"
        />

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Number of cigarettes</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleRemoveCigarette}
                disabled={cigaretteCount === 0}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="bg-white rounded-lg px-6 py-4 min-w-[80px] text-center border-2 border-yellow-200">
                <span className="text-2xl font-bold text-yellow-700">{cigaretteCount}</span>
              </div>
              
              <Button
                onClick={handleAddCigarette}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleLogSmoking} 
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            disabled={cigaretteCount === 0}
          >
            Log Smoking Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmokingInput;
