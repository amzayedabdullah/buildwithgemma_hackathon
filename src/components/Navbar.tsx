'use client';

import React from 'react';
import { Mic, BookOpen, Store, ShoppingBag } from 'lucide-react';
import { DokandarProfile } from './DokandarLoginModal';

interface NavbarProps {
  onOpenVoiceModal: () => void;
  onOpenPOSModal: () => void;
  onOpenDokandarModal: () => void;
  currentProfile: DokandarProfile;
  apiKey?: string;
  onApiKeyChange?: (key: string) => void;
  totalBaki: number;
  totalCustomers: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVoiceModal,
  onOpenPOSModal,
  onOpenDokandarModal,
  currentProfile,
  totalBaki,
  totalCustomers,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-500/20 text-white px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand - Minimal & Clean English Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <BookOpen className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-emerald-200 to-teal-400 bg-clip-text text-transparent">
            Hisab.AI
          </h1>
        </div>

        {/* Center / Shopkeeper Terminal Status & Ledger Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDokandarModal}
            className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl px-3.5 py-1.5 transition-all text-left group shadow-sm"
            title="দোকানদার অ্যাকাউন্ট পরিবর্তন করুন"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">
                দোকানদার টার্মিনাল ({currentProfile.terminalId}):
              </span>
              <span className="text-xs font-bold text-emerald-300 group-hover:underline">
                {currentProfile.shopName}
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-1.5 text-sm shadow-sm">
            <div>
              <span className="text-slate-400 text-[10px] block">মোট অনাদায়ী বাকি</span>
              <span className="font-bold text-amber-400 text-sm">৳ {totalBaki.toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 text-[10px] block">বাকি কাস্টমার</span>
              <span className="font-bold text-emerald-400 text-sm">{totalCustomers} জন</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPOSModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95"
            title="POS মুদি বিল তৈরি করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
            <span>POS বিল</span>
          </button>

          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 text-xs"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>ভয়েসে হিসাব লিখুন</span>
          </button>
        </div>
      </div>
    </header>
  );
};
