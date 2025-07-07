
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  colorClass: string;
}

const MetricCard = ({ icon: Icon, value, label, colorClass }: MetricCardProps) => {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${colorClass}`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl translate-x-4 -translate-y-4"></div>
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</span>
            <span className="text-xs font-medium text-white/90 leading-tight">{label}</span>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
