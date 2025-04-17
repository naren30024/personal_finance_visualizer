'use client';

import { useTransactions } from '@/context/TransactionContext';
import { categories } from '@/data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function CategoryPieChart() {
  const { transactions } = useTransactions();

  // Group expenses by category
  const categoryExpenses = transactions
    .filter((t) => t.type === 'expense')
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

  // Convert to array for chart data
  const chartData = Object.entries(categoryExpenses).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Sort categories by amount in descending order
  const sortedChartData = chartData.sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sortedChartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {sortedChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={categories.find((c) => c.name === entry.name)?.color || '#8884d8'}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
