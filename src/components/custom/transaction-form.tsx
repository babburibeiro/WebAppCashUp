"use client";

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Transaction, TransactionType, Category } from '@/lib/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';
import { saveTransaction } from '@/lib/storage';
import * as Icons from 'lucide-react';

type TransactionFormProps = {
  onSuccess: () => void;
};

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !selectedCategory) {
      alert('Preencha todos os campos!');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      category: selectedCategory,
      date,
      createdAt: new Date().toISOString(),
    };

    saveTransaction(transaction);
    
    // Reset form
    setDescription('');
    setAmount('');
    setSelectedCategory(null);
    setIsOpen(false);
    onSuccess();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setSelectedCategory(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">Nova Transação</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="flex gap-3 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                type === 'expense'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                type === 'income'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Receita
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => {
                const IconComponent = (Icons as any)[category.icon];
                const isSelected = selectedCategory?.id === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: category.color + '15' }}
                    >
                      {IconComponent && (
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: category.color }}
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-center">
                      {category.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
          >
            Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
