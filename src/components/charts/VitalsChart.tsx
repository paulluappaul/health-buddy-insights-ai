
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface VitalsData {
  day: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}

interface VitalsChartProps {
  data: VitalsData[];
}

const VitalsChart = ({ data }: VitalsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Vital Signs Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pulse" stroke="#EF4444" strokeWidth={2} name="Pulse (bpm)" />
            <Line type="monotone" dataKey="systolic" stroke="#8B5CF6" strokeWidth={2} name="Systolic BP" />
            <Line type="monotone" dataKey="diastolic" stroke="#06B6D4" strokeWidth={2} name="Diastolic BP" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VitalsChart;
