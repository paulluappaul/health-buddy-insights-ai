
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smile } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MoodData {
  mood: string;
  timestamp: Date;
}

interface MoodInputProps {
  onDataLogged: (data: MoodData) => void;
}

const MoodInput = ({ onDataLogged }: MoodInputProps) => {
  const [mood, setMood] = useState('');

  const moodOptions = [
    { value: 'excellent', label: '😄 Excellent', color: 'text-green-600' },
    { value: 'good', label: '😊 Good', color: 'text-blue-600' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-600' },
    { value: 'tired', label: '😴 Tired', color: 'text-yellow-600' },
    { value: 'stressed', label: '😰 Stressed', color: 'text-orange-600' },
    { value: 'unwell', label: '😷 Unwell', color: 'text-red-600' }
  ];

  const handleSubmit = () => {
    if (!mood) {
      toast({
        title: "Missing Information",
        description: "Please select your mood.",
        variant: "destructive"
      });
      return;
    }

    onDataLogged({
      mood,
      timestamp: new Date()
    });

    setMood('');

    const selectedMood = moodOptions.find(option => option.value === mood);
    toast({
      title: "Mood Logged!",
      description: `${selectedMood?.label} recorded successfully.`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700 text-lg">
          <Smile className="h-5 w-5" />
          Mood
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={mood} onValueChange={setMood}>
          <SelectTrigger>
            <SelectValue placeholder="How do you feel?" />
          </SelectTrigger>
          <SelectContent>
            {moodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} className="w-full bg-yellow-600 hover:bg-yellow-700">
          Log Mood
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodInput;
