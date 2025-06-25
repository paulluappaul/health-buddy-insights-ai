
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Activity, Smile, Weight, Cigarette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HealthData {
  id: string;
  date: Date;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  pulse: number;
  mood: string;
  weight: number;
  smoked: boolean;
  cigaretteCount?: number;
}

const HealthMetrics = ({ onMetricsLogged }: { onMetricsLogged: (data: HealthData) => void }) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [mood, setMood] = useState('');
  const [weight, setWeight] = useState('');
  const [smoked, setSmoked] = useState(false);
  const [cigaretteCount, setCigaretteCount] = useState('');

  const moodOptions = [
    { value: 'excellent', label: '😄 Excellent', color: 'text-green-600' },
    { value: 'good', label: '😊 Good', color: 'text-blue-600' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-600' },
    { value: 'tired', label: '😴 Tired', color: 'text-yellow-600' },
    { value: 'stressed', label: '😰 Stressed', color: 'text-orange-600' },
    { value: 'unwell', label: '😷 Unwell', color: 'text-red-600' }
  ];

  const handleSubmit = () => {
    if (!systolic || !diastolic || !pulse || !mood || !weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const healthData: HealthData = {
      id: Date.now().toString(),
      date: new Date(),
      bloodPressure: {
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic)
      },
      pulse: parseInt(pulse),
      mood,
      weight: parseFloat(weight),
      smoked,
      cigaretteCount: smoked && cigaretteCount ? parseInt(cigaretteCount) : undefined
    };

    onMetricsLogged(healthData);
    
    // Reset form
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setMood('');
    setWeight('');
    setSmoked(false);
    setCigaretteCount('');

    toast({
      title: "Health Metrics Logged!",
      description: "Your daily health data has been saved successfully.",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Heart className="h-5 w-5" />
          Daily Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Blood Pressure */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="h-4 w-4 text-red-500" />
            Blood Pressure (mmHg)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="systolic" className="text-xs text-gray-600">Systolic</Label>
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
              <Label htmlFor="diastolic" className="text-xs text-gray-600">Diastolic</Label>
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
        </div>

        {/* Pulse */}
        <div className="space-y-2">
          <Label htmlFor="pulse" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            Pulse (bpm)
          </Label>
          <Input
            id="pulse"
            type="number"
            placeholder="72"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            className="text-center"
          />
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Smile className="h-4 w-4 text-yellow-500" />
            How do you feel today?
          </Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent>
              {moodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className={option.color}>{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Weight className="h-4 w-4 text-blue-500" />
            Weight (kg)
          </Label>
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

        {/* Smoking */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Cigarette className="h-4 w-4 text-gray-600" />
            Smoking
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smoked"
              checked={smoked}
              onCheckedChange={(checked) => setSmoked(checked === true)}
            />
            <Label htmlFor="smoked" className="text-sm text-gray-600">
              Did you smoke today?
            </Label>
          </div>
          {smoked && (
            <div className="ml-6">
              <Label htmlFor="cigarettes" className="text-xs text-gray-600">How many cigarettes?</Label>
              <Input
                id="cigarettes"
                type="number"
                placeholder="0"
                value={cigaretteCount}
                onChange={(e) => setCigaretteCount(e.target.value)}
                className="w-24 text-center"
              />
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
          Log Today's Metrics
        </Button>
      </CardContent>
    </Card>
  );
};

export default HealthMetrics;
