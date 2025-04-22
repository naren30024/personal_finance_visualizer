export interface BaseTransaction {
  amount: number;
  date: string;  // ISO string format
  description: string;
  category: string;
  type: 'expense' | 'income';
}

export interface Transaction extends BaseTransaction {
  id: string;
  createdAt?: Date;
}

export interface TransactionInput extends BaseTransaction {
  id?: never;
}
