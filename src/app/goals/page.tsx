"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/custom/sidebar';
import BottomNav from '@/components/custom/bottom-nav';
import Navbar from '@/components/custom/navbar';
import { getGoals, saveGoal, updateGoal, deleteGoal, getAccounts } from '@/lib/storage';
import { formatCurrency, calculateGoalProgress, calculateMonthsToGoal, calculateRequiredMonthlyContribution } from '@/lib/utils-finance';
import { Goal, Account } from '@/lib/types';
import { Plus, Target, TrendingUp, Calendar, DollarSign, Edit2, Trash2, X } from 'lucide-react';

const GOAL_ICONS = ['🎯', '🏠', '🚗', '✈️', '💰', '🎓', '💍', '🎉', '📱', '💻'];
const GOAL_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: GOAL_ICONS[0],
    color: GOAL_COLORS[0],
    accountId: '',
    monthlyContribution: '',
  });

  const loadData = () => {
    setGoals(getGoals());
    setAccounts(getAccounts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount) || 0,
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      icon: formData.icon,
      color: formData.color,
      accountId: formData.accountId || undefined,
      monthlyContribution: parseFloat(formData.monthlyContribution) || undefined,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
    };

    if (editingGoal) {
      updateGoal(goalData.id, goalData);
    } else {
      saveGoal(goalData);
    }

    loadData();
    handleCloseModal();
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      icon: goal.icon,
      color: goal.color,
      accountId: goal.accountId || '',
      monthlyContribution: goal.monthlyContribution?.toString() || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteGoal(id);
      loadData();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      icon: GOAL_ICONS[0],
      color: GOAL_COLORS[0],
      accountId: '',
      monthlyContribution: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] md:pl-64">
      <Sidebar />
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Metas</h1>
          <p className="text-sm text-gray-500">Defina e acompanhe seus objetivos financeiros</p>
        </div>

        {/* Goals List */}
        <div className="space-y-4 mb-6">
          {goals.map((goal) => {
            const progress = calculateGoalProgress(goal);
            const monthsLeft = calculateMonthsToGoal(goal);
            const requiredMonthly = calculateRequiredMonthlyContribution(goal);
            
            return (
              <div key={goal.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{goal.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{progress.toFixed(1)}% concluído</span>
                    <span className="text-gray-500">{monthsLeft} meses restantes</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: goal.color 
                      }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-500">Prazo</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-500">Mensal Necessário</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(requiredMonthly)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhuma meta cadastrada</p>
              <p className="text-sm text-gray-400">Defina sua primeira meta financeira</p>
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
                  {editingGoal ? 'Editar Meta' : 'Nova Meta'}
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
                    Nome da Meta
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Viagem para Europa"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Alvo
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      placeholder="0,00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Atual
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                      placeholder="0,00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribuição Mensal (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthlyContribution}
                    onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
                    placeholder="0,00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ícone
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {GOAL_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                          formData.icon === icon ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {GOAL_COLORS.map((color) => (
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
                  {editingGoal ? 'Salvar Alterações' : 'Criar Meta'}
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
