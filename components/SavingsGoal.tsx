import React from 'react';
import { Budget } from '../types.ts';

interface SavingsGoalProps {
  budget: Budget;
  actualIncome: number;
  actualExpenses: number;
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({ budget, actualIncome, actualExpenses }) => {
  const currentSavings = actualIncome - actualExpenses;
  const { savingsGoal } = budget;

  const progress = savingsGoal > 0 ? Math.max(0, (currentSavings / savingsGoal) * 100) : 0;
  const progressClamped = Math.min(progress, 100);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress > 50) return 'bg-sky-500';
    return 'bg-sky-600';
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-sky-400">Monthly Savings Goal</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-gray-200">Current Savings:</span>
          <span className={`text-2xl font-bold ${currentSavings >= 0 ? 'text-white' : 'text-rose-400'}`}>{formatCurrency(currentSavings)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-gray-400">Goal:</span>
          <span className="font-semibold text-gray-400">{formatCurrency(savingsGoal)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progressClamped}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Savings goal progress"
          ></div>
        </div>
        <div className="text-right text-sm font-semibold text-gray-300">
          {progress.toFixed(0)}% Complete
        </div>
      </div>
    </div>
  );
};

export default SavingsGoal;
