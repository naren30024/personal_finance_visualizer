'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Transaction, TransactionInput } from '@/types/transaction';
import { sampleTransactions } from '@/data/sampleData';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: TransactionInput) => Promise<void>;
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

  const addTransaction = async (transaction: TransactionInput) => {
    setIsLoading(true);
    setError(null);
    try {
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

      const newTransaction = await response.json();
      if (usingSampleData) {
        setTransactions([...transactions, newTransaction]);
      } else {
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

  const updateTransaction = async (id: string, transaction: TransactionInput) => {
    setIsLoading(true);
    setError(null);
    try {
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

      if (usingSampleData) {
        setTransactions(transactions.map(t => 
          t.id === id ? { ...t, ...transaction } : t
        ));
      } else {
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
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (usingSampleData) {
        setTransactions(transactions.filter(t => t.id !== id));
      } else {
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

  useEffect(() => {
    fetchTransactions();
  }, []);

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
