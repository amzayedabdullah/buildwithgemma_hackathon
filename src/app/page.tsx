'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { LedgerDashboard } from '../components/LedgerDashboard';
import { VoiceInputModal } from '../components/VoiceInputModal';
import { ReminderModal } from '../components/ReminderModal';
import { AnalyticsView } from '../components/AnalyticsView';
import { DokandarLoginModal, DokandarProfile, DEMO_SHOPS } from '../components/DokandarLoginModal';
import { POSBillingModal } from '../components/POSBillingModal';
import { DatabaseSetupModal } from '../components/DatabaseSetupModal';
import { LandingPage } from '../components/LandingPage';
import { AuthView } from '../components/AuthView';
import { Customer, Transaction, GemmaIntentResult } from '../types/ledger';
import {
  getStoredCustomersForTerminal,
  saveStoredCustomersForTerminal,
  getStoredTransactionsForTerminal,
  saveStoredTransactionsForTerminal,
  resetDatabaseForTerminal,
  exportLedgerToCSV,
} from '../utils/storage';
import {
  getActiveDokandarSession,
  setActiveDokandarSession,
  logoutDokandarSession,
  DokandarUser,
} from '../services/dbService';
import { RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Page() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'APP' | 'AUTH'>('LANDING');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  const [dokandarProfile, setDokandarProfile] = useState<DokandarUser | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isDokandarModalOpen, setIsDokandarModalOpen] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);
  const [isDatabaseSetupOpen, setIsDatabaseSetupOpen] = useState(false);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [reminderCustomer, setReminderCustomer] = useState<Customer | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'ANALYTICS'>('LEDGER');
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'SUCCESS' | 'ERROR' } | null>(null);

  // Load active session and user-specific data on mount
  useEffect(() => {
    const activeSession = getActiveDokandarSession();
    if (activeSession) {
      setDokandarProfile(activeSession);
      setCustomers(getStoredCustomersForTerminal(activeSession.terminalId));
      setTransactions(getStoredTransactionsForTerminal(activeSession.terminalId));
    }
    setIsLoaded(true);
  }, []);

  // Reload data whenever dokandarProfile changes
  useEffect(() => {
    if (dokandarProfile) {
      setCustomers(getStoredCustomersForTerminal(dokandarProfile.terminalId));
      setTransactions(getStoredTransactionsForTerminal(dokandarProfile.terminalId));
    } else {
      setCustomers([]);
      setTransactions([]);
    }
  }, [dokandarProfile]);

  const triggerToast = (text: string, type: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Guarded Dashboard Access Handler
  const handleAccessDashboard = () => {
    if (!dokandarProfile) {
      setAuthMode('LOGIN');
      setCurrentView('AUTH');
      triggerToast('ড্যাশবোর্ডে প্রবেশের জন্য প্রথমে অ্যাকাউন্ট লগইন অথবা রেজিস্টার করুন!', 'ERROR');
      return;
    }
    setCurrentView('APP');
  };

  const handleLogout = () => {
    logoutDokandarSession();
    setDokandarProfile(null);
    setCustomers([]);
    setTransactions([]);
    setCurrentView('LANDING');
    triggerToast('সফলভাবে অ্যাকাউন্ট থেকে লগআউট করা হয়েছে।');
  };

  const totalBaki = customers.reduce((acc, c) => acc + c.totalBaki, 0);

  const handleAddTransactionFromGemma = (
    result: GemmaIntentResult,
    dialect?: string,
    rawTranscript?: string
  ) => {
    if (!dokandarProfile) {
      triggerToast('লেনদেন রেকর্ড করার জন্য দোকানদার লগইন প্রয়োজন!', 'ERROR');
      return;
    }

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
    saveStoredTransactionsForTerminal(dokandarProfile.terminalId, updatedTxs);

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
    saveStoredCustomersForTerminal(dokandarProfile.terminalId, updatedCusts);
    triggerToast(`সফলভাবে বাকি লেনদেন রেকর্ড করা হয়েছে: ${result.customerName} (৳${result.netBaki})`);
  };

  const handleOpenReminder = (cust: Customer) => {
    setReminderCustomer(cust);
    setIsReminderModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!dokandarProfile) return;
    exportLedgerToCSV(transactions, dokandarProfile.shopName);
    triggerToast(`Hisab.AI - ${dokandarProfile.shopName} এর CSV ফাইল ডাউনলোড সম্পন্ন!`);
  };

  const handleSuccessLogin = (user: DokandarUser) => {
    setDokandarProfile(user);
    setActiveDokandarSession(user);
    setCurrentView('APP');
    triggerToast(`স্বাগতম! ${user.shopName} টার্মিনালে সফলভাবে প্রবেশ করেছেন।`);
  };

  const handleResetDatabase = () => {
    if (!dokandarProfile) return;
    const fresh = resetDatabaseForTerminal(dokandarProfile.terminalId);
    setCustomers(fresh.customers);
    setTransactions(fresh.transactions);
    setIsDatabaseSetupOpen(false);
    triggerToast(`${dokandarProfile.shopName} এর ডেমো ডাটাবেস সফলভাবে সেটআপ করা হয়েছে!`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-['Hind_Siliguri',sans-serif]">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold">Hisab.AI সিস্টেম লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // RENDER LANDING PAGE
  if (currentView === 'LANDING') {
    return (
      <>
        <LandingPage
          onLaunchApp={handleAccessDashboard}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'LOGIN');
            setCurrentView('AUTH');
          }}
          onOpenDatabaseSetup={() => setIsDatabaseSetupOpen(true)}
          onOpenVoiceModal={() => {
            if (!dokandarProfile) {
              setAuthMode('LOGIN');
              setCurrentView('AUTH');
              triggerToast('ভয়েস ইনপুট টেস্টের জন্য প্রথমে লগইন অথবা রেজিস্টার করুন!', 'ERROR');
            } else {
              setCurrentView('APP');
              setIsVoiceModalOpen(true);
            }
          }}
          isLoggedIn={!!dokandarProfile}
        />

        <DatabaseSetupModal
          isOpen={isDatabaseSetupOpen}
          onClose={() => setIsDatabaseSetupOpen(false)}
          customers={customers}
          transactions={transactions}
          onResetToDemoData={handleResetDatabase}
        />
      </>
    );
  }

  // RENDER AUTH (LOGIN / REGISTER) PAGE
  if (currentView === 'AUTH') {
    return (
      <>
        <AuthView
          onSuccessLogin={handleSuccessLogin}
          onBackToLanding={() => setCurrentView('LANDING')}
          initialMode={authMode}
        />

        <DatabaseSetupModal
          isOpen={isDatabaseSetupOpen}
          onClose={() => setIsDatabaseSetupOpen(false)}
          customers={customers}
          transactions={transactions}
          onResetToDemoData={handleResetDatabase}
        />
      </>
    );
  }

  // RENDER MAIN LEDGER DASHBOARD APP (Guarded: User MUST be logged in)
  if (!dokandarProfile) {
    return (
      <AuthView
        onSuccessLogin={handleSuccessLogin}
        onBackToLanding={() => setCurrentView('LANDING')}
        initialMode="LOGIN"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Hind_Siliguri',sans-serif] relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 bg-slate-900 border font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in ${
            toastMessage.type === 'ERROR'
              ? 'border-red-500/50 text-red-300'
              : 'border-emerald-500/40 text-emerald-300'
          }`}
        >
          {toastMessage.type === 'ERROR' ? (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Single Unified Header Navbar */}
      <Navbar
        onNavigateHome={() => setCurrentView('LANDING')}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenPOSModal={() => setIsPOSModalOpen(true)}
        onOpenDokandarModal={() => setIsDokandarModalOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'LOGIN');
          setCurrentView('AUTH');
        }}
        onOpenDatabaseSetup={() => setIsDatabaseSetupOpen(true)}
        onExportCSV={handleExportCSV}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentProfile={dokandarProfile}
        totalBaki={totalBaki}
        totalCustomers={customers.filter((c) => c.totalBaki > 0).length}
      />

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
        onSelectProfile={(p) => {
          setDokandarProfile(p as DokandarUser);
          setActiveDokandarSession(p as DokandarUser);
          triggerToast(`সুইচ করা হয়েছে: ${p.shopName}`);
        }}
      />

      <POSBillingModal
        isOpen={isPOSModalOpen}
        onClose={() => setIsPOSModalOpen(false)}
        customers={customers}
        onAddTransaction={handleAddTransactionFromGemma}
      />

      <DatabaseSetupModal
        isOpen={isDatabaseSetupOpen}
        onClose={() => setIsDatabaseSetupOpen(false)}
        customers={customers}
        transactions={transactions}
        onResetToDemoData={handleResetDatabase}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-medium">
          Hisab.AI (হিসাব.এআই) — Built by Team BrainForge | UIU for Build With Gemma @ Bangladesh Hackathon 2026
        </p>
      </footer>
    </div>
  );
}
