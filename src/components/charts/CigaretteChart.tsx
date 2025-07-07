
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cigarette } from 'lucide-react';

interface CigaretteData {
  date: string;
  cigarettes: number;
  smoked: boolean;
}

interface CigaretteChartProps {
  data: CigaretteData[];
  title: string;
}

const CigaretteChart = ({ data, title }: CigaretteChartProps) => {
  const totalCigarettes = data.reduce((sum, day) => sum + day.cigarettes, 0);
  const smokingDays = data.filter(day => day.smoked).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cigarette className="h-5 w-5 text-yellow-600" />
          {title}
        </CardTitle>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total: {totalCigarettes} cigarettes</span>
          <span>Smoking days: {smokingDays}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} cigarettes`, 'Cigarettes']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="cigarettes" 
              fill="#F59E0B" 
              name="Cigarettes"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CigaretteChart;
