
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WeightData {
  weight: number;
  timestamp: Date;
}

interface WeightInputProps {
  onDataLogged: (data: WeightData) => void;
}

const WeightInput = ({ onDataLogged }: WeightInputProps) => {
  const [weight, setWeight] = useState('');

  const handleSubmit = () => {
    if (!weight) {
      toast({
        title: "Missing Information",
        description: "Please enter your weight.",
        variant: "destructive"
      });
      return;
    }

    const weightNum = parseFloat(weight);

    // Validation
    if (weightNum < 20 || weightNum > 300) {
      toast({
        title: "Invalid Value",
        description: "Please enter a realistic weight (20-300 kg).",
        variant: "destructive"
      });
      return;
    }

    onDataLogged({
      weight: weightNum,
      timestamp: new Date()
    });

    setWeight('');

    toast({
      title: "Weight Logged!",
      description: `${weightNum} kg recorded successfully.`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
          <Scale className="h-5 w-5" />
          Weight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-sm text-gray-600">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="70.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="text-center"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
          Log Weight
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeightInput;
