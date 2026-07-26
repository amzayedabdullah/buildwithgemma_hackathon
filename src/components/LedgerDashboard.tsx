'use client';

import React, { useState } from 'react';
import { Customer, Transaction } from '../types/ledger';
import {
  Search,
  UserCheck,
  Send,
  Volume2,
  Calendar,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

interface LedgerDashboardProps {
  customers: Customer[];
  transactions: Transaction[];
  onOpenReminderModal: (customer: Customer) => void;
}

export const LedgerDashboard: React.FC<LedgerDashboardProps> = ({
  customers,
  transactions,
  onOpenReminderModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (c) => c.name.includes(searchTerm) || c.phone.includes(searchTerm)
  );

  const activeCustomer = selectedCustomerId
    ? customers.find((c) => c.id === selectedCustomerId)
    : null;

  const activeCustomerTransactions = selectedCustomerId
    ? transactions.filter((t) => t.customerId === selectedCustomerId)
    : transactions;

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Customer Baki List (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="কাস্টমার নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Customer Cards List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomerId(cust.id === selectedCustomerId ? null : cust.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                cust.id === selectedCustomerId
                  ? 'border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
                    {cust.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{cust.name}</h4>
                    <p className="text-xs text-slate-400">{cust.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">বাকি ব্যালেন্স</span>
                  <span
                    className={`font-extrabold text-base ${
                      cust.totalBaki > 2000
                        ? 'text-rose-400'
                        : cust.totalBaki > 500
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    ৳ {cust.totalBaki.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> শেষ বাকি: {cust.lastTransactionDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Detailed Transaction Ledger (7 cols) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-lg">
              {activeCustomer ? `${activeCustomer.name}-এর বাকি খাতা` : 'সাম্প্রতিক সকল লেনদেন'}
            </h3>
            <p className="text-xs text-slate-400">
              Gemma AI ভয়েস ইন্টেলিজেন্স দ্বারা তৈরি ডিজিটাল লেজার
            </p>
          </div>

          {activeCustomer && (
            <button
              onClick={() => setSelectedCustomerId(null)}
              className="text-xs text-emerald-400 hover:underline"
            >
              সকল লেনদেন দেখুন
            </button>
          )}
        </div>

        {/* Transaction History List */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {activeCustomerTransactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>কোনো লেনদেন পাওয়া যায়নি</p>
            </div>
          ) : (
            activeCustomerTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-slate-700">
                      {tx.customerName}
                    </span>
                    {tx.dialect && (
                      <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] px-2 py-0.5 rounded-full">
                        {tx.dialect}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{tx.date}</span>
                </div>

                {/* Spoken Transcript Bubble */}
                {tx.rawAudioTranscript && (
                  <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <p className="text-slate-300 italic flex-1">"{tx.rawAudioTranscript}"</p>
                    <button
                      onClick={() => handleSpeakText(tx.rawAudioTranscript!)}
                      className="ml-2 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="ভয়েসে শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                )}

                {/* Itemized List */}
                <div className="space-y-1 text-xs">
                  {tx.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-400">
                      <span>• {item.name}</span>
                      <span>৳ {item.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">মোট: ৳ {tx.totalAmount}</span>
                    <span className="text-teal-400 font-medium">ক্যাশ: ৳ {tx.cashPaid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 mr-1">নিট বাকি:</span>
                    <span className="font-extrabold text-amber-400 text-sm">৳ {tx.netBaki}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
