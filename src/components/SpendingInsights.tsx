'use client';

import { useTransactions } from '@/context/TransactionContext';
import { useBudgets } from '@/context/BudgetContext';
import { categories } from '@/data/categories';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/format';

export function SpendingInsights() {
  const { transactions } = useTransactions();
  const { getBudget } = useBudgets();

  // Get current month
  const currentMonth = format(new Date(), 'yyyy-MM');

  // Calculate total expenses and income
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate category-wise spending
  const categoryExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = categories.find((c) => c.name.toLowerCase() === transaction.category.toLowerCase());
      if (category) {
        if (!acc[category.name]) {
          acc[category.name] = {
            amount: 0,
            budget: getBudget(category.id, currentMonth) || 0,
          };
        }
        acc[category.name].amount += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { amount: number; budget: number }>)

  // Calculate overspending categories
  const overspendingCategories = Object.entries(categoryExpenses)
    .filter(([, data]) => data.amount > data.budget)
    .map(([name, data]) => ({
      name,
      overspent: data.amount - data.budget,
    }))
    .sort((a, b) => b.overspent - a.overspent);

  // Calculate savings rate
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Spending Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings Rate */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Savings Rate</h4>
          <div className="text-2xl font-bold">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            {savingsRate >= 20 ? 'Good job!' : 'Try to save more'}
          </div>
        </div>

        {/* Overspending Categories */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Overspending Categories</h4>
          <div className="space-y-2">
            {overspendingCategories.slice(0, 3).map((category) => (
              <div key={category.name} className="flex justify-between items-center">
                <span className="text-sm">{category.name}</span>
                <span className="text-sm text-red-500">
                  {formatCurrency(category.overspent)} over budget
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Monthly Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Income</span>
              <span className="text-sm text-green-500">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Expenses</span>
              <span className="text-sm text-red-500">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Net Balance</span>
              <span className={`text-sm font-semibold ${
                netBalance >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatCurrency(netBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
