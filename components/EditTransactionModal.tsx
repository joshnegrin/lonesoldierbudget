import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, ExpenseCategory } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onUpdateTransaction: (updatedTransaction: Transaction, scope: 'this' | 'future') => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, transaction, onUpdateTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.Groceries);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category || ExpenseCategory.Groceries);
      setDate(transaction.date.split('T')[0]); // Get YYYY-MM-DD for date input
    }
  }, [transaction]);

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

  if (!isOpen || !transaction) return null;
  
  const handleUpdate = (scope: 'this' | 'future') => {
    const numericAmount = parseFloat(amount);
    if (!description || !numericAmount || numericAmount <= 0) {
      setError('Please enter a valid description and positive amount.');
      return;
    }
    
    // Combine the new date with the original time to preserve timezone info
    const originalDate = new Date(transaction.date);
    const [year, month, day] = date.split('-').map(Number);
    const newDate = new Date(originalDate.getTime());
    newDate.setFullYear(year, month - 1, day);

    onUpdateTransaction({
      ...transaction,
      description,
      amount: numericAmount,
      type,
      category: type === TransactionType.Expense ? category : undefined,
      date: newDate.toISOString(),
    }, scope);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-transaction-title"
    >
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
            <h2 id="edit-transaction-title" className="text-xl font-semibold text-emerald-400">Edit Transaction</h2>
            <button onClick={onClose} aria-label="Close edit transaction modal" className="text-gray-400 hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <input id="edit-description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          <div>
            <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
            <input id="edit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input type="radio" id="edit-expense" name="edit-type" value={TransactionType.Expense} checked={type === TransactionType.Expense} onChange={() => setType(TransactionType.Expense)} className="hidden" />
              <label htmlFor="edit-expense" className={`block w-full text-center p-2 rounded-md cursor-pointer transition ${type === TransactionType.Expense ? 'bg-rose-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>Expense</label>
            </div>
            <div className="flex-1">
              <input type="radio" id="edit-income" name="edit-type" value={TransactionType.Income} checked={type === TransactionType.Income} onChange={() => setType(TransactionType.Income)} className="hidden" />
              <label htmlFor="edit-income" className={`block w-full text-center p-2 rounded-md cursor-pointer transition ${type === TransactionType.Income ? 'bg-emerald-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>Income</label>
            </div>
          </div>
          {type === TransactionType.Expense && (
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition">
                {Object.values(ExpenseCategory).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
          )}
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div className="flex flex-col space-y-2 pt-2">
            <button type="button" onClick={() => handleUpdate('this')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Save Changes to This Entry</button>
            {transaction.recurringId && (
              <button type="button" onClick={() => handleUpdate('future')} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Save for This & Future Entries</button>
            )}
            <button type="button" onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
