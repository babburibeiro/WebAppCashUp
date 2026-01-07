// Categorias predefinidas do CashUp

import { Category } from './types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'home', name: 'Moradia', icon: 'Home', color: '#3B82F6', type: 'expense' }, // Azul
  { id: 'food', name: 'Alimentação', icon: 'UtensilsCrossed', color: '#10B981', type: 'expense' }, // Verde
  { id: 'transport', name: 'Transporte', icon: 'Car', color: '#F97316', type: 'expense' }, // Laranja
  { id: 'entertainment', name: 'Lazer', icon: 'Gamepad2', color: '#8B5CF6', type: 'expense' }, // Roxo
  { id: 'health', name: 'Saúde', icon: 'Heart', color: '#F87171', type: 'expense' }, // Vermelho suave
  { id: 'education', name: 'Educação', icon: 'GraduationCap', color: '#60A5FA', type: 'expense' }, // Azul claro
  { id: 'shopping', name: 'Compras', icon: 'ShoppingBag', color: '#FBBF24', type: 'expense' }, // Amarelo
  { id: 'bills', name: 'Contas Fixas', icon: 'FileText', color: '#9CA3AF', type: 'expense' }, // Cinza
  { id: 'other-expense', name: 'Outros', icon: 'MoreHorizontal', color: '#6B7280', type: 'expense' }, // Cinza escuro
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salário', icon: 'Briefcase', color: '#10B981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#3B82F6', type: 'income' },
  { id: 'investment', name: 'Investimentos', icon: 'TrendingUp', color: '#8B5CF6', type: 'income' },
  { id: 'gift', name: 'Presente', icon: 'Gift', color: '#EC4899', type: 'income' },
  { id: 'other-income', name: 'Outros', icon: 'Plus', color: '#64748B', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryById = (id: string): Category | undefined => {
  return ALL_CATEGORIES.find(cat => cat.id === id);
};
