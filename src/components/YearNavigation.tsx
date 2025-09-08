'use client';

import React from 'react';

interface YearNavigationProps {
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  yearStats: Record<number, { totalTweets: number; activeDays: number }>;
  className?: string;
}

export const YearNavigation: React.FC<YearNavigationProps> = ({
  availableYears,
  selectedYear,
  onYearChange,
  yearStats,
  className = ''
}) => {
  if (availableYears.length <= 1) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Years</h3>
      <div className="space-y-1">
        {availableYears.map((year) => {
          const stats = yearStats[year];
          const isSelected = year === selectedYear;
          
          return (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{year}</span>
                {isSelected && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              {stats && (
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalTweets.toLocaleString()} tweets
                  {stats.activeDays > 0 && (
                    <span className="ml-1">• {stats.activeDays} active days</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Total: {availableYears.reduce((total, year) => 
            total + (yearStats[year]?.totalTweets || 0), 0
          ).toLocaleString()} tweets across {availableYears.length} years
        </div>
      </div>
    </div>
  );
};