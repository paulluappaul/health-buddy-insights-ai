
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface VitalsData {
  day: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}

interface EnhancedVitalsChartProps {
  data: VitalsData[];
}

const EnhancedVitalsChart = ({ data }: EnhancedVitalsChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Day: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {`${entry.name}: ${entry.value}${entry.dataKey === 'pulse' ? ' bpm' : ' mmHg'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-600" />
          Vital Signs Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#DC2626" 
              strokeWidth={2} 
              name="Systolic BP"
              dot={{ fill: '#DC2626', strokeWidth: 1, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#EF4444" 
              strokeWidth={2} 
              name="Diastolic BP"
              dot={{ fill: '#EF4444', strokeWidth: 1, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="pulse" 
              stroke="#EC4899" 
              strokeWidth={2} 
              name="Pulse Rate"
              dot={{ fill: '#EC4899', strokeWidth: 1, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-center">
          <div className="bg-red-50 p-2 rounded">
            <p className="text-red-600 font-medium">Systolic</p>
            <p className="text-gray-600">Latest: {data[data.length - 1]?.systolic || '--'} mmHg</p>
          </div>
          <div className="bg-pink-50 p-2 rounded">
            <p className="text-pink-600 font-medium">Diastolic</p>
            <p className="text-gray-600">Latest: {data[data.length - 1]?.diastolic || '--'} mmHg</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="text-purple-600 font-medium">Pulse</p>
            <p className="text-gray-600">Latest: {data[data.length - 1]?.pulse || '--'} bpm</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVitalsChart;
