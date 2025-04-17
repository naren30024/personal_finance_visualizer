'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Finance Tracker</span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/transactions">
              <Button variant="ghost">Transactions</Button>
            </Link>
            <Link href="/budgets">
              <Button variant="ghost">Budgets</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost">Analytics</Button>
            </Link>
            <Link href="/insights">
              <Button variant="ghost">Insights</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
