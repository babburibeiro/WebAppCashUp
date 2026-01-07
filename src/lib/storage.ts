// Gerenciamento de dados no localStorage

import { Transaction, Budget, Goal, UserProfile } from './types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'cashup_transactions',
  BUDGETS: 'cashup_budgets',
  GOALS: 'cashup_goals',
  USER_PROFILE: 'cashup_user_profile',
};

// User Profile
export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const updateUserProfile = (updates: Partial<UserProfile>): void => {
  const profile = getUserProfile();
  if (profile) {
    const updated = { ...profile, ...updates };
    saveUserProfile(updated);
  }
};

// Transactions
export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const updateTransaction = (id: string, updated: Transaction): void => {
  const transactions = getTransactions().map(t => t.id === id ? updated : t);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Budgets
export const getBudgets = (): Budget[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
};

export const saveBudget = (budget: Budget): void => {
  const budgets = getBudgets();
  const existing = budgets.findIndex(b => b.categoryId === budget.categoryId && b.month === budget.month);
  if (existing >= 0) {
    budgets[existing] = budget;
  } else {
    budgets.push(budget);
  }
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
};

// Goals
export const getGoals = (): Goal[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : [];
};

export const saveGoal = (goal: Goal): void => {
  const goals = getGoals();
  goals.push(goal);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const updateGoal = (id: string, updated: Goal): void => {
  const goals = getGoals().map(g => g.id === id ? updated : g);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals().filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};
