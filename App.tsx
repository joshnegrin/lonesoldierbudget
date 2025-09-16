import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header.tsx';
import Summary from './components/Summary.tsx';
import TransactionForm from './components/TransactionForm.tsx';
import TransactionList from './components/TransactionList.tsx';
import CategoryChart from './components/CategoryChart.tsx';
import EditTransactionModal from './components/EditTransactionModal.tsx';
import BudgetSetup from './components/BudgetSetup.tsx';
import SavingsGoal from './components/SavingsGoal.tsx';
import BudgetProgress from './components/BudgetProgress.tsx';
import { Transaction, Budget, ExpenseCategory, ExpenseCategoryValues, TRANSACTION_TYPE_INCOME, TRANSACTION_TYPE_EXPENSE } from './types.ts';
import { storageService } from './services/storageService.ts';

const emptyBudget: Budget = {
  incomeGoal: 5000,
  savingsGoal: 500,
  expenseBudgets: ExpenseCategoryValues.reduce((acc, cat) => {
    acc[cat] = 0;
    return acc;
  }, {} as Record<ExpenseCategory, number>),
  recurring: {},
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [budgets, setBudgets] = useState<Record<string, Budget>>(() => storageService.getBudgets());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetSetupOpen, setIsBudgetSetupOpen] = useState(false);

  useEffect(() => {
    storageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    storageService.saveBudgets(budgets);
  }, [budgets]);
  
  const { currentMonthKey, previousMonthKey } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const currentKey = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    
    const prevDate = new Date(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth();
    const previousKey = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}`;

    return { currentMonthKey: currentKey, previousMonthKey: previousKey };
  }, [currentDate]);

  const currentBudget = useMemo(() => {
    return budgets[currentMonthKey] || emptyBudget;
  }, [budgets, currentMonthKey]);

  const previousBudget = useMemo(() => {
    return budgets[previousMonthKey];
  }, [budgets, previousMonthKey]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentDate.getFullYear() &&
             transactionDate.getMonth() === currentDate.getMonth();
    });
  }, [transactions, currentDate]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1); // Avoid issues with different month lengths
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'recurringId'>, recurrence: number) => {
    if (recurrence > 0) {
      const recurringId = uuidv4();
      const newTransactions: Transaction[] = [];
      // Create transaction for this month + `recurrence` future months
      for (let i = 0; i <= recurrence; i++) {
        const transactionDate = new Date(transaction.date);
        transactionDate.setMonth(transactionDate.getMonth() + i);
        newTransactions.push({
          ...transaction,
          id: uuidv4(),
          recurringId: recurringId,
          date: transactionDate.toISOString(),
        });
      }
      setTransactions(prev => [...prev, ...newTransactions]);
    } else {
      const newTransaction: Transaction = {
        ...transaction,
        id: uuidv4(),
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction, scope: 'this' | 'future') => {
    if (scope === 'future' && updatedTransaction.recurringId) {
      const originalTransaction = transactions.find(t => t.id === updatedTransaction.id);
      if (!originalTransaction) return;

      const originalTransactionDate = new Date(originalTransaction.date);

      setTransactions(prev => {
        const futureTransactions = prev
          .filter(t => t.recurringId === updatedTransaction.recurringId && new Date(t.date) >= originalTransactionDate)
          .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const updatedFutureTransactions = futureTransactions.map((t, index) => {
          const newDate = new Date(updatedTransaction.date);
          newDate.setMonth(newDate.getMonth() + index);
          
          return {
            ...t, // keep id and recurringId
            description: updatedTransaction.description,
            amount: updatedTransaction.amount,
            type: updatedTransaction.type,
            category: updatedTransaction.category,
            date: newDate.toISOString(),
          };
        });

        return prev.map(t => {
          const updatedVersion = updatedFutureTransactions.find(uft => uft.id === t.id);
          return updatedVersion || t;
        });
      });
    } else {
      setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string, recurringId?: string) => {
    if (recurringId) {
        if (window.confirm('This is a recurring transaction. Do you want to delete all future occurrences (including this one)? OK for all future, Cancel for only this one.')) {
            const transactionToDelete = transactions.find(t => t.id === id);
            if (!transactionToDelete) return;
            const transactionDate = new Date(transactionToDelete.date);
            setTransactions(prev => prev.filter(t => 
                !(t.recurringId === recurringId && new Date(t.date) >= transactionDate)
            ));
        } else {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    } else {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveBudget = (newBudget: Budget) => {
    setBudgets(prev => ({
      ...prev,
      [currentMonthKey]: newBudget
    }));
  };

  const incomeTransactions = filteredTransactions.filter(t => t.type === TRANSACTION_TYPE_INCOME);
  const expenseTransactions = filteredTransactions.filter(t => t.type === TRANSACTION_TYPE_EXPENSE);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Header currentDate={currentDate} onMonthChange={handleMonthChange} />
        <main>
          <Summary transactions={filteredTransactions} budget={currentBudget} />
          
          <div className="mb-8">
            <button
              onClick={() => setIsBudgetSetupOpen(true)}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500"
            >
              Setup Monthly Budget
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TransactionForm onAddTransaction={handleAddTransaction} currentDate={currentDate}/>
            <BudgetProgress expenses={expenseTransactions} budget={currentBudget} onEditBudget={() => setIsBudgetSetupOpen(true)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             <CategoryChart expenses={expenseTransactions} />
             <SavingsGoal budget={currentBudget} actualIncome={totalIncome} actualExpenses={totalExpenses} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TransactionList
              title="Income"
              transactions={incomeTransactions}
              onDelete={handleDeleteTransaction}
              onEdit={setEditingTransaction}
              type={TRANSACTION_TYPE_INCOME}
            />
            <TransactionList
              title="Expenses"
              transactions={expenseTransactions}
              onDelete={handleDeleteTransaction}
              onEdit={setEditingTransaction}
              type={TRANSACTION_TYPE_EXPENSE}
            />
          </div>
        </main>
      </div>
      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
      <BudgetSetup
        isOpen={isBudgetSetupOpen}
        onClose={() => setIsBudgetSetupOpen(false)}
        initialBudget={currentBudget}
        onSave={handleSaveBudget}
        previousBudget={previousBudget}
      />
    </div>
  );
}

export default App;
