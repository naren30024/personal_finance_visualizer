import { BudgetForm } from '@/components/BudgetForm';
import { BudgetComparisonChart } from '@/components/BudgetComparisonChart';

export default function BudgetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <BudgetForm />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BudgetComparisonChart />
      </div>
    </div>
  );
}
