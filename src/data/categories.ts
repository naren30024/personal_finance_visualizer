export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'expense' | 'income';
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    color: '#22c55e',
    icon: 'briefcase',
    type: 'income',
  },
  {
    id: '2',
    name: 'Bonus',
    color: '#22c55e',
    icon: 'gift',
    type: 'income',
  },
  {
    id: '3',
    name: 'Food',
    color: '#f59e0b',
    icon: 'utensils',
    type: 'expense',
  },
  {
    id: '4',
    name: 'Groceries',
    color: '#f59e0b',
    icon: 'shopping-cart',
    type: 'expense',
  },
  {
    id: '5',
    name: 'Transport',
    color: '#3b82f6',
    icon: 'car',
    type: 'expense',
  },
  {
    id: '6',
    name: 'Gasoline',
    color: '#3b82f6',
    icon: 'gas-pump',
    type: 'expense',
  },
  {
    id: '7',
    name: 'Housing',
    color: '#8b5cf6',
    icon: 'house',
    type: 'expense',
  },
  {
    id: '8',
    name: 'Rent',
    color: '#8b5cf6',
    icon: 'building',
    type: 'expense',
  },
  {
    id: '9',
    name: 'Bills',
    color: '#ec4899',
    icon: 'receipt',
    type: 'expense',
  },
  {
    id: '10',
    name: 'Utilities',
    color: '#ec4899',
    icon: 'bolt',
    type: 'expense',
  },
  {
    id: '11',
    name: 'Entertainment',
    color: '#f43f5e',
    icon: 'film',
    type: 'expense',
  },
  {
    id: '12',
    name: 'Streaming',
    color: '#f43f5e',
    icon: 'tv',
    type: 'expense',
  },
  {
    id: '13',
    name: 'Health',
    color: '#10b981',
    icon: 'heart',
    type: 'expense',
  },
  {
    id: '14',
    name: 'Gym',
    color: '#10b981',
    icon: 'dumbbell',
    type: 'expense',
  },
  {
    id: '15',
    name: 'Shopping',
    color: '#db2777',
    icon: 'shopping-bag',
    type: 'expense',
  },
  {
    id: '16',
    name: 'Clothing',
    color: '#db2777',
    icon: 't-shirt',
    type: 'expense',
  },
  {
    id: '17',
    name: 'Education',
    color: '#f97316',
    icon: 'book',
    type: 'expense',
  },
  {
    id: '18',
    name: 'Books',
    color: '#f97316',
    icon: 'book-open',
    type: 'expense',
  },
  {
    id: '19',
    name: 'Travel',
    color: '#0ea5e9',
    icon: 'plane',
    type: 'expense',
  },
  {
    id: '20',
    name: 'Vacation',
    color: '#0ea5e9',
    icon: 'umbrella-beach',
    type: 'expense',
  },
];
