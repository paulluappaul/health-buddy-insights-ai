
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PulseData {
  pulse: number;
  timestamp: Date;
}

interface PulseInputProps {
  onDataLogged: (data: PulseData) => void;
}

const PulseInput = ({ onDataLogged }: PulseInputProps) => {
  const [pulse, setPulse] = useState('');

  const handleSubmit = () => {
    if (!pulse) {
      toast({
        title: "Missing Information",
        description: "Please enter your pulse rate.",
        variant: "destructive"
      });
      return;
    }

    const pulseNum = parseInt(pulse);

    // Validation
    if (pulseNum < 30 || pulseNum > 220) {
      toast({
        title: "Invalid Value",
        description: "Please enter a realistic pulse rate (30-220 bpm).",
        variant: "destructive"
      });
      return;
    }

    onDataLogged({
      pulse: pulseNum,
      timestamp: new Date()
    });

    setPulse('');

    toast({
      title: "Pulse Logged!",
      description: `${pulseNum} bpm recorded successfully.`,
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
        <div>
          <Label htmlFor="pulse" className="text-sm text-gray-600">Pulse (bpm)</Label>
          <Input
            id="pulse"
            type="number"
            placeholder="72"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            className="text-center"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full bg-pink-600 hover:bg-pink-700">
          Log Pulse
        </Button>
      </CardContent>
    </Card>
  );
};

export default PulseInput;
