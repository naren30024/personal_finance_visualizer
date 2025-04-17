import { MonthlyExpensesChart } from '@/components/MonthlyExpensesChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { TransactionList } from '@/components/TransactionList';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MonthlyExpensesChart />
        <CategoryPieChart />
      </div>

      <div className="bg-white rounded-lg shadow">
        <TransactionList />
      </div>
    </div>
  );
}
