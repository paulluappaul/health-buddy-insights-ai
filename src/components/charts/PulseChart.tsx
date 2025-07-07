
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface PulseData {
  date: string;
  pulse: number;
}

interface PulseChartProps {
  data: PulseData[];
}

const PulseChart = ({ data }: PulseChartProps) => {
  const avgPulse = data.length > 0 
    ? Math.round(data.reduce((sum, entry) => sum + entry.pulse, 0) / data.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Pulse Tracking
        </CardTitle>
        <div className="text-sm text-gray-600">
          Average: {avgPulse} bpm
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              formatter={(value: number) => [`${value} bpm`, 'Pulse']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="pulse" 
              stroke="#EF4444" 
              strokeWidth={2} 
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              name="Pulse (bpm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PulseChart;
