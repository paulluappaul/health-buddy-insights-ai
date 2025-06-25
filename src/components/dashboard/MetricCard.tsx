
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
    <Card className={`bg-gradient-to-br ${colorClass}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Icon className="h-8 w-8" />
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
