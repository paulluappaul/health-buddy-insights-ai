
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validateHealthValue } from '@/utils/healthDataProcessor';
import DateTimePicker from '@/components/common/DateTimePicker';

interface BloodPressureData {
  systolic: number;
  diastolic: number;
  timestamp: Date;
}

interface BloodPressureInputProps {
  onDataLogged: (data: BloodPressureData) => void;
}

const BloodPressureInput = ({ onDataLogged }: BloodPressureInputProps) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [systolicSlider, setSystolicSlider] = useState([120]);
  const [diastolicSlider, setDiastolicSlider] = useState([80]);
  const [useSliders, setUseSliders] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const handleSubmit = () => {
    const systolicValue = useSliders ? systolicSlider[0] : parseInt(systolic);
    const diastolicValue = useSliders ? diastolicSlider[0] : parseInt(diastolic);

    if (!systolicValue || !diastolicValue || systolicValue <= 0 || diastolicValue <= 0) {
      toast({
        title: "Missing Information",
        description: "Please enter valid blood pressure values greater than zero.",
        variant: "destructive"
      });
      return;
    }

    const bpData = { systolic: systolicValue, diastolic: diastolicValue };
    if (!validateHealthValue('bloodPressure', bpData)) {
      toast({
        title: "Invalid Values",
        description: "Please enter realistic blood pressure values (70-250/40-150 mmHg).",
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
      type: 'bloodPressure',
      systolic: systolicValue,
      diastolic: diastolicValue,
      timestamp: timestamp
    };

    onDataLogged(data);

    setSystolic('');
    setDiastolic('');
    setSystolicSlider([120]);
    setDiastolicSlider([80]);

    toast({
      title: "Blood Pressure Logged!",
      description: `${systolicValue}/${diastolicValue} mmHg recorded for ${timestamp.toLocaleString()}.`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
          <Activity className="h-5 w-5" />
          Blood Pressure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          label="Blood Pressure Measurement Time"
        />

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="use-sliders-bp"
            checked={useSliders}
            onChange={(e) => setUseSliders(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="use-sliders-bp" className="text-sm">Use sliders for easier input</Label>
        </div>

        {useSliders ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">
                Systolic: {systolicSlider[0]} mmHg
              </Label>
              <Slider
                value={systolicSlider}
                onValueChange={setSystolicSlider}
                max={200}
                min={80}
                step={5}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">
                Diastolic: {diastolicSlider[0]} mmHg
              </Label>
              <Slider
                value={diastolicSlider}
                onValueChange={setDiastolicSlider}
                max={120}
                min={50}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="systolic" className="text-sm text-gray-600">Systolic</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="text-center"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="diastolic" className="text-sm text-gray-600">Diastolic</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="text-center"
                min="1"
              />
            </div>
          </div>
        )}
        
        <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
          Log Blood Pressure
        </Button>
      </CardContent>
    </Card>
  );
};

export default BloodPressureInput;
