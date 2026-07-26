'use client';

import React, { useState } from 'react';
import { X, Store, UserCheck, KeyRound, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export interface DokandarProfile {
  shopName: string;
  ownerName: string;
  phone: string;
  location: string;
  terminalId: string;
}

export const DEMO_SHOPS: DokandarProfile[] = [
  {
    shopName: 'বিসমিল্লাহ মুদি স্টোর',
    ownerName: 'প্রো: রাজীব চৌধুরী',
    phone: '01711000999',
    location: 'ধানমন্ডি, ঢাকা',
    terminalId: 'POS-DHAKA-01',
  },
  {
    shopName: 'আল-মদিনা জেনারেল স্টোর',
    ownerName: 'প্রো: হাজি সালাউদ্দিন',
    phone: '01899112233',
    location: 'চৌমুহনী, নোয়াখালী',
    terminalId: 'POS-NOAKHALI-02',
  },
  {
    shopName: 'চৌধুরী ট্রেডার্স & ডিপার্টমেন্টাল',
    ownerName: 'প্রো: করিম চৌধুরী',
    phone: '01955887766',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    terminalId: 'POS-CTG-03',
  },
];

interface DokandarLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: DokandarProfile;
  onSelectProfile: (profile: DokandarProfile) => void;
}

export const DokandarLoginModal: React.FC<DokandarLoginModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
}) => {
  const [customShop, setCustomShop] = useState('');
  const [customOwner, setCustomOwner] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  if (!isOpen) return null;

  const handleCreateCustomShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customShop || !customOwner) return;
    const newProf: DokandarProfile = {
      shopName: customShop,
      ownerName: customOwner,
      phone: customPhone || '01700000000',
      location: customLocation || 'বাংলাদেশ',
      terminalId: `POS-CUSTOM-${Date.now().toString().slice(-4)}`,
    };
    onSelectProfile(newProf);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/50 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                দোকানদার লগইন ও POS টার্মিনাল
              </h3>
              <p className="text-xs text-slate-400">আপনার দোকান সিলেক্ট করুন বা নতুন টার্মিনাল খুলুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Active Profile Pill */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                বর্তমান অ্যাক্টিভ দোকান
              </span>
              <div className="font-bold text-white text-base mt-0.5">{currentProfile.shopName}</div>
              <p className="text-xs text-slate-300">
                {currentProfile.ownerName} • {currentProfile.location}
              </p>
            </div>
            <span className="bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <UserCheck className="w-3.5 h-3.5" /> লগইনকৃত
            </span>
          </div>

          {/* Preset Demo Shops */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              🏬 ডেমো দোকান টার্মিনাল সিলেক্ট করুন (১-ক্লিক লগইন):
            </label>
            <div className="space-y-2">
              {DEMO_SHOPS.map((shop) => (
                <div
                  key={shop.terminalId}
                  onClick={() => {
                    onSelectProfile(shop);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentProfile.terminalId === shop.terminalId
                      ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-100">{shop.shopName}</div>
                      <div className="text-xs text-slate-400">
                        {shop.ownerName} • {shop.location}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-lg text-slate-400 border border-slate-700 font-mono">
                    {shop.terminalId}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Shop Login Form */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>নতুন দোকানদার রেজিস্টার / লগইন করুন:</span>
            </h4>
            <form onSubmit={handleCreateCustomShop} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="দোকানের নাম (যেমন: মা ফাতেমা স্টোর)"
                  value={customShop}
                  onChange={(e) => setCustomShop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="মালিকের নাম"
                  value={customOwner}
                  onChange={(e) => setCustomOwner(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="মোবাইল নম্বর"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>POS টার্মিনালে প্রবেশ করুন</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
