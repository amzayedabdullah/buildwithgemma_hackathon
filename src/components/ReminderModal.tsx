'use client';

import React, { useState, useEffect } from 'react';
import { Customer } from '../types/ledger';
import { generateBanglaReminder } from '../services/gemmaService';
import { X, Send, Copy, Sparkles, Check, MessageSquare, Volume2 } from 'lucide-react';

interface ReminderModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  customer,
  isOpen,
  onClose,
  apiKey,
}) => {
  const [tone, setTone] = useState<'SOFT' | 'FIRM'>('SOFT');
  const [reminderText, setReminderText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (customer && isOpen) {
      handleGenerate();
    }
  }, [customer, isOpen, tone]);

  if (!isOpen || !customer) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const text = await generateBanglaReminder(
        customer.name,
        customer.totalBaki,
        14,
        tone,
        apiKey
      );
      setReminderText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reminderText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(reminderText);
    const url = `https://wa.me/${customer.phone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gemma AI সম্পর্ক-বান্ধব তাগাদা বার্তা</h3>
              <p className="text-xs text-slate-400">{customer.name}-এর জন্য স্বয়ংক্রিয় বার্তা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Tone Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              বার্তার মেজাজ ও টোন নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTone('SOFT')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  tone === 'SOFT'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>😊 বিনয়ী / নরম বার্তা</span>
              </button>
              <button
                onClick={() => setTone('FIRM')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  tone === 'FIRM'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>⚠️ তাগাদা / জোরালো বার্তা</span>
              </button>
            </div>
          </div>

          {/* Generated Text Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> জেনারেট করা বার্তা:
              </span>
              <button onClick={handleCopy} className="text-emerald-400 hover:underline flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Gemma AI দিয়ে বার্তা তৈরি হচ্ছে...
              </div>
            ) : (
              <p className="text-sm text-slate-200 leading-relaxed italic">"{reminderText}"</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs transition-all"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp-এ পাঠান</span>
          </button>
        </div>
      </div>
    </div>
  );
};
