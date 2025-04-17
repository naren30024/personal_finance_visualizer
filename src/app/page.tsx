import { TransactionProvider } from '@/context/TransactionContext';
import { BudgetProvider } from '@/context/BudgetContext';
import { Dashboard } from '@/components/Dashboard';
import Link from 'next/link';

export default function Home() {
  return (
    <TransactionProvider>
      <BudgetProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Welcome to Finance Tracker</h1>
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                <p className="text-gray-600">
                  Track your finances with ease. Start by adding your first transaction or setting up your monthly budget.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Features Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Track Transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Set Monthly Budgets</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span>View Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Get Insights</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/transactions" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold">View Transactions</h3>
                    <p className="text-gray-600">See all your financial activities</p>
                  </Link>
                  <Link href="/budgets" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold">Manage Budgets</h3>
                    <p className="text-gray-600">Set and track your monthly budgets</p>
                  </Link>
                  <Link href="/analytics" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold">View Analytics</h3>
                    <p className="text-gray-600">Analyze your spending patterns</p>
                  </Link>
                  <Link href="/insights" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold">Get Insights</h3>
                    <p className="text-gray-600">Get personalized financial insights</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Dashboard />
        </div>
      </BudgetProvider>
    </TransactionProvider>
  );
}
