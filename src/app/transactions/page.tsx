"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/custom/sidebar';
import BottomNav from '@/components/custom/bottom-nav';
import Navbar from '@/components/custom/navbar';
import TransactionForm from '@/components/custom/transaction-form';
import TransactionList from '@/components/custom/transaction-list';
import { getTransactions } from '@/lib/storage';
import { sortTransactionsByDate, getCurrentMonth, getMonthName, getTransactionsByMonth } from '@/lib/utils-finance';
import { Transaction } from '@/lib/types';
import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    const allTransactions = getTransactions();
    setTransactions(allTransactions);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePreviousMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 2);
    setCurrentMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month);
    setCurrentMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const filteredTransactions = sortTransactionsByDate(
    getTransactionsByMonth(transactions, currentMonth)
      .filter(t => filterType === 'all' || t.type === filterType)
      .filter(t => 
        searchTerm === '' || 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] md:pl-64">
      <Sidebar />
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transações</h1>
          <p className="text-sm text-gray-500">Gerencie todas as suas movimentações financeiras</p>
        </div>

        {/* Month Selector */}
        <div className="mb-6 flex items-center justify-center gap-6">
          <button
            onClick={handlePreviousMonth}
            className="p-2.5 hover:bg-white rounded-full transition-all hover:shadow-sm"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 capitalize min-w-[180px] text-center">
            {getMonthName(currentMonth)}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2.5 hover:bg-white rounded-full transition-all hover:shadow-sm"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Receitas</p>
            <p className="text-xl font-bold text-emerald-600">
              R$ {totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Despesas</p>
            <p className="text-xl font-bold text-red-600">
              R$ {totalExpense.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                filterType === 'expense'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Despesas
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <TransactionList transactions={filteredTransactions} onUpdate={loadData} />

        {/* Add Transaction Button */}
        <TransactionForm onSuccess={loadData} />
      </main>

      <BottomNav />
    </div>
  );
}
