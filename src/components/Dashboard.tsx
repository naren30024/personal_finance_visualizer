'use client';

import { useTransactions } from '@/context/TransactionContext';
import { CategoryPieChart } from './CategoryPieChart';
import { BudgetComparisonChart } from './BudgetComparisonChart';
import { MonthlyExpensesChart } from './MonthlyExpensesChart';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { BudgetForm } from './BudgetForm';

export function Dashboard() {
  const { transactions,  error, usingSampleData } = useTransactions();

  // Calculate total income and expenses
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {usingSampleData && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          Using sample data. Your transactions will be saved to the database when you add them.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Income</h3>
              <p className="text-2xl font-bold text-green-600">
                ${totals.income.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-medium text-red-800">Expenses</h3>
              <p className="text-2xl font-bold text-red-600">
                ${totals.expenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <TransactionForm />
            <BudgetForm />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
          <CategoryPieChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Budget vs Actual</h2>
          <BudgetComparisonChart />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Monthly Trends</h2>
        <MonthlyExpensesChart />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList />
      </div>
    </div>
  );
}
