"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/custom/sidebar';
import BottomNav from '@/components/custom/bottom-nav';
import Navbar from '@/components/custom/navbar';
import { getCards, saveCard, updateCard, deleteCard, getAccounts } from '@/lib/storage';
import { formatCurrency, calculateAvailableCardLimit, isCardNearLimit, getDaysUntilDueDate } from '@/lib/utils-finance';
import { Card, CardType, Account } from '@/lib/types';
import { Plus, CreditCard, AlertCircle, Edit2, Trash2, X } from 'lucide-react';

const CARD_COLORS = [
  '#1E40AF', '#7C3AED', '#DB2777', '#DC2626', '#EA580C',
  '#CA8A04', '#16A34A', '#0891B2', '#4F46E5', '#BE123C'
];

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit' as CardType,
    lastDigits: '',
    limit: '',
    closingDay: '',
    dueDay: '',
    accountId: '',
    color: CARD_COLORS[0],
  });

  const loadData = () => {
    setCards(getCards());
    setAccounts(getAccounts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData: Card = {
      id: editingCard?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      lastDigits: formData.lastDigits,
      limit: formData.type === 'credit' ? parseFloat(formData.limit) || undefined : undefined,
      usedLimit: editingCard?.usedLimit || 0,
      closingDay: formData.type === 'credit' ? parseInt(formData.closingDay) || undefined : undefined,
      dueDay: formData.type === 'credit' ? parseInt(formData.dueDay) || undefined : undefined,
      accountId: formData.accountId || undefined,
      color: formData.color,
      createdAt: editingCard?.createdAt || new Date().toISOString(),
    };

    if (editingCard) {
      updateCard(cardData.id, cardData);
    } else {
      saveCard(cardData);
    }

    loadData();
    handleCloseModal();
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      type: card.type,
      lastDigits: card.lastDigits,
      limit: card.limit?.toString() || '',
      closingDay: card.closingDay?.toString() || '',
      dueDay: card.dueDay?.toString() || '',
      accountId: card.accountId || '',
      color: card.color,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
      deleteCard(id);
      loadData();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCard(null);
    setFormData({
      name: '',
      type: 'credit',
      lastDigits: '',
      limit: '',
      closingDay: '',
      dueDay: '',
      accountId: '',
      color: CARD_COLORS[0],
    });
  };

  const totalAvailableLimit = calculateAvailableCardLimit(cards);

  return (
    <div className="min-h-screen bg-[#FAFAFA] md:pl-64">
      <Sidebar />
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cartões</h1>
          <p className="text-sm text-gray-500">Gerencie seus cartões de crédito e débito</p>
        </div>

        {/* Total Available Limit */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
          <p className="text-sm opacity-90 mb-1">Limite Disponível Total</p>
          <p className="text-3xl font-bold">{formatCurrency(totalAvailableLimit)}</p>
          <p className="text-xs opacity-75 mt-2">{cards.filter(c => c.type === 'credit').length} cartão(ões) de crédito</p>
        </div>

        {/* Cards List */}
        <div className="space-y-3 mb-6">
          {cards.map((card) => {
            const isCredit = card.type === 'credit';
            const usagePercentage = isCredit && card.limit ? ((card.usedLimit || 0) / card.limit) * 100 : 0;
            const nearLimit = isCardNearLimit(card);
            const daysUntilDue = getDaysUntilDueDate(card);
            
            return (
              <div 
                key={card.id} 
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ backgroundColor: card.color }}
              >
                {/* Card Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs opacity-75 mb-1">{isCredit ? 'Crédito' : 'Débito'}</p>
                      <h3 className="text-lg font-bold">{card.name}</h3>
                      <p className="text-sm opacity-90 mt-1">•••• {card.lastDigits}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isCredit && card.limit && (
                    <>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="opacity-90">Limite Usado</span>
                          <span className="font-semibold">
                            {formatCurrency(card.usedLimit || 0)} / {formatCurrency(card.limit)}
                          </span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {nearLimit && (
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 mb-3">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-xs font-medium">Atenção: Limite próximo de {usagePercentage.toFixed(0)}%</p>
                        </div>
                      )}

                      {card.dueDay && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-90">Vencimento</span>
                          <span className="font-semibold">
                            Dia {card.dueDay} ({daysUntilDue} dias)
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {cards.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhum cartão cadastrado</p>
              <p className="text-sm text-gray-400">Adicione seu primeiro cartão para começar</p>
            </div>
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 md:bottom-8 right-4 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Cartão
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Nubank Mastercard"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'credit' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === 'credit'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <p className="text-sm font-medium">Crédito</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'debit' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === 'debit'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <p className="text-sm font-medium">Débito</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Últimos 4 Dígitos
                  </label>
                  <input
                    type="text"
                    value={formData.lastDigits}
                    onChange={(e) => setFormData({ ...formData, lastDigits: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                {formData.type === 'credit' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Limite
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.limit}
                        onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                        placeholder="0,00"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dia Fechamento
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={formData.closingDay}
                          onChange={(e) => setFormData({ ...formData, closingDay: e.target.value })}
                          placeholder="10"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dia Vencimento
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={formData.dueDay}
                          onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                          placeholder="20"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conta Vinculada (Opcional)
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Nenhuma</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {CARD_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-full transition-all ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  {editingCard ? 'Salvar Alterações' : 'Criar Cartão'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
