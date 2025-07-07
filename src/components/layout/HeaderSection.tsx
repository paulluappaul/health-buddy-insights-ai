
import React from 'react';

const HeaderSection = () => {
  return (
    <div className="text-center mb-8 px-4">
      <div className="relative">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3 tracking-tight">
          HealthBuddy
        </h1>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse hidden md:block"></div>
      </div>
      <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
        Your personal AI-powered health companion
      </p>
    </div>
  );
};

export default HeaderSection;
