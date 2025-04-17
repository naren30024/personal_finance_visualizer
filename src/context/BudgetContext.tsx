'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Category } from '@/data/categories';
import { format } from 'date-fns';

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
}

interface BudgetContextType {
  budgets: Budget[];
  setBudget: (categoryId: string, amount: number) => Promise<void>;
  getBudget: (categoryId: string, month: string) => number | null;
  isLoading: boolean;
  error: string | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/budgets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to fetch budgets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const setBudget = async (categoryId: string, amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId,
          amount,
          month: currentMonth,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchBudgets();
    } catch (error) {
      console.error('Error setting budget:', error);
      setError('Failed to set budget. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getBudget = (categoryId: string, month: string) => {
    const budget = budgets.find(b => b.categoryId === categoryId && b.month === month);
    return budget ? budget.amount : null;
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        setBudget,
        getBudget,
        isLoading,
        error,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}
