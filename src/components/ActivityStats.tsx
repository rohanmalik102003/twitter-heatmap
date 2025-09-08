'use client';

import React from 'react';
import { format } from 'date-fns';
import { ActivityStats as ActivityStatsType } from '@/types/twitter';
import { Calendar, Target, TrendingUp, BarChart3, Clock, Trophy } from 'lucide-react';

interface ActivityStatsProps {
  stats: ActivityStatsType;
  className?: string;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ stats, className = '' }) => {
  const formatMostActiveDay = (dateString: string): string => {
    if (!dateString) return 'No active days';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const statItems = [
    {
      icon: BarChart3,
      label: 'Total Tweets',
      value: stats.totalTweets.toLocaleString(),
      description: `${stats.activeDays} active days out of ${stats.totalDays}`
    },
    {
      icon: Trophy,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      description: 'Consecutive days with tweets'
    },
    {
      icon: Target,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      description: 'Active days leading up to today'
    },
    {
      icon: TrendingUp,
      label: 'Average per Day',
      value: stats.averagePerDay.toFixed(1),
      description: 'Tweets per day on average'
    },
    {
      icon: Calendar,
      label: 'Most Active Day',
      value: formatMostActiveDay(stats.mostActiveDay),
      description: 'Your most productive day'
    },
    {
      icon: Clock,
      label: 'Favorite Day of Week',
      value: stats.mostActiveDayOfWeek,
      description: 'Day you tweet the most'
    }
  ];

  const getStreakColor = (streak: number): string => {
    if (streak === 0) return 'text-gray-500';
    if (streak < 7) return 'text-yellow-600';
    if (streak < 30) return 'text-orange-600';
    return 'text-green-600';
  };

  const getActivityLevel = (): string => {
    const percentage = (stats.activeDays / stats.totalDays) * 100;
    if (percentage >= 80) return 'Very Active';
    if (percentage >= 60) return 'Active';
    if (percentage >= 40) return 'Moderate';
    if (percentage >= 20) return 'Light';
    return 'Minimal';
  };

  const getActivityColor = (): string => {
    const percentage = (stats.activeDays / stats.totalDays) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activity Statistics</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Activity Level</div>
          <div className={`text-lg font-semibold ${getActivityColor()}`}>
            {getActivityLevel()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((item, index) => {
          
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {item.label}
                  </div>
                  <div className={`text-lg font-bold ${
                    item.label.includes('Streak') 
                      ? getStreakColor(parseInt(item.value.split(' ')[0]) || 0)
                      : 'text-gray-900'
                  }`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {((stats.activeDays / stats.totalDays) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {stats.yearRange}
            </div>
            <div className="text-sm text-gray-600">Year Analyzed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(stats.totalTweets / 365)}
            </div>
            <div className="text-sm text-gray-600">Tweets per Day</div>
          </div>
        </div>
      </div>

      {/* Fun facts */}
      {stats.totalTweets > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fun Facts</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
               You've been tweeting for {stats.activeDays} days this year
            </div>
            {stats.longestStreak > 7 && (
              <div>
                 Your longest streak of {stats.longestStreak} days is impressive!
              </div>
            )}
            {stats.averagePerDay > 5 && (
              <div>
                 You're quite active with {stats.averagePerDay.toFixed(1)} tweets per day
              </div>
            )}
            <div>
               {stats.mostActiveDayOfWeek}s seem to be your favorite day to tweet
            </div>
          </div>
        </div>
      )}
    </div>
  );
};