
import React from 'react';
import FlexibleMetricsInput from '@/components/FlexibleMetricsInput';
import { MedicationEntry } from '@/components/medication/MedicationInput';

interface MetricsTabProps {
  onHealthDataLogged: (data: any) => void;
  onMedicationLogged: (medication: MedicationEntry) => void;
}

const MetricsTab = ({ onHealthDataLogged, onMedicationLogged }: MetricsTabProps) => {
  return (
    <div className="space-y-6">
      <FlexibleMetricsInput 
        onHealthDataLogged={onHealthDataLogged}
        onMedicationLogged={onMedicationLogged}
      />
    </div>
  );
};

export default MetricsTab;
