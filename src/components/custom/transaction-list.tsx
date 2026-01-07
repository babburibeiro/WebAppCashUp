"use client";

import { Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils-finance';
import { Trash2, Receipt } from 'lucide-react';
import { deleteTransaction } from '@/lib/storage';
import * as Icons from 'lucide-react';

type TransactionListProps = {
  transactions: Transaction[];
  onUpdate: () => void;
};

export default function TransactionList({ transactions, onUpdate }: TransactionListProps) {
  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta transação?')) {
      deleteTransaction(id);
      onUpdate();
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
        <div className="w-14 h-14 bg-gray-50 rounded-xl mx-auto mb-3.5 flex items-center justify-center">
          <Receipt className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1.5">
          Nenhuma transação
        </h3>
        <p className="text-xs text-gray-500">
          Adicione sua primeira transação clicando no botão +
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Transações</h2>
        <p className="text-[10px] text-gray-500 mt-0.5">{transactions.length} registros</p>
      </div>
      <div className="divide-y divide-gray-50">
        {transactions.map((transaction) => {
          const IconComponent = (Icons as any)[transaction.category.icon];
          const isIncome = transaction.type === 'income';
          
          return (
            <div
              key={transaction.id}
              className="px-5 py-3.5 hover:bg-gray-50 transition-colors flex items-center gap-3.5"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: transaction.category.color + '15' }}
              >
                {IconComponent && (
                  <IconComponent
                    className="w-4.5 h-4.5"
                    style={{ color: transaction.category.color }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-xs">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                  <span>{transaction.category.name}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    isIncome ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(transaction.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
