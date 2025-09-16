import React from 'react';
import { Transaction, Budget, TRANSACTION_TYPE_INCOME, TRANSACTION_TYPE_EXPENSE } from '../types.ts';

interface SummaryProps {
  transactions: Transaction[];
  budget: Budget;
}

const Summary: React.FC<SummaryProps> = ({ transactions, budget }) => {
  const totalIncome = transactions
    .filter(t => t.type === TRANSACTION_TYPE_INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === TRANSACTION_TYPE_EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
  };
  
  const totalBudgetedExpenses = Object.values(budget.expenseBudgets).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Income</h3>
        <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
        <p className="text-sm text-gray-500 mt-1">Budgeted: {formatCurrency(budget.incomeGoal)}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Expenses</h3>
        <p className="text-3xl font-bold text-rose-400">{formatCurrency(totalExpenses)}</p>
        <p className="text-sm text-gray-500 mt-1">Budgeted: {formatCurrency(totalBudgetedExpenses)}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Actual Balance</h3>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-100' : 'text-rose-500'}`}>
          {formatCurrency(balance)}
        </p>
         <p className="text-sm text-gray-500 mt-1 invisible">Placeholder</p>
      </div>
    </div>
  );
};

export default Summary;
