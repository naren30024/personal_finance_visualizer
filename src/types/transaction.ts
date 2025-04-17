export interface Transaction {
  id?: string;
  amount: number;
  date: Date | string;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt?: Date;
}

export interface TransactionInput {
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'expense' | 'income';
}
