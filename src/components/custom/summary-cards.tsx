"use client";

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { MonthSummary } from '@/lib/types';
import { formatCurrency } from '@/lib/utils-finance';
import { getUserProfile } from '@/lib/storage';
import { useEffect, useState } from 'react';

type SummaryCardsProps = {
  summary: MonthSummary;
};

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const [userName, setUserName] = useState('');
  const [monthlySalary, setMonthlySalary] = useState(0);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setUserName(profile.name);
      setMonthlySalary(profile.monthlySalary);
    }
  }, []);

  const percentageOfSalary = monthlySalary > 0 
    ? ((summary.totalExpense / monthlySalary) * 100).toFixed(1)
    : 0;

  return (
    <div>
      {/* Greeting */}
      {userName && (
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
            Olá, {userName}
          </h2>
          <p className="text-gray-500 text-xs">
            Aqui está um resumo das suas finanças
          </p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Receitas Card */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">
            Receitas
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>

        {/* Despesas Card */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">
            Despesas
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.totalExpense)}
          </p>
          {monthlySalary > 0 && (
            <p className="text-[10px] text-gray-400 mt-1.5">
              {percentageOfSalary}% do salário
            </p>
          )}
        </div>

        {/* Saldo Card */}
        <div className={`rounded-xl p-4 border transition-all hover:shadow-md ${
          summary.balance >= 0 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-600' 
            : 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-600'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide mb-0.5">
            Saldo do Mês
          </p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
