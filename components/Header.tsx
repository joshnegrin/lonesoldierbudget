
import React from 'react';

interface HeaderProps {
  currentDate: Date;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onMonthChange }) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <header className="mb-8 p-4 bg-gray-800/50 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-wider mb-4 sm:mb-0">
        Monthly Budget Visualizer
      </h1>
      <div className="flex items-center space-x-4 bg-gray-700 p-2 rounded-lg">
        <button 
          onClick={() => onMonthChange('prev')} 
          className="p-2 rounded-md hover:bg-emerald-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold w-36 text-center tabular-nums">{monthName} {year}</span>
        <button 
          onClick={() => onMonthChange('next')} 
          className="p-2 rounded-md hover:bg-emerald-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
