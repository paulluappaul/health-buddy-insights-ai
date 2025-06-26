
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
  const [weightSlider, setWeightSlider] = useState([70]);
  const [useSlider, setUseSlider] = useState(false);

  const handleSubmit = () => {
    const weightValue = useSlider ? weightSlider[0] : parseFloat(weight);

    if (!weightValue) {
      toast({
        title: "Missing Information",
        description: "Please enter your weight.",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (weightValue < 20 || weightValue > 300) {
      toast({
        title: "Invalid Value",
        description: "Please enter a realistic weight (20-300 kg).",
        variant: "destructive"
      });
      return;
    }

    onDataLogged({
      weight: weightValue,
      timestamp: new Date()
    });

    setWeight('');
    setWeightSlider([70]);

    toast({
      title: "Weight Logged!",
      description: `${weightValue} kg recorded successfully.`,
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
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="use-slider-weight"
            checked={useSlider}
            onChange={(e) => setUseSlider(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="use-slider-weight" className="text-sm">Use slider for easier input</Label>
        </div>

        {useSlider ? (
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Weight: {weightSlider[0]} kg
            </Label>
            <Slider
              value={weightSlider}
              onValueChange={setWeightSlider}
              max={150}
              min={30}
              step={0.5}
              className="w-full"
            />
          </div>
        ) : (
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
        )}
        
        <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
          Log Weight
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeightInput;
