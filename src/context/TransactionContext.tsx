'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { sampleTransactions } from '@/data/sampleData';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, '_id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  usingSampleData: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setTransactions(data);
        setUsingSampleData(false);
      } else {
        console.log('No transactions found in database, using sample data');
        setTransactions(sampleTransactions);
        setUsingSampleData(true);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Using sample data.');
      setTransactions(sampleTransactions);
      setUsingSampleData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, '_id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Add to database
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If using sample data, also update local state
      if (usingSampleData) {
        const newTransaction = {
          ...transaction,
          id: (transactions.length + 1).toString(),
        };
        setTransactions([...transactions, newTransaction]);
      } else {
        // Refresh transactions from database
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update in database
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...transaction }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If using sample data, also update local state
      if (usingSampleData) {
        setTransactions(transactions.map(t => 
          t.id === id ? { ...t, ...transaction } : t
        ));
      } else {
        // Refresh transactions from database
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Delete from database
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If using sample data, also update local state
      if (usingSampleData) {
        setTransactions(transactions.filter(t => t.id !== id));
      } else {
        // Refresh transactions from database
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        isLoading,
        error,
        usingSampleData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
