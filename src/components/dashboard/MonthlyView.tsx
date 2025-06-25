
import React from 'react';
import { Card } from '@/components/ui/card';

const MonthlyView = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Monthly Health Analysis</h3>
          <p className="text-gray-600">
            Comprehensive monthly trends and detailed analysis will be available once you have more data logged.
            Keep tracking your daily metrics to unlock detailed monthly insights, correlations, and personalized health recommendations!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyView;
