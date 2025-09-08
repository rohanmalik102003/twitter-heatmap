'use client';

import React, { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import HeatmapCalendar from '@/components/HeatmapCalendar';
import { ActivityStats } from '@/components/ActivityStats';
import { YearSelector } from '@/components/YearSelector';
import { HeatmapData } from '@/types/twitter';
import { Github, Twitter, AlertCircle } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleDataProcessed = (processedData: HeatmapData) => {
    setData(processedData);
    setSelectedYear(processedData.year);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setData(null);
    setSelectedYear(null);
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setSelectedYear(null);
  };

  const handleYearChange = (year: number) => {
    if (data) {
      setSelectedYear(year);
    }
  };

  // Get current year data
  const currentYearData = data && selectedYear ? {
    activities: data.allYearActivities[selectedYear] || [],
    stats: data.allYearStats[selectedYear] || data.stats,
    year: selectedYear
  } : null;

  return (
    <div className="h-screen bg-gray-50 overflow-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg">
  <img 
    src="/new-2023-twitter-logo-x-icon-design_1017-45418.jpg" 
    alt="Twitter Logo" 
    className="w-10 h-10 rounded"
  />
</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                   X Heatmap
                </h1>
                <p className="text-sm text-gray-600">
                  Visualize your X activity with a GitHub-style contribution chart
                </p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!data ? (
          <FileUploader
            onDataProcessed={handleDataProcessed}
            onError={handleError}
          />
        ) : (
          <div className="space-y-8">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  X Activity for {selectedYear || data.year}
                </h2>
                {data.availableYears.length > 1 && (
                  <p className="text-sm text-gray-600">
                    Data available for {data.availableYears.length} years
                  </p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Upload Different Archive
              </button>
            </div>

            {/* Heatmap */}
            {currentYearData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Activity Heatmap
                    </h3>
                    <p className="text-sm text-gray-600">
                      Each square represents a day. Darker squares indicate more activity.
                    </p>
                  </div>
                  {/* Year selector in the top-right corner like GitHub */}
                  <div className="flex-shrink-0 ml-6">
                    <YearSelector
                      availableYears={data.availableYears}
                      selectedYear={selectedYear || data.year}
                      onYearChange={handleYearChange}
                      totalTweets={currentYearData?.stats.totalTweets || 0}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <HeatmapCalendar
                    activities={currentYearData.activities}
                    year={currentYearData.year}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Statistics */}
            {currentYearData && (
              <ActivityStats stats={currentYearData.stats} />
            )}

            
          </div>
        )}
      </main>

      
    </div>
  );
}