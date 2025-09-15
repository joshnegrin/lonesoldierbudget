import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
  onDelete: (id: string, recurringId?: string) => void;
  onEdit: (transaction: Transaction) => void;
  type: TransactionType;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string, recurringId?: string) => void; onEdit: (transaction: Transaction) => void; type: TransactionType }> = ({ transaction, onDelete, onEdit, type }) => (
    <li className="flex justify-between items-center p-3 bg-gray-800 rounded-lg group">
        <div>
            <p className="font-medium text-gray-200">{transaction.description}</p>
            {transaction.category && <p className="text-xs text-gray-400">{transaction.category}</p>}
        </div>
        <div className="flex items-center space-x-2">
            <span className={`font-semibold ${type === TransactionType.Income ? 'text-emerald-400' : 'text-rose-400'}`}>
                {transaction.amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}
            </span>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(transaction)}
                    className="p-1 text-gray-500 hover:text-sky-400 focus:outline-none focus:text-sky-400"
                    aria-label={`Edit ${transaction.description}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                </button>
                <button 
                    onClick={() => onDelete(transaction.id, transaction.recurringId)} 
                    className="p-1 text-gray-500 hover:text-rose-500 focus:outline-none focus:text-rose-500"
                    aria-label={`Delete ${transaction.description}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    </li>
);

const TransactionList: React.FC<TransactionListProps> = ({ title, transactions, onDelete, onEdit, type }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className={`text-xl font-semibold mb-4 ${type === TransactionType.Income ? 'text-emerald-400' : 'text-rose-400'}`}>{title}</h2>
      {transactions.length > 0 ? (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {transactions
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} onDelete={onDelete} onEdit={onEdit} type={type} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 text-gray-500">
            <p>No {title.toLowerCase()} recorded for this month.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
