"use client";

import { Wallet, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/storage';

export default function Navbar() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setUserName(profile.name);
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">CashUp</h1>
              <p className="text-[10px] text-gray-500 leading-none">O upgrade da sua vida financeira</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            {userName && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <User className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{userName}</span>
              </div>
            )}
            <button 
              className="p-2 rounded-full hover:bg-gray-50 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
