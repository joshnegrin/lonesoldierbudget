
export const TransactionType = {
  Income: 'INCOME',
  Expense: 'EXPENSE',
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const ExpenseCategory = {
  Groceries: 'Groceries',
  Utilities: 'Utilities',
  Rent: 'Rent',
  Transportation: 'Transportation',
  Entertainment: 'Entertainment',
  Healthcare: 'Healthcare',
  DiningOut: 'Dining Out',
  Shopping: 'Shopping',
  Other: 'Other',
} as const;
export type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category?: ExpenseCategory;
  date: string; // ISO string
  recurringId?: string;
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
