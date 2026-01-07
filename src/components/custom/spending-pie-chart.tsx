"use client";

import { Transaction } from '@/lib/types';
import { useState } from 'react';
import { X } from 'lucide-react';

type SpendingPieChartProps = {
  transactions: Transaction[];
  month: string;
};

// Cores intuitivas por categoria
const CATEGORY_COLORS: Record<string, string> = {
  'home': '#3B82F6', // Azul para moradia
  'food': '#10B981', // Verde para alimentação
  'transport': '#F97316', // Laranja para transporte
  'entertainment': '#8B5CF6', // Roxo para lazer
  'health': '#F87171', // Vermelho suave para saúde
  'education': '#60A5FA', // Azul claro para educação
  'shopping': '#FBBF24', // Amarelo para compras
  'bills': '#9CA3AF', // Cinza para contas fixas
  'other-expense': '#6B7280', // Cinza escuro para outros
};

export default function SpendingPieChart({ transactions, month }: SpendingPieChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrar apenas despesas
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Agrupar por categoria
  const categoryData = expenses.reduce((acc, transaction) => {
    const categoryId = transaction.category.id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: transaction.category.name,
        total: 0,
        color: CATEGORY_COLORS[categoryId] || '#64748B',
        transactions: [],
      };
    }
    acc[categoryId].total += transaction.amount;
    acc[categoryId].transactions.push(transaction);
    return acc;
  }, {} as Record<string, { name: string; total: number; color: string; transactions: Transaction[] }>);

  const categories = Object.entries(categoryData)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total);

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.total, 0);

  // Calcular ângulos para o gráfico de pizza
  let currentAngle = -90; // Começar do topo
  const slices = categories.map(category => {
    const percentage = (category.total / totalExpenses) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...category,
      percentage,
      startAngle,
      endAngle,
    };
  });

  // Função para criar path do SVG
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(50, 50, radius, endAngle);
    const end = polarToCartesian(50, 50, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', 50, 50,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const selectedCategoryData = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)
    : null;

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Para onde foi seu dinheiro
        </h3>
        <div className="flex items-center justify-center h-56 text-gray-400">
          <p className="text-sm">Nenhuma despesa registrada neste mês</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          Para onde foi seu dinheiro
        </h3>

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Gráfico de Pizza */}
          <div className="relative w-full max-w-[240px] aspect-square">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {slices.map((slice, index) => (
                <path
                  key={slice.id}
                  d={createArcPath(slice.startAngle, slice.endAngle, 45)}
                  fill={slice.color}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => setSelectedCategory(slice.id)}
                  style={{
                    filter: selectedCategory === slice.id ? 'brightness(1.1)' : 'none',
                  }}
                />
              ))}
              {/* Círculo central branco */}
              <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
            
            {/* Total no centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] text-gray-500 font-medium">Total gasto</p>
              <p className="text-lg font-bold text-gray-900">
                R$ {totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex-1 w-full space-y-1.5">
            {categories.map(category => {
              const percentage = (category.total / totalExpenses) * 100;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-900">
                      R$ {category.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 min-w-[40px] text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedCategoryData && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${selectedCategoryData.color}20` }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedCategoryData.color }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {selectedCategoryData.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedCategoryData.transactions.length} transações
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Total */}
            <div className="p-5 bg-gray-50 border-b border-gray-100">
              <p className="text-xs text-gray-600 mb-0.5">Total gasto</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {selectedCategoryData.total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((selectedCategoryData.total / totalExpenses) * 100).toFixed(1)}% do total
              </p>
            </div>

            {/* Lista de Transações */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-2.5">
                {selectedCategoryData.transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(transaction => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {transaction.description}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(transaction.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 ml-3">
                        R$ {transaction.amount.toFixed(2)}
                      </p>
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
