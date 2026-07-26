'use client';

import React from 'react';
import { Customer, Transaction } from '../types/ledger';
import { TrendingUp, AlertOctagon, ShieldAlert, CheckCircle } from 'lucide-react';

interface AnalyticsViewProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ customers, transactions }) => {
  const totalBaki = customers.reduce((sum, c) => sum + c.totalBaki, 0);
  const highRiskCount = customers.filter((c) => c.riskLevel === 'HIGH').length;
  const mediumRiskCount = customers.filter((c) => c.riskLevel === 'MEDIUM').length;
  const lowRiskCount = customers.filter((c) => c.riskLevel === 'LOW').length;

  const topDebtors = [...customers].sort((a, b) => b.totalBaki - a.totalBaki).slice(0, 3);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Hisab.AI (হিসাব.এআই) বাকি অ্যানালিটিক্স ও রিস্ক রিপোর্ট
          </h3>
          <p className="text-xs text-slate-400">
            Gemma AI কৃত্রিম বুদ্ধিমত্তা দ্বারা বাকি আদায় ঝুঁকি বিশ্লেষণ
          </p>
        </div>
      </div>

      {/* Risk Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950/60 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">উচ্চ ঝুঁকি বাকি কাস্টমার</span>
            <span className="text-xl font-extrabold text-rose-400">{highRiskCount} জন</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">৳ ২০০০+ দীর্ঘদিনের অনাদায়ী</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">মাঝারি ঝুঁকি বাকি কাস্টমার</span>
            <span className="text-xl font-extrabold text-amber-400">{mediumRiskCount} জন</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">৳ ৫০০ – ২০০০ বাকির পরিমাণ</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">নিরাপদ / স্বাভাবিক কাস্টমার</span>
            <span className="text-xl font-extrabold text-emerald-400">{lowRiskCount} জন</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">নিয়মিত বাকি শোধকারী</span>
          </div>
        </div>
      </div>

      {/* Top Debtors Ranking Table */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-300">শীর্ষ ৩ বাকি অনাদায়ী কাস্টমার (তাগাদা দেওয়া প্রয়োজন):</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topDebtors.map((debtor, idx) => (
            <div key={debtor.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <span className="absolute top-2 right-3 font-black text-2xl text-slate-800">
                #{idx + 1}
              </span>
              <h5 className="font-bold text-white text-sm mb-1">{debtor.name}</h5>
              <p className="text-xs text-slate-400 mb-2">{debtor.phone}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">বাকি পরিমাণ:</span>
                <span className="font-bold text-rose-400">৳ {debtor.totalBaki}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
