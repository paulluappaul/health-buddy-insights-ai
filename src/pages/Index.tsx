
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import HeaderSection from '@/components/layout/HeaderSection';
import MainTabNavigation from '@/components/layout/MainTabNavigation';
import MainTabContent from '@/components/layout/MainTabContent';
import { useHealthBuddyData } from '@/hooks/useHealthBuddyData';

const Index = () => {
  const {
    foodEntries,
    healthData,
    medications,
    rawHealthData,
    handleFoodLogged,
    handleHealthDataLogged,
    handleMedicationLogged,
    handleDataImported
  } = useHealthBuddyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <HeaderSection />

        <Tabs defaultValue="track" className="w-full max-w-6xl mx-auto">
          <MainTabNavigation />
          <MainTabContent
            foodEntries={foodEntries}
            healthData={healthData}
            medications={medications}
            rawHealthData={rawHealthData}
            onFoodLogged={handleFoodLogged}
            onHealthDataLogged={handleHealthDataLogged}
            onMedicationLogged={handleMedicationLogged}
            onDataImported={handleDataImported}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
