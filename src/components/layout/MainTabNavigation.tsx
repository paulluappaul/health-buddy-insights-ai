
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, BarChart3, Utensils, Shield, Settings } from 'lucide-react';

const MainTabNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-5 mb-8">
      <TabsTrigger value="track" className="flex items-center gap-2">
        <Utensils className="h-4 w-4" />
        <span className="hidden sm:inline">Food</span>
      </TabsTrigger>
      <TabsTrigger value="metrics" className="flex items-center gap-2">
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Metrics</span>
      </TabsTrigger>
      <TabsTrigger value="medications" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">Meds</span>
      </TabsTrigger>
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default MainTabNavigation;
