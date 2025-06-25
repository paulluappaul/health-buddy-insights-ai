
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeightData {
  day: string;
  weight: number;
  date?: string;
}

interface EnhancedWeightChartProps {
  data: WeightData[];
}

const EnhancedWeightChart = ({ data }: EnhancedWeightChartProps) => {
  // Calculate trend
  const getTrend = () => {
    if (data.length < 2) return 'stable';
    const first = data[0].weight;
    const last = data[data.length - 1].weight;
    const diff = last - first;
    if (diff > 0.5) return 'increasing';
    if (diff < -0.5) return 'decreasing';
    return 'stable';
  };

  const trend = getTrend();
  const trendIcon = trend === 'increasing' ? TrendingUp : trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = trend === 'increasing' ? 'text-red-600' : trend === 'decreasing' ? 'text-green-600' : 'text-gray-600';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Day: ${label}`}</p>
          <p className="text-blue-600">
            <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            {`Weight: ${payload[0].value} kg`}
          </p>
        </div>
      );
    }
    return null;
  };

  const TrendIcon = trendIcon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Weight Progress
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm capitalize">{trend}</span>
          </div>
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
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3B82F6" 
              strokeWidth={3} 
              name="Weight (kg)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {data.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Latest: {data[data.length - 1]?.weight} kg</p>
            {data.length > 1 && (
              <p>Change: {(data[data.length - 1]?.weight - data[0]?.weight).toFixed(1)} kg</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedWeightChart;
