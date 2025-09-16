export enum TransactionType {
  Income = 'INCOME',
  Expense = 'EXPENSE',
}

export enum ExpenseCategory {
  Groceries = 'Groceries',
  Utilities = 'Utilities',
  Rent = 'Rent',
  Transportation = 'Transportation',
  Entertainment = 'Entertainment',
  Healthcare = 'Healthcare',
  DiningOut = 'Dining Out',
  Shopping = 'Shopping',
  Other = 'Other',
}

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
    recurring: {
        incomeGoal?: boolean;
        savingsGoal?: boolean;
        expenseBudgets?: Partial<Record<ExpenseCategory, boolean>>;
    };
}
