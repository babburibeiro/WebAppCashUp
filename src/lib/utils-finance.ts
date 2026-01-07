// Utilitários financeiros

import { Transaction, MonthSummary } from './types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
};

export const calculateMonthSummary = (transactions: Transaction[], month: string): MonthSummary => {
  const monthTransactions = transactions.filter(t => t.date.startsWith(month));
  
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: monthTransactions.length,
  };
};

export const getTransactionsByMonth = (transactions: Transaction[], month: string): Transaction[] => {
  return transactions.filter(t => t.date.startsWith(month));
};

export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
