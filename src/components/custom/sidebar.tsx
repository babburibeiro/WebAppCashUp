"use client";

import { Home, TrendingUp, PieChart, Target, CreditCard, Wallet, Settings, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAlerts } from '@/lib/storage';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Transações', href: '/transactions', icon: TrendingUp },
  { name: 'Relatórios', href: '/reports', icon: PieChart },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Cartões', href: '/cards', icon: CreditCard },
  { name: 'Contas', href: '/accounts', icon: Wallet },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    const alerts = getAlerts();
    setUnreadAlerts(alerts.filter(a => !a.isRead).length);
  }, []);

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CashUp</h1>
              <p className="text-[10px] text-gray-500">O upgrade da sua vida financeira</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Alerts Button */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/alerts"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <span className="text-sm">Alertas</span>
            {unreadAlerts > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
