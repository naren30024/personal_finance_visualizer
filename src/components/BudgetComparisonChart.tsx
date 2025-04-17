'use client';

import { useTransactions } from '@/context/TransactionContext';
import { useBudgets } from '@/context/BudgetContext';
import { categories } from '@/data/categories';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BudgetComparisonChart() {
  const { transactions } = useTransactions();
  const { getBudget } = useBudgets();

  // Get current month
  const currentMonth = format(new Date(), 'yyyy-MM');

  // Calculate actual expenses by category
  const actualExpenses = transactions
    .filter((t) => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === currentMonth)
    .reduce((acc, transaction) => {
      const category = categories.find((c) => c.name.toLowerCase() === transaction.category.toLowerCase());
      if (category) {
        acc[category.id] = (acc[category.id] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  // Prepare data for chart
  const data = categories.map((category) => {
    const budgetAmount = getBudget(category.id, currentMonth) || 0;
    const actualAmount = actualExpenses[category.id] || 0;
    return {
      name: category.name,
      Budget: budgetAmount,
      Actual: actualAmount,
    };
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#8884d8" />
          <Bar dataKey="Actual" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
