'use client';

import React, { useState } from 'react';
import {
  Mic,
  BookOpen,
  Zap,
  ShoppingBag,
  ArrowRight,
  Play,
  Volume2,
  AlertTriangle,
  Database,
  Store,
  MessageSquare,
  FileSpreadsheet,
  Lock,
  LogIn,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { REGIONAL_AUDIO_PRESETS } from '../data/mockData';
import { AudioPreset } from '../types/ledger';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onOpenDatabaseSetup: () => void;
  onOpenVoiceModal: () => void;
  isLoggedIn?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenAuth,
  onOpenDatabaseSetup,
  onOpenVoiceModal,
  isLoggedIn = false,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activePreset = REGIONAL_AUDIO_PRESETS[selectedPresetIndex] || REGIONAL_AUDIO_PRESETS[0];

  const handlePlayAudioSimulation = () => {
    setIsPlayingAudio(true);
    setIsProcessing(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
      setIsProcessing(false);
    }, 1500);
  };

  const handleEnterDashboardOrAuth = () => {
    if (isLoggedIn) {
      onLaunchApp();
    } else {
      onOpenAuth('LOGIN');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Hind_Siliguri',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      {/* Clean & Professional Top Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block">Hisab.AI</span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-1">
                স্মার্ট ডিজিটাল বাকি খাতা
              </span>
            </div>
          </div>

          {/* Nav Action Buttons - Clean Single Primary Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenDatabaseSetup}
              className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>ডাটাবেস সেটআপ</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={onLaunchApp}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ডে প্রবেশ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('LOGIN')}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4.5 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন / রেজিস্টার</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-1.5 rounded-full text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ক্ষুদ্র ও মাঝারি দোকানের জন্য ভয়েস ফিনান্সিয়াল অপারেটিং সিস্টেম</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            মুখের কথায় তৈরি করুন<br />
            <span className="text-emerald-400">নিখুঁত ডিজিটাল বাকি খাতা</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            টাইপিংয়ের ঝামেলা ছাড়া আঞ্চলিক বাংলা কথায় হিসাব রাখুন, POS মেমো প্রিন্ট করুন এবং স্বয়ংক্রিয় হোয়াটসঅ্যাপ বার্তা তৈরি করে দ্রুত বাকি আদায় করুন।
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleEnterDashboardOrAuth}
              className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isLoggedIn ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'লগইন করে বাকি খাতায় প্রবেশ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>নতুন দোকানদার রেজিস্ট্রেশন</span>
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>ভয়েস ডেমো টেস্ট</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">৳৫০ বিলিয়ন+</div>
            <div className="text-xs text-slate-400 mt-1">বার্ষিক বাকি লেনদেন প্রক্রিয়াজাত</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-teal-400">৭+ উপভাষা</div>
            <div className="text-xs text-slate-400 mt-1">আঞ্চলিক বাংলা ডায়ালেক্ট সাপোর্ট</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">১০০% অফলাইন</div>
            <div className="text-xs text-slate-400 mt-1">নিরাপদ লোকাল ডাটাবেস সিকিউরিটি</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">০ সেকেন্ড</div>
            <div className="text-xs text-slate-400 mt-1">ক্যাশমেমো ও রসিদ তৈরির সময়</div>
          </div>
        </div>
      </section>

      {/* REGIONAL DIALECT INTERACTIVE DEMO */}
      <section className="py-16 px-4 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ভয়েস প্রসেসিং ডেমো
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              আঞ্চলিক উপভাষা থেকে স্বয়ংক্রিয় হিসাব তৈরি
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              যেকোনো অঞ্চলের ভয়েস নমুনা বেছে নিন এবং দেখুন কিভাবে কাস্টমার, আইটেম ও মোট বাকি আলাদা হয়।
            </p>
          </div>

          {/* Dialect Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {REGIONAL_AUDIO_PRESETS.map((preset: AudioPreset, idx: number) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedPresetIndex === idx
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset.dialect} ({preset.label})
              </button>
            ))}
          </div>

          {/* Interactive Audio Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {/* Transcript & Waveform */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  কথিত আঞ্চলিক অডিও বক্তব্য:
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-medium text-slate-200 italic leading-relaxed">
                  "{activePreset.transcript}"
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 h-6 flex-1">
                  {[40, 70, 30, 90, 50, 100, 60, 80, 45, 95, 35, 75, 50].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: isPlayingAudio ? `${Math.floor(Math.random() * 80 + 20)}%` : `${h}%` }}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlayingAudio ? 'bg-emerald-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handlePlayAudioSimulation}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{isPlayingAudio ? 'প্রসেস হচ্ছে...' : 'অডিও টেস্ট করুন'}</span>
                </button>
              </div>
            </div>

            {/* Parsed JSON Data Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-slate-300">পার্সকৃত হিসাব তথ্য</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activePreset.expectedResult.riskLevel === 'HIGH'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : activePreset.expectedResult.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  ঝুঁকি: {activePreset.expectedResult.riskLevel}
                </span>
              </div>

              {isProcessing ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                  <Zap className="w-5 h-5 text-emerald-400 animate-spin" />
                  <span>অডিও ফাইল বিশ্লেষণ ও ডাটা এক্সট্র্যাক্ট করা হচ্ছে...</span>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">কাস্টমার নাম:</span>
                    <span className="font-bold text-white">{activePreset.expectedResult.customerName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">লেনদেনের ধরণ:</span>
                    <span className="font-mono text-emerald-400">{activePreset.expectedResult.type}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">পণ্য তালিকা:</span>
                    <div className="space-y-1">
                      {activePreset.expectedResult.items?.map((it: { name: string; amount: number }, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                        >
                          <span className="text-slate-300">{it.name}</span>
                          <span className="font-mono text-emerald-400">৳ {it.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-slate-300">মোট বাকি (Net Baki):</span>
                    <span className="text-base font-black text-amber-400">
                      ৳ {activePreset.expectedResult.netBaki}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">মূল ফিচার ও সুবিধাসমূহ</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            একটি আধুনিক ও কার্যকরী ব্যবসায়ী প্ল্যাটফর্ম যা আপনার বাকি খাতার সম্পূর্ণ হিসাব সহজ করে দেয়।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">১. ভয়েস-টু-লেজার</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ব্যস্ত সময় বা হাতের কাজ চলার মধ্যে মুখে বলেই কাস্টমারের নাম, পণ্য ও বাকি টাকার এন্ট্রি নিন।
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">২. POS ক্যাশমেমো</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              দ্রুত চাল, ডাল, তেল সহ নিয়মিত পণ্য সিলেক্ট করে ১-ক্লিকে ডিজিটাল ক্যাশমেমো তৈরি ও প্রিন্ট করুন।
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">৩. ক্রেডিট রিস্ক অ্যানালিটিক্স</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              কাস্টমারের পূর্ববর্তী দেনা ও সময় অনুযায়ী ঝুঁকির লেভেল (High/Medium/Low) পরিমাপ করুন।
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">৪. হোয়াটসঅ্যাপ তাগাদা</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              কাস্টমারের সাথে সুসম্পর্ক বজায় রেখে বিনয়ী ও কার্যকর বার্তা পাঠিয়ে হোয়াটসঅ্যাপে তাগাদা দিন।
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">৫. সিকিউর টার্মিনাল ও DB</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              দোকানদার পাসওয়ার্ড সুরক্ষা এবং সম্পূর্ণ অফলাইন লোকাল ডাটাবেস ব্যাকআপ (JSON) নেওয়ার সুবিধা।
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">৬. CSV এক্সপোর্ট</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              আপনার সমগ্ৰ দোকান খাতার তথ্য ১-ক্লিকে এক্সেল বা সিএসভি ফাইলে মুহূর্তে ডাউনলোড করে নিরাপদে রাখুন।
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white">Hisab.AI — ডিজিটাল বাকি খাতা</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button onClick={handleEnterDashboardOrAuth} className="hover:text-emerald-400">
              বাকি খাতা
            </button>
            <button onClick={() => onOpenAuth('LOGIN')} className="hover:text-emerald-400">
              দোকানদার লগইন
            </button>
            <button onClick={onOpenDatabaseSetup} className="hover:text-emerald-400">
              ডাটাবেস
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 Hisab.AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
