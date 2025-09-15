import { Transaction, Budget } from '../types';

const TRANSACTIONS_KEY = 'budget-visualizer-transactions';
const BUDGETS_KEY = 'budget-visualizer-budgets';

export const storageService = {
  getTransactions: (): Transaction[] => {
    try {
      const transactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
      return transactionsJson ? JSON.parse(transactionsJson) : [];
    } catch (error) {
      console.error('Error loading transactions from local storage:', error);
      return [];
    }
  },
  saveTransactions: (transactions: Transaction[]) => {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions to local storage:', error);
    }
  },

  getBudgets: (): Record<string, Budget> => {
    try {
      const budgetsJson = localStorage.getItem(BUDGETS_KEY);
      return budgetsJson ? JSON.parse(budgetsJson) : {};
    } catch (error) {
      console.error('Error loading budgets from local storage:', error);
      return {};
    }
  },
  saveBudgets: (budgets: Record<string, Budget>) => {
    try {
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets to local storage:', error);
    }
  }
};
