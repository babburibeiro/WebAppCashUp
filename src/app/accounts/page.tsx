"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/custom/sidebar';
import BottomNav from '@/components/custom/bottom-nav';
import Navbar from '@/components/custom/navbar';
import { getAccounts, saveAccount, updateAccount, deleteAccount } from '@/lib/storage';
import { calculateTotalBalance, formatCurrency } from '@/lib/utils-finance';
import { Account, AccountType } from '@/lib/types';
import { Plus, Wallet, TrendingUp, PiggyBank, DollarSign, MoreHorizontal, Edit2, Trash2, X } from 'lucide-react';

const ACCOUNT_TYPES: { value: AccountType; label: string; icon: any }[] = [
  { value: 'checking', label: 'Conta Corrente', icon: Wallet },
  { value: 'savings', label: 'Poupança', icon: PiggyBank },
  { value: 'investment', label: 'Investimento', icon: TrendingUp },
  { value: 'cash', label: 'Dinheiro', icon: DollarSign },
  { value: 'other', label: 'Outro', icon: MoreHorizontal },
];

const ACCOUNT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as AccountType,
    balance: '',
    color: ACCOUNT_COLORS[0],
  });

  const loadData = () => {
    setAccounts(getAccounts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData: Account = {
      id: editingAccount?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
      icon: ACCOUNT_TYPES.find(t => t.value === formData.type)?.icon.name || 'Wallet',
      color: formData.color,
      createdAt: editingAccount?.createdAt || new Date().toISOString(),
    };

    if (editingAccount) {
      updateAccount(accountData.id, accountData);
    } else {
      saveAccount(accountData);
    }

    loadData();
    handleCloseModal();
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      color: account.color,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      deleteAccount(id);
      loadData();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      color: ACCOUNT_COLORS[0],
    });
  };

  const totalBalance = calculateTotalBalance(accounts);

  return (
    <div className="min-h-screen bg-[#FAFAFA] md:pl-64">
      <Sidebar />
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contas</h1>
          <p className="text-sm text-gray-500">Gerencie suas contas bancárias e carteiras</p>
        </div>

        {/* Total Balance */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 text-white">
          <p className="text-sm opacity-90 mb-1">Saldo Total</p>
          <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
          <p className="text-xs opacity-75 mt-2">{accounts.length} conta{accounts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Accounts List */}
        <div className="space-y-3 mb-6">
          {accounts.map((account) => {
            const TypeIcon = ACCOUNT_TYPES.find(t => t.value === account.type)?.icon || Wallet;
            
            return (
              <div key={account.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${account.color}20` }}
                    >
                      <TypeIcon className="w-6 h-6" style={{ color: account.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-xs text-gray-500">
                        {ACCOUNT_TYPES.find(t => t.value === account.type)?.label}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {accounts.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhuma conta cadastrada</p>
              <p className="text-sm text-gray-400">Adicione sua primeira conta para começar</p>
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
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
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
                    Nome da Conta
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Banco Inter"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Conta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACCOUNT_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formData.type === type.value
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1 ${
                            formData.type === type.value ? 'text-emerald-600' : 'text-gray-600'
                          }`} />
                          <p className={`text-xs font-medium ${
                            formData.type === type.value ? 'text-emerald-700' : 'text-gray-700'
                          }`}>
                            {type.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saldo Inicial
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="0,00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {ACCOUNT_COLORS.map((color) => (
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
                  {editingAccount ? 'Salvar Alterações' : 'Criar Conta'}
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
