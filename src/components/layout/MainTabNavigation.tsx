
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, BarChart3, Utensils, Shield, Settings } from 'lucide-react';

const MainTabNavigation = () => {
  return (
    <div className="w-full flex justify-center mb-8 px-2">
      <TabsList className="grid w-full max-w-2xl grid-cols-5 h-14 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg shadow-slate-900/5 rounded-2xl p-1">
        <TabsTrigger 
          value="track" 
          className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Utensils className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Food</span>
        </TabsTrigger>
        <TabsTrigger 
          value="metrics" 
          className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Metrics</span>
        </TabsTrigger>
        <TabsTrigger 
          value="medications" 
          className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Meds</span>
        </TabsTrigger>
        <TabsTrigger 
          value="dashboard" 
          className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default MainTabNavigation;
