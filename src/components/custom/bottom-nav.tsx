"use client";

import { Home, TrendingUp, PieChart, Target, Settings, CreditCard, Wallet, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Transações', href: '/transactions', icon: TrendingUp },
  { name: 'Relatórios', href: '/reports', icon: PieChart },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Cartões', href: '/cards', icon: CreditCard },
  { name: 'Contas', href: '/accounts', icon: Wallet },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
