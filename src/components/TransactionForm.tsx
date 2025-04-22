'use client';

import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { categories } from '@/data/categories';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction, TransactionInput } from '@/types/transaction';

interface TransactionFormProps {
  transaction?: Transaction;
  onClose?: () => void;
}

const formatDateForInput = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

const formatDateForApi = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString();
};

export function TransactionForm({ transaction, onClose }: TransactionFormProps = {}) {
  const [open, setOpen] = useState(false);
  const { addTransaction, updateTransaction, isLoading } = useTransactions();

  const [formData, setFormData] = useState<TransactionInput>({
    type: transaction?.type || 'expense',
    category: transaction?.category || categories[0].name,
    amount: transaction?.amount || 0,
    description: transaction?.description || '',
    date: transaction?.date ? formatDateForInput(transaction.date) : formatDateForInput(new Date().toISOString()),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const transactionData: TransactionInput = {
        ...formData,
        date: formatDateForApi(formData.date),
      };

      if (transaction?.id) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      setOpen(false);
      onClose?.();
      // Reset form
      setFormData({
        type: 'expense',
        category: categories[0].name,
        amount: 0,
        description: '',
        date: formatDateForInput(new Date().toISOString()),
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <>
      {!transaction && (
        <Button onClick={() => setOpen(true)} className="w-fit-content">
          Add Transaction
        </Button>
      )}
      <Dialog open={transaction ? true : open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'expense' | 'income') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => formData.type === 'expense' ? c.type === 'expense' : true)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {
                setOpen(false);
                onClose?.();
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (transaction ? 'Update' : 'Add')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
