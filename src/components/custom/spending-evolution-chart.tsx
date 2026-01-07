"use client";

import { Transaction } from '@/lib/types';
import { getMonthName } from '@/lib/utils-finance';

type SpendingEvolutionChartProps = {
  transactions: Transaction[];
  currentMonth: string;
};

export default function SpendingEvolutionChart({ transactions, currentMonth }: SpendingEvolutionChartProps) {
  // Calcular últimos 6 meses
  const getLastSixMonths = () => {
    const months = [];
    const [year, month] = currentMonth.split('-').map(Number);
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(year, month - 1 - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        key: monthKey,
        label: getMonthName(monthKey).split(' ')[0].substring(0, 3), // Abreviação
        fullLabel: getMonthName(monthKey),
      });
    }
    
    return months;
  };

  const months = getLastSixMonths();

  // Calcular gastos por mês
  const monthlyData = months.map(month => {
    const monthTransactions = transactions.filter(t => {
      const transactionMonth = t.date.substring(0, 7);
      return transactionMonth === month.key && t.type === 'expense';
    });
    
    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...month,
      total,
      count: monthTransactions.length,
    };
  });

  const maxValue = Math.max(...monthlyData.map(m => m.total), 1);
  const hasData = monthlyData.some(m => m.total > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Evolução dos seus gastos
        </h3>
        <div className="flex items-center justify-center h-56 text-gray-400">
          <p className="text-sm">Nenhuma despesa registrada nos últimos meses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-900">
          Evolução dos seus gastos
        </h3>
        <p className="text-xs text-gray-500">Últimos 6 meses</p>
      </div>

      {/* Gráfico de Barras */}
      <div className="relative h-56">
        {/* Grid de referência */}
        <div className="absolute inset-0 flex flex-col justify-between py-2">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="border-t border-gray-100" />
          ))}
        </div>

        {/* Barras */}
        <div className="relative h-full flex items-end justify-between gap-2 sm:gap-3 px-2">
          {monthlyData.map((month, index) => {
            const heightPercentage = (month.total / maxValue) * 100;
            const isCurrentMonth = month.key === currentMonth;
            
            return (
              <div 
                key={month.key}
                className="flex-1 flex flex-col items-center gap-2.5 group"
              >
                {/* Barra */}
                <div className="relative w-full flex flex-col items-center">
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                      <p className="font-semibold">R$ {month.total.toFixed(2)}</p>
                      <p className="text-gray-300 text-[9px] mt-0.5">
                        {month.count} {month.count === 1 ? 'transação' : 'transações'}
                      </p>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </div>

                  {/* Valor acima da barra */}
                  <div className="mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-semibold text-gray-700">
                      R$ {month.total.toFixed(0)}
                    </p>
                  </div>

                  {/* Barra */}
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isCurrentMonth 
                        ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-200' 
                        : 'bg-gradient-to-t from-gray-300 to-gray-200 group-hover:from-gray-400 group-hover:to-gray-300'
                    }`}
                    style={{ 
                      height: `${Math.max(heightPercentage, 2)}%`,
                      minHeight: month.total > 0 ? '6px' : '0px',
                    }}
                  />
                </div>

                {/* Label do mês */}
                <div className="text-center">
                  <p className={`text-[10px] font-medium ${
                    isCurrentMonth ? 'text-emerald-600' : 'text-gray-600'
                  }`}>
                    {month.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-center gap-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-gradient-to-t from-emerald-500 to-emerald-400" />
          <span className="text-[10px] text-gray-600">Mês atual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-gradient-to-t from-gray-300 to-gray-200" />
          <span className="text-[10px] text-gray-600">Meses anteriores</span>
        </div>
      </div>
    </div>
  );
}
