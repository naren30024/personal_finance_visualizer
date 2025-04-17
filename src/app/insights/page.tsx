import { SpendingInsights } from '@/components/SpendingInsights';

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Insights</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <SpendingInsights />
      </div>
    </div>
  );
}
