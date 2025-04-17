'use client';

import { useState } from 'react';
import { useBudgets } from '@/context/BudgetContext';
import { categories } from '@/data/categories';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BudgetForm() {
  const { setBudget } = useBudgets();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: categories[0].id,
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    setBudget(formData.categoryId, amount);
    setOpen(false);
    setFormData({
      categoryId: categories[0].id,
      amount: '',
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Set Budget</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Monthly Budget</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.type === 'expense')
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter budget amount"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Set Budget</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
