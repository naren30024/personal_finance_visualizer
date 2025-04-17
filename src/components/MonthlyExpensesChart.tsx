'use client';

import { useTransactions } from '@/context/TransactionContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function MonthlyExpensesChart() {
  const { transactions } = useTransactions();

  // Group transactions by month and calculate total expenses
  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const month = format(new Date(transaction.date), 'MMM yyyy');
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Convert to array for chart data
  const chartData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#ff4b4b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
