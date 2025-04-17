'use client';

import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { categories } from '@/data/categories';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from '@/utils/format';
import { Edit2, Trash2 } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

interface TransactionFormProps {
  transaction?: {
    id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: 'expense' | 'income';
  } | undefined;
  onClose: () => void;
}

export function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [showDialog, setShowDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: 'expense' | 'income';
  } | undefined>(undefined);

  const handleEdit = (transaction: {
    id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: 'expense' | 'income';
  }) => {
    setEditingTransaction(transaction);
    setShowDialog(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Transaction History</h2>
          <div className="flex space-x-4">
            <Button variant="outline">This Month</Button>
            <Button variant="outline">Last 3 Months</Button>
            <Button variant="outline">All Time</Button>
            <Button onClick={() => setShowDialog(true)}>Add Transaction</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Category</th>
                <th className="text-right py-3 font-medium">Amount</th>
                <th className="text-right py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'h:mm a')}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categories.find(c => c.name === transaction.category)?.color }}
                      />
                      <span className="text-sm">{transaction.category}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`font-medium ${
                        transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editingTransaction}
            onClose={() => {
              setShowDialog(false);
              setEditingTransaction(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
