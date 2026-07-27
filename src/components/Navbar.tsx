'use client';

import React from 'react';
import {
  Mic,
  BookOpen,
  Store,
  ShoppingBag,
  Database,
  LogIn,
  Home,
  LogOut,
  Download,
  BarChart2,
  Book,
} from 'lucide-react';
import { DokandarProfile } from './DokandarLoginModal';

interface NavbarProps {
  onNavigateHome: () => void;
  onOpenVoiceModal: () => void;
  onOpenPOSModal: () => void;
  onOpenDokandarModal: () => void;
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onOpenDatabaseSetup: () => void;
  onExportCSV: () => void;
  onLogout: () => void;
  activeTab?: 'LEDGER' | 'ANALYTICS';
  onTabChange?: (tab: 'LEDGER' | 'ANALYTICS') => void;
  currentProfile: DokandarProfile | null;
  totalBaki: number;
  totalCustomers: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onOpenVoiceModal,
  onOpenPOSModal,
  onOpenDokandarModal,
  onOpenAuth,
  onOpenDatabaseSetup,
  onExportCSV,
  onLogout,
  activeTab = 'LEDGER',
  onTabChange,
  currentProfile,
  totalBaki,
  totalCustomers,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Home Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group focus:outline-none"
            title="হোমপেজে ফিরে যান"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold group-hover:bg-emerald-500/20 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Hisab.AI
              </h1>
              <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                <Home className="w-3 h-3 text-emerald-400" /> হোমপেজ
              </span>
            </div>
          </button>

          {/* Active Terminal Badge when logged in */}
          {currentProfile && (
            <button
              onClick={onOpenDokandarModal}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 py-1.5 transition-all text-left group"
              title="দোকানদার টার্মিনাল পরিবর্তন করুন"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block font-medium">
                  টার্মিনাল ({currentProfile.terminalId}):
                </span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                  {currentProfile.shopName}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Center: View Switcher (Ledger vs Analytics) & Financial Summary Pill */}
        {currentProfile ? (
          <div className="flex items-center gap-3">
            {/* View Switcher Segment */}
            {onTabChange && (
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => onTabChange('LEDGER')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    activeTab === 'LEDGER'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Book className="w-3.5 h-3.5" />
                  <span>ডিজিটাল খাতা</span>
                </button>
                <button
                  onClick={() => onTabChange('ANALYTICS')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    activeTab === 'ANALYTICS'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>অ্যানালিটিক্স</span>
                </button>
              </div>
            )}

            {/* Total Baki Pill */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">মোট অনাদায়ী বাকি</span>
                <span className="font-bold text-amber-400">৳ {totalBaki.toLocaleString()}</span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 text-[10px] block">বাকি কাস্টমার</span>
                <span className="font-bold text-emerald-400">{totalCustomers} জন</span>
              </div>
            </div>
          </div>
        ) : (
          /* Unauthenticated State: Single Primary Button */
          <button
            onClick={() => onOpenAuth('LOGIN')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4.5 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>লগইন / রেজিস্টার</span>
          </button>
        )}

        {/* Right: Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {currentProfile ? (
            <>
              <button
                onClick={onOpenPOSModal}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95"
                title="POS ক্যাশমেমো বিল তৈরি করুন"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                <span>POS বিল</span>
              </button>

              <button
                onClick={onOpenVoiceModal}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl transition-all text-xs shadow-md active:scale-95"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>ভয়েসে লিখুন</span>
              </button>

              <button
                onClick={onExportCSV}
                className="hidden md:flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                title="CSV ফাইল ডাউনলোড করুন"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={onOpenDatabaseSetup}
                className="hidden lg:flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                title="ডাটাবেস ও সিকিউরিটি সেটআপ"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>DB</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                title="অ্যাকাউন্ট থেকে লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>লগআউট</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenDatabaseSetup}
              className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              title="ডাটাবেস ও সিকিউরিটি সেটআপ"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>DB সেটআপ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
