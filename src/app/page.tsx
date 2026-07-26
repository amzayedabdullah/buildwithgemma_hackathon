'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { LedgerDashboard } from '../components/LedgerDashboard';
import { VoiceInputModal } from '../components/VoiceInputModal';
import { ReminderModal } from '../components/ReminderModal';
import { AnalyticsView } from '../components/AnalyticsView';
import { DokandarLoginModal, DokandarProfile, DEMO_SHOPS } from '../components/DokandarLoginModal';
import { POSBillingModal } from '../components/POSBillingModal';
import { Customer, Transaction, GemmaIntentResult } from '../types/ledger';
import {
  getStoredCustomers,
  saveStoredCustomers,
  getStoredTransactions,
  saveStoredTransactions,
  exportLedgerToCSV,
} from '../utils/storage';
import { Sparkles, BarChart2, BookOpen, Download, RefreshCw, Store, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dokandar Profile State
  const [dokandarProfile, setDokandarProfile] = useState<DokandarProfile>(DEMO_SHOPS[0]);
  const [isDokandarModalOpen, setIsDokandarModalOpen] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [reminderCustomer, setReminderCustomer] = useState<Customer | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'ANALYTICS'>('LEDGER');

  // Load real-time stored data on client mount to eliminate SSR hydration mismatch
  useEffect(() => {
    setCustomers(getStoredCustomers());
    setTransactions(getStoredTransactions());
    setIsLoaded(true);
  }, []);

  const totalBaki = customers.reduce((acc, c) => acc + c.totalBaki, 0);

  const handleAddTransactionFromGemma = (
    result: GemmaIntentResult,
    dialect?: string,
    rawTranscript?: string
  ) => {
    let existingCustomer = customers.find((c) => c.name === result.customerName);
    let customerId = existingCustomer ? existingCustomer.id : `cust-${Date.now()}`;
    const nowStr = new Date().toISOString().split('T')[0];

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId,
      customerName: result.customerName,
      customerPhone: result.phone || '01700000000',
      type: result.type,
      items: result.items,
      totalAmount: result.totalAmount,
      cashPaid: result.cashPaid,
      netBaki: result.netBaki,
      date: `২০২৬-০৭-২৬ ${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`,
      dialect: dialect || 'Standard Bangla',
      rawAudioTranscript: rawTranscript,
      riskLevel: result.riskLevel,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    saveStoredTransactions(updatedTxs);

    let updatedCusts: Customer[];
    if (existingCustomer) {
      updatedCusts = customers.map((c) =>
        c.id === customerId
          ? {
            ...c,
            totalBaki: c.totalBaki + result.netBaki,
            lastTransactionDate: nowStr,
            transactionCount: c.transactionCount + 1,
          }
          : c
      );
    } else {
      const newCust: Customer = {
        id: customerId,
        name: result.customerName,
        phone: result.phone || '01700000000',
        totalBaki: result.netBaki,
        lastTransactionDate: nowStr,
        riskLevel: result.riskLevel,
        transactionCount: 1,
      };
      updatedCusts = [newCust, ...customers];
    }

    setCustomers(updatedCusts);
    saveStoredCustomers(updatedCusts);
  };

  const handleOpenReminder = (cust: Customer) => {
    setReminderCustomer(cust);
    setIsReminderModalOpen(true);
  };

  const handleExportCSV = () => {
    exportLedgerToCSV(transactions);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
          <span>Hisab.AI (হিসাব.এআই) ডাটাবেস লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* Top Header Navbar */}
      <Navbar
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenPOSModal={() => setIsPOSModalOpen(true)}
        onOpenDokandarModal={() => setIsDokandarModalOpen(true)}
        currentProfile={dokandarProfile}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        totalBaki={totalBaki}
        totalCustomers={customers.filter((c) => c.totalBaki > 0).length}
      />

      {/* Hero Banner Strip */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Hisab.AI
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              আঞ্চলিক বাংলা ভয়েস ইনপুট থেকে রিয়েল-টাইমে বাকি খাতা প্রস্তুত ও স্মার্ট তাগাদা বার্তা তৈরি করে।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPOSModalOpen(true)}
              className="flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>POS ক্যাশমেমো</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              title="CSV ফাইল ডাউনলোড করুন"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>এক্সপোর্ট CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'LEDGER'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ডিজিটাল বাকি খাতা</span>
            </button>
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'ANALYTICS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>ঝুঁকি ও অ্যানালিটিক্স</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'LEDGER' ? (
          <LedgerDashboard
            customers={customers}
            transactions={transactions}
            onOpenReminderModal={handleOpenReminder}
          />
        ) : (
          <AnalyticsView customers={customers} transactions={transactions} />
        )}
      </main>

      {/* Modals */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddTransaction={handleAddTransactionFromGemma}
        apiKey={apiKey}
      />

      <ReminderModal
        customer={reminderCustomer}
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        apiKey={apiKey}
      />

      <DokandarLoginModal
        isOpen={isDokandarModalOpen}
        onClose={() => setIsDokandarModalOpen(false)}
        currentProfile={dokandarProfile}
        onSelectProfile={setDokandarProfile}
      />

      <POSBillingModal
        isOpen={isPOSModalOpen}
        onClose={() => setIsPOSModalOpen(false)}
        customers={customers}
        onAddTransaction={handleAddTransactionFromGemma}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-400">
        <p className="font-medium">
          Hisab.AI (হিসাব.এআই) - Built by <span className="text-emerald-400 font-bold">Team BrainForge | UIU</span> for Build With Gemma @ Bangladesh Hackathon 2026
        </p>
      </footer>
    </div>
  );
}
