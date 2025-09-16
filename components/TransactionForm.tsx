import React, { useState } from 'react';
import { TransactionType, ExpenseCategory, ExpenseCategoryValues, TRANSACTION_TYPE_INCOME, TRANSACTION_TYPE_EXPENSE } from '../types.ts';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    type: TransactionType;
    category?: ExpenseCategory;
    date: string;
  }, recurrence: number) => void;
  currentDate: Date;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, currentDate }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TRANSACTION_TYPE_EXPENSE);
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || !numericAmount || numericAmount <= 0) {
      setError('Please enter a valid description and positive amount.');
      return;
    }
    setError('');

    onAddTransaction({
      description,
      amount: numericAmount,
      type,
      category: type === TRANSACTION_TYPE_EXPENSE ? category : undefined,
      date: currentDate.toISOString(),
    }, isRecurring ? recurrence : 0);

    setDescription('');
    setAmount('');
    setIsRecurring(false);
    setRecurrence(1);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Groceries"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (₪)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          />
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1">
              <input type="radio" id="expense" name="type" value={TRANSACTION_TYPE_EXPENSE} checked={type === TRANSACTION_TYPE_EXPENSE} onChange={() => setType(TRANSACTION_TYPE_EXPENSE)} className="hidden" />
              <label htmlFor="expense" className={`block w-full text-center p-2 rounded-md cursor-pointer transition ${type === TRANSACTION_TYPE_EXPENSE ? 'bg-rose-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>Expense</label>
          </div>
          <div className="flex-1">
              <input type="radio" id="income" name="type" value={TRANSACTION_TYPE_INCOME} checked={type === TRANSACTION_TYPE_INCOME} onChange={() => setType(TRANSACTION_TYPE_INCOME)} className="hidden" />
              <label htmlFor="income" className={`block w-full text-center p-2 rounded-md cursor-pointer transition ${type === TRANSACTION_TYPE_INCOME ? 'bg-emerald-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>Income</label>
          </div>
        </div>

        {type === TRANSACTION_TYPE_EXPENSE && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            >
              {ExpenseCategoryValues.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-2">
            <div className="flex items-center">
                <input type="checkbox" id="recurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-emerald-500 focus:ring-emerald-500" />
                <label htmlFor="recurring" className="ml-2 text-sm font-medium text-gray-300">Make this a recurring transaction</label>
            </div>
            {isRecurring && (
                <div className="mt-2 flex items-center space-x-2">
                    <label htmlFor="recurrence-months" className="text-sm">Repeat for the next</label>
                    <input type="number" id="recurrence-months" min="1" max="60" value={recurrence} onChange={(e) => setRecurrence(parseInt(e.target.value, 10) || 1)} className="w-20 bg-gray-700 border-gray-600 rounded-md p-1 text-center text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
                    <span className="text-sm">months</span>
                </div>
            )}
        </div>


        {error && <p className="text-sm text-rose-400">{error}</p>}
        
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
