'use client';

import React, { useState } from 'react';
import { X, Database, RefreshCcw, Download, ShieldCheck, HardDrive, Key, Cpu, Sparkles, CheckCircle } from 'lucide-react';
import { getDatabaseStats, exportFullDatabaseBackup, getStoredDokandars, DEFAULT_DOKANDARS } from '../services/dbService';
import { Customer, Transaction } from '../types/ledger';

interface DatabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  transactions: Transaction[];
  onResetToDemoData?: () => void;
}

export const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({
  isOpen,
  onClose,
  customers,
  transactions,
  onResetToDemoData,
}) => {
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const stats = getDatabaseStats(customers, transactions);
  const dokandars = getStoredDokandars();

  const handleExportJSON = () => {
    exportFullDatabaseBackup(customers, transactions);
  };

  const handleCopyCredentials = () => {
    const text = DEFAULT_DOKANDARS.map(
      (d) => `দোকান: ${d.shopName}\nমোবাইল/ইউজার: ${d.phone}\nপাসওয়ার্ড: ${d.password}`
    ).join('\n-------------------\n');
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ডাটাবেস ও সিকিউর ক্রেডেনশিয়াল সেটআপ
              </h3>
              <p className="text-xs text-slate-400">
                অফলাইন-ফার্স্ট LocalStorage & Client Database Engine (v{stats.version})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>DB অবস্থা</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>সক্রিয় (Sync)</span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>নিবন্ধিত দোকান</span>
                <HardDrive className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-base font-extrabold text-white">
                {stats.totalDokandars} টি দোকান
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>মোট লেনদেন</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-base font-extrabold text-white">
                {stats.totalTransactions} টি রেকর্ড
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>স্টোরেজ সাইজ</span>
                <Database className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-base font-extrabold text-amber-300">
                {stats.estimatedStorageKB} KB
              </div>
            </div>
          </div>

          {/* Credentials Info Box */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>টেস্টিং ডেমো ক্রেডেনশিয়ালস (Judges Quick Login)</span>
              </h4>
              <button
                onClick={handleCopyCredentials}
                className="text-[11px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                {copiedMsg ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>কপি ডেমো লগইন</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {DEFAULT_DOKANDARS.map((u, i) => (
                <div
                  key={i}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{u.shopName}</span>
                    <span className="text-[11px] text-slate-400">
                      মোবাইল: <code className="text-emerald-300">{u.phone}</code> | ইউজার: <code className="text-teal-300">{u.username}</code>
                    </span>
                  </div>
                  <div className="bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700 text-[11px] font-mono">
                    পাসওয়ার্ড: <span className="text-amber-400 font-bold">{u.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Backup & Control Actions */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleExportJSON}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>সম্পূর্ণ ডাটাবেস ব্যাকআপ (JSON Export)</span>
            </button>

            {onResetToDemoData && (
              <button
                onClick={onResetToDemoData}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>রি-সিডিং ডেমো ডাটাবেস</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
