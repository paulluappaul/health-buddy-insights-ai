
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validateHealthValue } from '@/utils/healthDataProcessor';
import DateTimePicker from '@/components/common/DateTimePicker';

interface PulseData {
  pulse: number;
  timestamp: Date;
}

interface PulseInputProps {
  onDataLogged: (data: PulseData) => void;
}

const PulseInput = ({ onDataLogged }: PulseInputProps) => {
  const [pulse, setPulse] = useState('');
  const [pulseSlider, setPulseSlider] = useState([72]);
  const [useSlider, setUseSlider] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const handleSubmit = () => {
    const pulseValue = useSlider ? pulseSlider[0] : parseInt(pulse);

    if (!pulseValue || pulseValue <= 0) {
      toast({
        title: "Missing Information",
        description: "Please enter a valid pulse rate greater than zero.",
        variant: "destructive"
      });
      return;
    }

    if (!validateHealthValue('pulse', pulseValue)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a realistic pulse rate (30-220 bpm).",
        variant: "destructive"
      });
      return;
    }

    // Create proper timestamp from date and time
    const [hours, minutes] = selectedTime.split(':');
    const timestamp = new Date(selectedDate);
    timestamp.setHours(parseInt(hours), parseInt(minutes));

    const data = {
      id: Date.now().toString(),
      type: 'pulse',
      pulse: pulseValue,
      timestamp: timestamp
    };

    onDataLogged(data);

    setPulse('');
    setPulseSlider([72]);

    toast({
      title: "Pulse Logged!",
      description: `${pulseValue} bpm recorded for ${timestamp.toLocaleString()}.`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-red-50 border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-700 text-lg">
          <Heart className="h-5 w-5" />
          Pulse Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          label="Pulse Measurement Time"
        />

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="use-slider-pulse"
            checked={useSlider}
            onChange={(e) => setUseSlider(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="use-slider-pulse" className="text-sm">Use slider for easier input</Label>
        </div>

        {useSlider ? (
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Pulse: {pulseSlider[0]} bpm
            </Label>
            <Slider
              value={pulseSlider}
              onValueChange={setPulseSlider}
              max={200}
              min={40}
              step={5}
              className="w-full"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="pulse" className="text-sm text-gray-600">Pulse (bpm)</Label>
            <Input
              id="pulse"
              type="number"
              placeholder="72"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              className="text-center"
              min="1"
            />
          </div>
        )}
        
        <Button onClick={handleSubmit} className="w-full bg-pink-600 hover:bg-pink-700">
          Log Pulse
        </Button>
      </CardContent>
    </Card>
  );
};

export default PulseInput;
