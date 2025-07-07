
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface BloodPressureData {
  date: string;
  systolic: number;
  diastolic: number;
}

interface BloodPressureChartProps {
  data: BloodPressureData[];
}

const BloodPressureChart = ({ data }: BloodPressureChartProps) => {
  const avgSystolic = data.length > 0 
    ? Math.round(data.reduce((sum, entry) => sum + entry.systolic, 0) / data.length)
    : 0;
  const avgDiastolic = data.length > 0 
    ? Math.round(data.reduce((sum, entry) => sum + entry.diastolic, 0) / data.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Blood Pressure Tracking
        </CardTitle>
        <div className="text-sm text-gray-600">
          Average: {avgSystolic}/{avgDiastolic} mmHg
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} mmHg`, 
                name === 'systolic' ? 'Systolic' : 'Diastolic'
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#8B5CF6" 
              strokeWidth={2} 
              name="Systolic"
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#06B6D4" 
              strokeWidth={2} 
              name="Diastolic"
              dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BloodPressureChart;
