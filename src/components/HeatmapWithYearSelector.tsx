'use client';

import React from 'react';
import { HeatmapCalendar } from './HeatmapCalendar';
import { YearSelector } from './YearSelector';
import { DailyActivity } from '@/types/twitter';

interface HeatmapWithYearSelectorProps {
  activities: DailyActivity[];
  year: number;
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  totalTweets: number;
  className?: string;
}

export const HeatmapWithYearSelector: React.FC<HeatmapWithYearSelectorProps> = ({
  activities,
  year,
  availableYears,
  selectedYear,
  onYearChange,
  totalTweets,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 relative ${className}`}>
      {/* Year selector positioned like GitHub - top right */}
      <div className="absolute top-4 right-4 z-10">
        <YearSelector
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          totalTweets={totalTweets}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Activity Heatmap
        </h3>
        <p className="text-sm text-gray-600">
          Each square represents a day. Darker squares indicate more activity.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <HeatmapCalendar
          activities={activities}
          year={year}
          className="min-w-full"
        />
      </div>
    </div>
  );
};