"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/custom/navbar';
import SummaryCards from '@/components/custom/summary-cards';
import TransactionForm from '@/components/custom/transaction-form';
import TransactionList from '@/components/custom/transaction-list';
import SpendingPieChart from '@/components/custom/spending-pie-chart';
import SpendingEvolutionChart from '@/components/custom/spending-evolution-chart';
import Onboarding from '@/components/custom/onboarding';
import { getTransactions, getUserProfile } from '@/lib/storage';
import { calculateMonthSummary, getCurrentMonth, getMonthName, sortTransactionsByDate, getTransactionsByMonth } from '@/lib/utils-finance';
import { Transaction, MonthSummary } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState<MonthSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    // Verificar se usuário completou onboarding
    const profile = getUserProfile();
    if (!profile || !profile.onboardingCompleted) {
      setShowOnboarding(true);
    }
    setIsLoading(false);
  }, []);

  const loadData = () => {
    const allTransactions = getTransactions();
    setTransactions(allTransactions);
    const monthSummary = calculateMonthSummary(allTransactions, currentMonth);
    setSummary(monthSummary);
  };

  useEffect(() => {
    if (!showOnboarding) {
      loadData();
    }
  }, [currentMonth, showOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadData();
  };

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

  const monthTransactions = sortTransactionsByDate(
    getTransactionsByMonth(transactions, currentMonth)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20">
        {/* Month Selector */}
        <div className="mb-5 flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-white rounded-full transition-all hover:shadow-sm"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize min-w-[160px] text-center">
            {getMonthName(currentMonth)}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white rounded-full transition-all hover:shadow-sm"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-5">
          <SummaryCards summary={summary} />
        </div>

        {/* Gráficos Financeiros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Gráfico de Pizza - Distribuição por Categoria */}
          <SpendingPieChart transactions={monthTransactions} month={currentMonth} />
          
          {/* Gráfico de Barras - Evolução Mensal */}
          <SpendingEvolutionChart transactions={transactions} currentMonth={currentMonth} />
        </div>

        {/* Transactions List */}
        <TransactionList transactions={monthTransactions} onUpdate={loadData} />

        {/* Add Transaction Button */}
        <TransactionForm onSuccess={loadData} />
      </main>
    </div>
  );
}
