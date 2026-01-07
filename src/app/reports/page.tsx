"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/custom/sidebar';
import BottomNav from '@/components/custom/bottom-nav';
import Navbar from '@/components/custom/navbar';
import { getTransactions, getAccounts, getBudgets } from '@/lib/storage';
import { 
  generateReport, 
  getCurrentMonth, 
  getMonthName, 
  calculateMonthSummary,
  formatCurrency,
  getExpensesByCategory 
} from '@/lib/utils-finance';
import { Transaction, Account } from '@/lib/types';
import { PieChart, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [reportPeriod, setReportPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    setTransactions(getTransactions());
    setAccounts(getAccounts());
  }, []);

  const summary = calculateMonthSummary(transactions, currentMonth);
  const categoryExpenses = getExpensesByCategory(transactions, currentMonth);

  // Calculate last 6 months trend
  const getLast6MonthsTrend = () => {
    const trends = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthSummary = calculateMonthSummary(transactions, monthStr);
      
      trends.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        income: monthSummary.totalIncome,
        expense: monthSummary.totalExpense,
        balance: monthSummary.balance,
      });
    }
    
    return trends;
  };

  const trends = getLast6MonthsTrend();
  const maxValue = Math.max(...trends.map(t => Math.max(t.income, t.expense)));

  return (
    <div className="min-h-screen bg-[#FAFAFA] md:pl-64">
      <Sidebar />
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-sm text-gray-500">Análise detalhada das suas finanças</p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setReportPeriod('month')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              reportPeriod === 'month'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setReportPeriod('quarter')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              reportPeriod === 'quarter'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Trimestre
          </button>
          <button
            onClick={() => setReportPeriod('year')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              reportPeriod === 'year'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Ano
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-500">Receitas</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.totalIncome)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-gray-500">Despesas</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Saldo</p>
            </div>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Evolução (Últimos 6 Meses)</h3>
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium capitalize">{trend.month}</span>
                  <div className="flex gap-4">
                    <span className="text-emerald-600 font-semibold">
                      {formatCurrency(trend.income)}
                    </span>
                    <span className="text-red-600 font-semibold">
                      {formatCurrency(trend.expense)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 h-8">
                  <div 
                    className="bg-emerald-500 rounded-lg transition-all"
                    style={{ width: `${(trend.income / maxValue) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500 rounded-lg transition-all"
                    style={{ width: `${(trend.expense / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-xs text-gray-600">Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-gray-600">Despesas</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Gastos por Categoria</h3>
          <div className="space-y-3">
            {categoryExpenses.slice(0, 8).map((category, index) => {
              const percentage = summary.totalExpense > 0 
                ? (category.amount / summary.totalExpense) * 100 
                : 0;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-gray-700 font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-semibold">{formatCurrency(category.amount)}</p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: category.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Balances */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4">Saldo por Conta</h3>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: account.color }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{account.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(account.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
