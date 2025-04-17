export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: string;
  createdAt?: Date;
}

export interface BudgetInput {
  category: string;
  amount: number;
  month: string;
}
