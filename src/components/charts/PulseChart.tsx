
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-red-50/50 to-pink-50/50 border-red-200/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full blur-2xl translate-x-8 -translate-y-8"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white shadow-lg">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-slate-900">Pulse Tracking</span>
            <div className="text-sm font-normal text-slate-600 mt-1">
              Average: <span className="font-semibold text-red-600">{avgPulse} bpm</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']} 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} bpm`, 'Pulse']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="pulse" 
              stroke="url(#pulseGradient)" 
              strokeWidth={3} 
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 5, stroke: '#fff' }}
              activeDot={{ r: 7, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
              name="Pulse (bpm)"
            />
            <defs>
              <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F87171" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PulseChart;
