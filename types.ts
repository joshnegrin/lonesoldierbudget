// types.ts

// Simple string unions. The most basic and compatible way to define types.
export type TransactionType = 'Income' | 'Expense';
export type ExpenseCategory = 'Household' | 'Groceries' | 'Subscriptions' | 'Dining Out' | 'Travel' | 'Other';

// We export the values in a simple array for components to loop over.
export const ExpenseCategoryValues: ExpenseCategory[] = [
  'Household', 
  'Groceries', 
  'Subscriptions', 
  'Dining Out', 
  'Travel', 
  'Other'
];

// We export simple constants for direct comparison, to avoid typos.
export const TRANSACTION_TYPE_INCOME: TransactionType = 'Income';
export const TRANSACTION_TYPE_EXPENSE: TransactionType = 'Expense';


export interface Transaction {
  id: string;
  recurringId?: string;
  description: string;
  amount: number;
  type: TransactionType;
  category?: ExpenseCategory;
  date: string; // ISO string
}

export interface Budget {
    incomeGoal: number;
    savingsGoal: number;
    expenseBudgets: Record<ExpenseCategory, number>;
    recurring?: {
        incomeGoal?: boolean;
        savingsGoal?: boolean;
        expenseBudgets?: Partial<Record<ExpenseCategory, boolean>>;
    };
}
