'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface YearSelectorProps {
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  totalTweets: number;
  className?: string;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  availableYears,
  selectedYear,
  onYearChange,
  totalTweets,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleYearSelect = (year: number) => {
    onYearChange(year);
    setIsOpen(false);
  };

  if (availableYears.length <= 1) {
    // Show simplified year display for single year
    return (
      <div className={`inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium ${className}`}>
        <span>{selectedYear}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1.5 text-sm font-medium transition-colors min-w-[120px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedYear}</span>
        <ChevronDown 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[160px]">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Select Year
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`
                  w-full text-left px-4 py-2 text-sm transition-colors
                  ${selectedYear === year 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                role="option"
                aria-selected={selectedYear === year}
              >
                <div className="flex items-center justify-between">
                  <span>{year}</span>
                  {selectedYear === year && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};