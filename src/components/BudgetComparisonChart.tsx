'use client';

import { useTransactions } from '@/context/TransactionContext';
import { useBudgets } from '@/context/BudgetContext';
import { categories } from '@/data/categories';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BudgetComparisonChart() {
  const { transactions } = useTransactions();
  const { budgets, getBudget } = useBudgets();

  // Get current month
  const currentMonth = format(new Date(), 'yyyy-MM');

  // Calculate actual expenses by category
  const actualExpenses = transactions
    .filter((t) => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === currentMonth)
    .reduce((acc, transaction) => {
      const category = categories.find((c) => c.name.toLowerCase() === transaction.category.toLowerCase());
      if (category) {
        if (!acc[category.name]) {
          acc[category.name] = 0;
        }
        acc[category.name] += transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  // Get budget data for current month
  const budgetData = categories
    .filter((c) => c.type === 'expense')
    .map((category) => ({
      name: category.name,
      budget: getBudget(category.id, currentMonth) || 0,
      actual: actualExpenses[category.name] || 0,
      color: category.color,
    }))
    .filter((data) => data.budget > 0 || data.actual > 0); // Only show categories with data

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Budget vs Actual</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={budgetData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="budget"
            name="Budget"
            fill="#4ade80"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="actual"
            name="Actual"
            fill="#f87171"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
