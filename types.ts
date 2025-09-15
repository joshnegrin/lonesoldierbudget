export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export enum ExpenseCategory {
  Household = 'Household',
  Groceries = 'Groceries',
  Subscriptions = 'Subscriptions',
  DiningOut = 'Dining Out',
  Travel = 'Travel',
  Other = 'Other',
}

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
