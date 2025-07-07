
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-200/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl translate-x-8 -translate-y-8"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white shadow-lg">
            <Cigarette className="h-5 w-5" />
          </div>
          <div>
            <span className="text-slate-900">{title}</span>
            <div className="flex gap-4 text-sm font-normal text-slate-600 mt-1">
              <span>Total: <span className="font-semibold text-amber-600">{totalCigarettes}</span> cigarettes</span>
              <span>Days: <span className="font-semibold text-orange-600">{smokingDays}</span></span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} cigarettes`, 'Cigarettes']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Bar 
              dataKey="cigarettes" 
              fill="url(#cigaretteGradient)"
              name="Cigarettes"
              radius={[6, 6, 0, 0]}
            />
            <defs>
              <linearGradient id="cigaretteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CigaretteChart;
