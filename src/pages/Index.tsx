
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
    handleDataImported,
    handleDeleteHealthEntry,
    handleRemoveEntry
  } = useHealthBuddyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Modern background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-violet-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <HeaderSection />

        <Tabs defaultValue="track" className="w-full">
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
            onDeleteHealthEntry={handleDeleteHealthEntry}
            onRemoveEntry={handleRemoveEntry}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
