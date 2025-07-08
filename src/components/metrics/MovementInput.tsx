import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Footprints, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DateTimePicker from '@/components/common/DateTimePicker';

interface MovementData {
  movementLevel: string;
  timestamp: Date;
}

interface SportData {
  sport: boolean;
  timestamp: Date;
}

interface MovementInputProps {
  onDataLogged: (data: MovementData | SportData) => void;
}

const MovementInput = ({ onDataLogged }: MovementInputProps) => {
  const [movementLevel, setMovementLevel] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const handleMovementSubmit = () => {
    if (!movementLevel) {
      toast({
        title: "Missing Information",
        description: "Please select a movement level.",
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
      type: 'movement',
      movementLevel,
      timestamp: timestamp
    };

    onDataLogged(data);
    setMovementLevel('');

    toast({
      title: "Movement Logged!",
      description: `${movementLevel} recorded for ${timestamp.toLocaleString()}.`,
    });
  };

  const handleSportSubmit = () => {
    // Create proper timestamp from date and time
    const [hours, minutes] = selectedTime.split(':');
    const timestamp = new Date(selectedDate);
    timestamp.setHours(parseInt(hours), parseInt(minutes));

    const data = {
      id: Date.now().toString(),
      type: 'sport',
      sport: true,
      timestamp: timestamp
    };

    onDataLogged(data);

    toast({
      title: "Sport Activity Logged!",
      description: `Sport activity recorded for ${timestamp.toLocaleString()}.`,
    });
  };

  const movementOptions = [
    { value: 'mostly-laying', label: 'Mostly laying' },
    { value: 'sitting', label: 'Sitting' },
    { value: 'more-walking', label: 'More walking' }
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
            <Footprints className="h-5 w-5" />
            Movement Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateTimePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            label="Movement Entry Time"
          />

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Today's Movement Level</Label>
            <Select value={movementLevel} onValueChange={setMovementLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select movement level" />
              </SelectTrigger>
              <SelectContent>
                {movementOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleMovementSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Log Movement
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
            <Trophy className="h-5 w-5" />
            Sport Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSportSubmit} className="w-full bg-orange-600 hover:bg-orange-700">
            Log Sport Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementInput;