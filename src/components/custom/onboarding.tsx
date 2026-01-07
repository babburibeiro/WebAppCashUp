"use client";

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { saveUserProfile } from '@/lib/storage';
import { User, Calendar, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

type OnboardingProps = {
  onComplete: () => void;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!name.trim()) {
        newErrors.name = 'Por favor, digite seu nome';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
      }
    }

    if (step === 2) {
      const ageNum = parseInt(age);
      if (!age) {
        newErrors.age = 'Por favor, informe sua idade';
      } else if (isNaN(ageNum) || ageNum < 14 || ageNum > 120) {
        newErrors.age = 'Por favor, informe uma idade válida (14-120)';
      }
    }

    if (step === 3) {
      const salaryNum = parseFloat(salary.replace(/\./g, '').replace(',', '.'));
      if (!salary) {
        newErrors.salary = 'Por favor, informe seu salário mensal';
      } else if (isNaN(salaryNum) || salaryNum < 0) {
        newErrors.salary = 'Por favor, informe um valor válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      name: name.trim(),
      age: parseInt(age),
      monthlySalary: parseFloat(salary.replace(/\./g, '').replace(',', '.')),
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };

    saveUserProfile(profile);
    onComplete();
  };

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setSalary(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-3 shadow-lg">
            <Sparkles className="w-5.5 h-5.5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Bem-vindo ao CashUp!
          </h1>
          <p className="text-xs text-gray-600">
            O upgrade da sua vida financeira 💰
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5 text-center">
            Passo {step} de 3
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-xl p-5 border border-gray-100">
          {/* Step 1: Nome */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 bg-emerald-100 rounded-lg mb-3">
                  <User className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Como você se chama?
                </h2>
                <p className="text-xs text-gray-600">
                  Vamos personalizar sua experiência
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="Digite seu nome"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-emerald-500'
                  }`}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1.5">{errors.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Idade */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 bg-teal-100 rounded-lg mb-3">
                  <Calendar className="w-4.5 h-4.5 text-teal-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Qual sua idade?
                </h2>
                <p className="text-xs text-gray-600">
                  Isso nos ajuda a dar dicas personalizadas
                </p>
              </div>

              <div>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="Digite sua idade"
                  min="14"
                  max="120"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                    errors.age
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  autoFocus
                />
                {errors.age && (
                  <p className="text-red-500 text-[10px] mt-1.5">{errors.age}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Salário */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 bg-cyan-100 rounded-lg mb-3">
                  <DollarSign className="w-4.5 h-4.5 text-cyan-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Qual seu salário mensal?
                </h2>
                <p className="text-xs text-gray-600">
                  Vamos te ajudar a organizar suas finanças
                </p>
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">
                    R$
                  </span>
                  <input
                    type="text"
                    value={salary}
                    onChange={handleSalaryChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                    placeholder="0,00"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-cyan-100 ${
                      errors.salary
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-cyan-500'
                    }`}
                    autoFocus
                  />
                </div>
                {errors.salary && (
                  <p className="text-red-500 text-[10px] mt-1.5">{errors.salary}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-xs rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 text-xs rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {step === 3 ? 'Começar' : 'Continuar'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-500 mt-4">
          Seus dados são armazenados localmente e com segurança
        </p>
      </div>
    </div>
  );
}
