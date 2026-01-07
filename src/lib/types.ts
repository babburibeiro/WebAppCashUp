// Types para o CashUp - Gestão Financeira

export type TransactionType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  createdAt: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // formato: YYYY-MM
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
};

export type MonthSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};

// User Profile
export type UserProfile = {
  name: string;
  age: number;
  monthlySalary: number;
  onboardingCompleted: boolean;
  createdAt: string;
};
