import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DateTimePicker from '@/components/common/DateTimePicker';

interface PainData {
  painLevel: number;
  notes: string;
  timestamp: Date;
}

interface PainInputProps {
  onDataLogged: (data: PainData) => void;
}

const PainInput = ({ onDataLogged }: PainInputProps) => {
  const [painLevel, setPainLevel] = useState([1]);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const handleSubmit = () => {
    // Create proper timestamp from date and time
    const [hours, minutes] = selectedTime.split(':');
    const timestamp = new Date(selectedDate);
    timestamp.setHours(parseInt(hours), parseInt(minutes));

    const data = {
      id: Date.now().toString(),
      type: 'pain',
      painLevel: painLevel[0],
      notes: notes.trim(),
      timestamp: timestamp
    };

    onDataLogged(data);

    setPainLevel([1]);
    setNotes('');

    toast({
      title: "Pain Entry Logged!",
      description: `Pain level ${painLevel[0]} recorded for ${timestamp.toLocaleString()}.`,
    });
  };

  const getPainLevelDescription = (level: number) => {
    if (level <= 2) return "Minimal pain";
    if (level <= 4) return "Mild pain";
    if (level <= 6) return "Moderate pain";
    if (level <= 8) return "Severe pain";
    return "Extreme pain";
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 2) return "text-green-600";
    if (level <= 4) return "text-yellow-600";
    if (level <= 6) return "text-orange-600";
    if (level <= 8) return "text-red-600";
    return "text-red-800";
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
          <Activity className="h-5 w-5" />
          Pain Diary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          label="Pain Entry Time"
        />

        <div>
          <Label className="text-sm text-gray-600 mb-2 block">
            Pain Level: {painLevel[0]} / 10
            <span className={`ml-2 font-medium ${getPainLevelColor(painLevel[0])}`}>
              ({getPainLevelDescription(painLevel[0])})
            </span>
          </Label>
          <Slider
            value={painLevel}
            onValueChange={setPainLevel}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 - No pain</span>
            <span>10 - Worst pain</span>
          </div>
        </div>

        <div>
          <Label htmlFor="pain-notes" className="text-sm text-gray-600">Notes (optional)</Label>
          <Textarea
            id="pain-notes"
            placeholder="Describe your pain, location, triggers, etc..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        
        <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
          Log Pain Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default PainInput;