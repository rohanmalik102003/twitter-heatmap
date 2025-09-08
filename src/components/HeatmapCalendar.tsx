'use client';
'use client';

import React, { useMemo, useState } from 'react';
import { format, startOfWeek, getWeek, getMonth } from 'date-fns';
import { CalendarDay, DailyActivity } from '@/types/twitter';
import { TwitterDataParser } from '@/lib/twitter-parser';

interface HeatmapCalendarProps {
  activities: DailyActivity[];
  year: number;
  className?: string;
  isLoading?: boolean;
}

interface TooltipData {
  date: string;
  count: number;
  x: number;
  y: number;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ 
  activities, 
  year, 
  className = '',
  isLoading = false
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const parser = new TwitterDataParser();

  const calendarData = useMemo(() => {
    return parser.generateCalendarData(activities);
  }, [activities, parser]);

  const { weeks, monthLabels } = useMemo(() => {
    const weeks: CalendarDay[][] = [];
    const monthLabels: { label: string; weekIndex: number }[] = [];
    
    let currentWeek: CalendarDay[] = [];
    let lastMonth = -1;
    
    // Start from the first day of the year
    const firstDay = new Date(year, 0, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Fill empty days at the beginning of the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        count: 0,
        level: 0,
        tweets: []
      });
    }
    
    calendarData.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      const month = getMonth(date);
      
      // Add month label when month changes
      if (month !== lastMonth) {
        monthLabels.push({
          label: format(date, 'MMM'),
          weekIndex: weeks.length
        });
        lastMonth = month;
      }
      
      // Start new week on Sunday (except for the very first week)
      if (dayOfWeek === 0 && currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      // Complete the last week
      if (index === calendarData.length - 1) {
        // Fill remaining days of the week
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: '',
            count: 0,
            level: 0,
            tweets: []
          });
        }
        weeks.push(currentWeek);
      }
    });
    
    return { weeks, monthLabels };
  }, [calendarData, year]);

  const getColorClass = (level: number): string => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-700';
      default: return 'bg-gray-100';
    }
  };

  const handleMouseEnter = (day: CalendarDay, event: React.MouseEvent) => {
    if (day.date) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        date: day.date,
        count: day.count,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className={`relative animate-pulse ${className}`}>
        <div className="flex mb-2 ml-8">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="w-6 h-3 bg-gray-200 rounded mr-2" />
          ))}
        </div>
        <div className="flex">
          <div className="flex flex-col mr-2">
            {dayLabels.map((_, index) => (
              <div key={index} className="w-8 h-3 bg-gray-200 rounded mb-1" />
            ))}
          </div>
          <div className="grid grid-cols-53 gap-1">
            {Array.from({ length: 371 }, (_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} id="heatmap-calendar">
      {/* Container for the entire calendar */}
      <div className="overflow-visible">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="flex text-xs text-gray-600 font-medium mb-2 pl-8">
            {monthLabels.map((month, index) => {
              const nextMonth = monthLabels[index + 1];
              const widthInWeeks = nextMonth ? 
                nextMonth.weekIndex - month.weekIndex : 
                weeks.length - month.weekIndex;
              return (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{ width: `${widthInWeeks * 16}px` }}
                >
                  {month.label}
                </div>
              );
            })}
          </div>

          {/* Calendar content */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2 flex-shrink-0">
              {dayLabels.map((day, index) => (
                <div
                  key={day}
                  className={`text-xs text-gray-600 h-3 flex items-center justify-end w-6 ${
                    index % 2 === 1 ? 'visible' : 'invisible'
                  }`}
                  style={{ marginBottom: '2px' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col mr-1 flex-shrink-0">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                        w-3 h-3 mb-1 rounded-sm cursor-pointer transition-all duration-200
                        ${day.date ? getColorClass(day.level) : 'bg-transparent'}
                        ${day.date ? 'hover:ring-2 hover:ring-gray-400 hover:ring-opacity-50' : ''}
                      `}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                      title={day.date ? `${day.count} tweets on ${format(new Date(day.date), 'MMM dd, yyyy')}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <div className="font-medium">
            {tooltip.count} tweet{tooltip.count !== 1 ? 's' : ''}
          </div>
          <div className="text-gray-300">
            {format(new Date(tooltip.date), 'MMM dd, yyyy')}
          </div>
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #1f2937'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HeatmapCalendar;
