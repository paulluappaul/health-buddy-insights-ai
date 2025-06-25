
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface MoodData {
  name: string;
  value: number;
}

interface MoodChartProps {
  data: MoodData[];
}

const MoodChart = ({ data }: MoodChartProps) => {
  const moodColors = {
    excellent: '#10B981',
    good: '#3B82F6',
    neutral: '#6B7280',
    tired: '#F59E0B',
    stressed: '#F97316',
    unwell: '#EF4444'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Weekly Mood Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={moodColors[entry.name.toLowerCase() as keyof typeof moodColors] || '#6B7280'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
