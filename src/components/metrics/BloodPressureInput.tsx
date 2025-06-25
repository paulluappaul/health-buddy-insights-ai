
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const handleSubmit = () => {
    if (!systolic || !diastolic) {
      toast({
        title: "Missing Information",
        description: "Please fill in both systolic and diastolic values.",
        variant: "destructive"
      });
      return;
    }

    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);

    // Validation
    if (systolicNum < 70 || systolicNum > 250 || diastolicNum < 40 || diastolicNum > 150) {
      toast({
        title: "Invalid Values",
        description: "Please enter realistic blood pressure values.",
        variant: "destructive"
      });
      return;
    }

    onDataLogged({
      systolic: systolicNum,
      diastolic: diastolicNum,
      timestamp: new Date()
    });

    setSystolic('');
    setDiastolic('');

    toast({
      title: "Blood Pressure Logged!",
      description: `${systolicNum}/${diastolicNum} mmHg recorded successfully.`,
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
            />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
          Log Blood Pressure
        </Button>
      </CardContent>
    </Card>
  );
};

export default BloodPressureInput;
