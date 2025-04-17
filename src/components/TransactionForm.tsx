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

interface TransactionFormProps {
  transaction: {
    id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: 'expense' | 'income';
  } | undefined;
  onClose: () => void;
}

export function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [formData, setFormData] = useState(() => ({
    amount: transaction?.amount?.toString() || '',
    date: transaction?.date || format(new Date(), 'yyyy-MM-dd'),
    description: transaction?.description || '',
    category: transaction?.category || 'other',
    type: transaction?.type || 'expense',
  }));
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const transactionData = {
      amount,
      date: formData.date,
      description: formData.description,
      category: formData.category,
      type: formData.type as 'expense' | 'income',
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        <span className="mr-2">+</span>
        Add Transaction
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {transaction ? 'Edit Transaction' : 'Add New Transaction'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter transaction description"
                className="w-full"
              />
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
                    .filter((c) => c.type === 'expense')
                    .map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as 'expense' | 'income' })}
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {transaction ? 'Update' : 'Add'} Transaction
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {transaction ? 'Update' : 'Add'} Transaction
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
