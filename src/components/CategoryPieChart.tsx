'use client';

import { useTransactions } from '@/context/TransactionContext';
import { categories } from '@/data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function CategoryPieChart() {
  const { transactions } = useTransactions();

  // Calculate total by category
  const categoryTotals = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = categories.find((c) => c.name.toLowerCase() === transaction.category.toLowerCase());
      if (category) {
        acc[category.id] = (acc[category.id] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  // Prepare data for pie chart
  const data = categories
    .filter((c) => categoryTotals[c.id] && categoryTotals[c.id] > 0)
    .map((category) => ({
      name: category.name,
      value: categoryTotals[category.id],
      color: category.color || '#' + Math.floor(Math.random()*16777215).toString(16),
    }));

  const formatValue = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `$${numValue.toFixed(2)}`;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(entry) => entry.name}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={formatValue} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
