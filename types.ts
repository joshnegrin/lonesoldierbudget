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

// This interface is now simplified to use an explicit object shape
// instead of the complex 'Record' utility type.
export interface Budget {
    incomeGoal: number;
    savingsGoal: number;
    expenseBudgets: {
        'Household': number;
        'Groceries': number;
        'Subscriptions': number;
        'Dining Out': number;
        'Travel': number;
        'Other': number;
    };
    recurring?: {
        incomeGoal?: boolean;
        savingsGoal?: boolean;
        expenseBudgets?: {
            'Household'?: boolean;
            'Groceries'?: boolean;
            'Subscriptions'?: boolean;
            'Dining Out'?: boolean;
            'Travel'?: boolean;
            'Other'?: boolean;
        };
    };
}
