"use client";

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils-finance';
import { PieChart, X } from 'lucide-react';

type CategoryExpense = {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  total: number;
  percentage: number;
  transactions: Transaction[];
};

type ExpenseChartProps = {
  transactions: Transaction[];
  month: string;
};

export default function ExpenseChart({ transactions, month }: ExpenseChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryExpense | null>(null);

  // Filtrar apenas despesas do mês
  const expenses = transactions.filter(t => t.type === 'expense');

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <PieChart className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Gastos por Categoria</h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <PieChart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma despesa registrada neste mês</p>
        </div>
      </div>
    );
  }

  // Calcular total de despesas
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Agrupar por categoria
  const categoryMap = new Map<string, CategoryExpense>();
  
  expenses.forEach(transaction => {
    const catId = transaction.category.id;
    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        categoryId: catId,
        categoryName: transaction.category.name,
        color: transaction.category.color,
        icon: transaction.category.icon,
        total: 0,
        percentage: 0,
        transactions: [],
      });
    }
    const cat = categoryMap.get(catId)!;
    cat.total += transaction.amount;
    cat.transactions.push(transaction);
  });

  // Calcular percentuais e ordenar
  const categoryExpenses = Array.from(categoryMap.values())
    .map(cat => ({
      ...cat,
      percentage: (cat.total / totalExpenses) * 100,
    }))
    .sort((a, b) => b.total - a.total);

  // Gerar SVG do gráfico de pizza
  let currentAngle = -90; // Começar no topo
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  const slices = categoryExpenses.map((cat) => {
    const sliceAngle = (cat.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle = endAngle;

    return {
      ...cat,
      pathData,
      startAngle,
      endAngle,
    };
  });

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <PieChart className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Gastos por Categoria</h3>
        </div>

        {/* Gráfico de Pizza */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
          <div className="relative">
            <svg
              viewBox="0 0 200 200"
              className="w-64 h-64 transform hover:scale-105 transition-transform"
            >
              {slices.map((slice, index) => (
                <g key={slice.categoryId}>
                  <path
                    d={slice.pathData}
                    fill={slice.color}
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => setSelectedCategory(slice)}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}
                  />
                </g>
              ))}
              {/* Centro branco */}
              <circle
                cx={centerX}
                cy={centerY}
                r={35}
                fill="white"
                className="pointer-events-none"
              />
              {/* Texto central */}
              <text
                x={centerX}
                y={centerY - 8}
                textAnchor="middle"
                className="text-xs fill-gray-500 font-medium"
              >
                Total
              </text>
              <text
                x={centerX}
                y={centerY + 8}
                textAnchor="middle"
                className="text-sm fill-gray-900 font-bold"
              >
                {formatCurrency(totalExpenses)}
              </text>
            </svg>
          </div>

          {/* Legenda */}
          <div className="flex-1 w-full space-y-2">
            {categoryExpenses.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {cat.categoryName}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(cat.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {cat.percentage.toFixed(1)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Toque em uma categoria para ver os detalhes
        </div>
      </div>

      {/* Modal de Detalhes da Categoria */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-6 border-b border-gray-100"
              style={{ backgroundColor: `${selectedCategory.color}15` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    <span className="text-2xl">
                      {selectedCategory.icon === 'UtensilsCrossed' && '🍽️'}
                      {selectedCategory.icon === 'Car' && '🚗'}
                      {selectedCategory.icon === 'Home' && '🏠'}
                      {selectedCategory.icon === 'Heart' && '❤️'}
                      {selectedCategory.icon === 'GraduationCap' && '🎓'}
                      {selectedCategory.icon === 'Gamepad2' && '🎮'}
                      {selectedCategory.icon === 'ShoppingBag' && '🛍️'}
                      {selectedCategory.icon === 'FileText' && '📄'}
                      {selectedCategory.icon === 'MoreHorizontal' && '⋯'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedCategory.categoryName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedCategory.transactions.length} transaç{selectedCategory.transactions.length === 1 ? 'ão' : 'ões'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(selectedCategory.total)}
                </span>
                <span className="text-lg text-gray-600">
                  ({selectedCategory.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Lista de Transações */}
            <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-6">
              <div className="space-y-3">
                {selectedCategory.transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
