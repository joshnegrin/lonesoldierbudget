import React, { useState, useEffect, useMemo } from 'react';
import { Budget, ExpenseCategory } from '../types';

interface BudgetSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Budget) => void;
  initialBudget: Budget;
  previousBudget?: Budget;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
  

const BudgetSetup: React.FC<BudgetSetupProps> = ({ isOpen, onClose, onSave, initialBudget, previousBudget }) => {
  const [budget, setBudget] = useState<Omit<Budget, 'recurring'>>(initialBudget);
  const [recurring, setRecurring] = useState<NonNullable<Budget['recurring']>>({});

  useEffect(() => {
    if (isOpen) {
        const isInitialDefault = !initialBudget.recurring || Object.keys(initialBudget.recurring).length === 0;
        
        if (isInitialDefault && previousBudget?.recurring) {
            const newBudget: Omit<Budget, 'recurring'> = {
                incomeGoal: previousBudget.recurring.incomeGoal ? previousBudget.incomeGoal : initialBudget.incomeGoal,
                savingsGoal: previousBudget.recurring.savingsGoal ? previousBudget.savingsGoal : initialBudget.savingsGoal,
                expenseBudgets: { ...initialBudget.expenseBudgets }
            };

            if (previousBudget.recurring.expenseBudgets) {
                for (const cat of Object.keys(previousBudget.recurring.expenseBudgets)) {
                    if (previousBudget.recurring.expenseBudgets[cat as ExpenseCategory]) {
                        newBudget.expenseBudgets[cat as ExpenseCategory] = previousBudget.expenseBudgets[cat as ExpenseCategory];
                    }
                }
            }
            setBudget(newBudget);
            setRecurring(previousBudget.recurring);
        } else {
            setBudget(initialBudget);
            setRecurring(initialBudget.recurring || {});
        }
    }
  }, [isOpen, initialBudget, previousBudget]);

  const { totalExpenses, expensesPercent, savingsPercent, remainingAmount } = useMemo(() => {
    const totalExpenses = Object.values(budget.expenseBudgets).reduce((sum, amount) => sum + amount, 0);
    if (budget.incomeGoal <= 0) {
        return { totalExpenses, expensesPercent: 0, savingsPercent: 0, remainingAmount: 0 };
    }
    const expensesPercent = (totalExpenses / budget.incomeGoal) * 100;
    const savingsPercent = (budget.savingsGoal / budget.incomeGoal) * 100;
    const remainingAmount = budget.incomeGoal - totalExpenses - budget.savingsGoal;
    return { totalExpenses, expensesPercent, savingsPercent, remainingAmount };
  }, [budget]);

  const totalPercent = expensesPercent + savingsPercent;
  const remainingPercent = Math.max(0, 100 - totalPercent);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    
    if (name === 'incomeGoal' || name === 'savingsGoal') {
      setBudget(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setBudget(prev => ({
        ...prev,
        expenseBudgets: {
          ...prev.expenseBudgets,
          [name as ExpenseCategory]: numericValue,
        },
      }));
    }
  };

  const handleRecurringChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'incomeGoal' | 'savingsGoal' | ExpenseCategory) => {
    const { checked } = e.target;
    if (field === 'incomeGoal' || field === 'savingsGoal') {
        setRecurring(prev => ({...prev, [field]: checked }));
    } else {
        setRecurring(prev => ({
            ...prev,
            expenseBudgets: {
                ...prev.expenseBudgets,
                [field]: checked,
            }
        }))
    }
  };

  const handleSave = () => {
    onSave({ ...budget, recurring });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-setup-title"
    >
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl m-4">
        <div className="flex justify-between items-center mb-4">
            <h2 id="budget-setup-title" className="text-2xl font-semibold text-emerald-400">Setup Monthly Budget</h2>
            <button onClick={onClose} aria-label="Close budget setup modal" className="text-gray-400 hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Budget Feasibility</h3>
            <div className="flex h-4 w-full bg-gray-600 rounded-full overflow-hidden mb-2" role="meter" aria-valuenow={totalPercent} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-rose-500 transition-all duration-300" style={{ width: `${Math.min(expensesPercent, 100)}%` }} title="Expenses"></div>
                <div className="bg-yellow-500 transition-all duration-300" style={{ width: `${Math.min(savingsPercent, 100 - expensesPercent)}%` }} title="Savings"></div>
                <div className="bg-emerald-500 transition-all duration-300" style={{ width: `${remainingPercent}%` }} title="Remaining"></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-400">
                <span className="text-rose-400">Expenses: {formatCurrency(totalExpenses)}</span>
                <span className="text-yellow-400">Savings: {formatCurrency(budget.savingsGoal)}</span>
                <span className="text-emerald-400">Remaining: {formatCurrency(remainingAmount)}</span>
            </div>
             {remainingAmount < 0 && <p className="text-center text-rose-400 text-sm mt-2 font-semibold">Warning: Your expenses and savings goal exceed your income goal.</p>}
        </div>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-end space-x-2">
                    <div className="flex-grow">
                        <label htmlFor="incomeGoal" className="block text-sm font-medium text-gray-300 mb-1">Income Goal (₪)</label>
                        <input id="incomeGoal" name="incomeGoal" type="number" value={budget.incomeGoal} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500"/>
                    </div>
                    <div className="flex items-center pb-2 space-x-1" title="Set as recurring">
                        <input id="recurring-income" type="checkbox" checked={!!recurring.incomeGoal} onChange={(e) => handleRecurringChange(e, 'incomeGoal')} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-emerald-500 focus:ring-emerald-500"/>
                        <label htmlFor="recurring-income" className="text-xs text-gray-400 cursor-pointer">Recur</label>
                    </div>
                </div>
                <div className="flex items-end space-x-2">
                    <div className="flex-grow">
                        <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-300 mb-1">Savings Goal (₪)</label>
                        <input id="savingsGoal" name="savingsGoal" type="number" value={budget.savingsGoal} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500"/>
                    </div>
                     <div className="flex items-center pb-2 space-x-1" title="Set as recurring">
                        <input id="recurring-savings" type="checkbox" checked={!!recurring.savingsGoal} onChange={(e) => handleRecurringChange(e, 'savingsGoal')} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-emerald-500 focus:ring-emerald-500"/>
                        <label htmlFor="recurring-savings" className="text-xs text-gray-400 cursor-pointer">Recur</label>
                    </div>
                </div>
            </div>

            <div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Expense Budgets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {Object.values(ExpenseCategory).map(category => (
                    <div key={category} className="flex items-end space-x-2">
                        <div className="flex-grow">
                            <label htmlFor={category} className="block text-sm font-medium text-gray-300 mb-1">{category} (₪)</label>
                            <input id={category} name={category} type="number" value={budget.expenseBudgets[category] || ''} onChange={handleInputChange} className="w-full bg-gray-700 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500"/>
                        </div>
                        <div className="flex items-center pb-2 space-x-1" title={`Set ${category} as recurring`}>
                            <input id={`recurring-${category}`} type="checkbox" checked={!!recurring.expenseBudgets?.[category]} onChange={(e) => handleRecurringChange(e, category)} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-emerald-500 focus:ring-emerald-500"/>
                            <label htmlFor={`recurring-${category}`} className="text-xs text-gray-400 cursor-pointer">Recur</label>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition duration-300">Cancel</button>
            <button type="button" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md transition duration-300">Save Budget</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSetup;
