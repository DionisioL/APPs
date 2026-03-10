import { useState, useEffect } from 'react';
import { Transaction } from '../types';

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse transactions from local storage');
      }
    } else {
      // Migrate old expenses if they exist
      const oldExpenses = localStorage.getItem('expenses');
      if (oldExpenses) {
        try {
          const parsed = JSON.parse(oldExpenses);
          const migrated = parsed.map((e: any) => ({ ...e, type: 'expense' }));
          setTransactions(migrated);
        } catch (e) {
          console.error('Failed to migrate old expenses');
        }
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
}
