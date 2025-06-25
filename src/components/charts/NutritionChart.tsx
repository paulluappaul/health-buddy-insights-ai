
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface NutritionData {
  day: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface NutritionChartProps {
  data: NutritionData[];
}

const NutritionChart = ({ data }: NutritionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Weekly Nutrition Trends
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
            <Line type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} name="Calories" />
            <Line type="monotone" dataKey="carbs" stroke="#3B82F6" strokeWidth={2} name="Carbs (g)" />
            <Line type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={2} name="Protein (g)" />
            <Line type="monotone" dataKey="fat" stroke="#8B5CF6" strokeWidth={2} name="Fat (g)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NutritionChart;
