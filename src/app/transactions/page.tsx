import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { MonthlyExpensesChart } from '@/components/MonthlyExpensesChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';

export default function TransactionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <TransactionForm />
      </div>
      
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
