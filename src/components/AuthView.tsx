'use client';

import React, { useState } from 'react';
import {
  Store,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  KeyRound,
  LogIn,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { authenticateDokandar, registerNewDokandar, DEFAULT_DOKANDARS, DokandarUser } from '../services/dbService';

interface AuthViewProps {
  onSuccessLogin: (user: DokandarUser) => void;
  onBackToLanding: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

const DISTRICT_PRESETS = [
  'ঢাকা (Dhaka)',
  'নোয়াখালী (Noakhali)',
  'চট্টগ্রাম (Chittagong)',
  'সিলেট (Sylhet)',
  'বরিশাল (Barisal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
  'অন্যান্য অঞ্চল (Other)',
];

export const AuthView: React.FC<AuthViewProps> = ({
  onSuccessLogin,
  onBackToLanding,
  initialMode = 'LOGIN',
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regShop, setRegShop] = useState('');
  const [regOwner, setRegOwner] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState(DISTRICT_PRESETS[0]);
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState('');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b'],
      });
    } catch (err) {
      console.log('Confetti error:', err);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginId || !loginPass) {
      setLoginError('অনুগ্রহ করে মোবাইল নম্বর/ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    const result = authenticateDokandar(loginId, loginPass);
    if (!result.success || !result.user) {
      setLoginError(result.error || 'লগইন ব্যর্থ হয়েছে!');
      return;
    }

    triggerConfetti();
    onSuccessLogin(result.user);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regShop || !regOwner || !regPhone || !regPass) {
      setRegError('অনুগ্রহ করে সকল তারকাচিহ্নিত (*) ফিল্ড পূরণ করুন।');
      return;
    }

    if (regPass.length < 4) {
      setRegError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (regPass !== regConfirmPass) {
      setRegError('পাসওয়ার্ড দুটি মিলছে না! পুনরায় পরীক্ষা করুন।');
      return;
    }

    const result = registerNewDokandar({
      shopName: regShop,
      ownerName: regOwner,
      phone: regPhone,
      location: regLocation,
      password: regPass,
    });

    if (!result.success || !result.user) {
      setRegError(result.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!');
      return;
    }

    triggerConfetti();
    onSuccessLogin(result.user);
  };

  const handleQuickDemoFill = (shop: (typeof DEFAULT_DOKANDARS)[0]) => {
    setMode('LOGIN');
    setLoginId(shop.phone);
    setLoginPass(shop.password || 'gemma2026');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-['Hind_Siliguri',sans-serif]">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header / Back Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোমপেজে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>অফলাইন-ফার্স্ট এনক্রিপ্টেড DB</span>
        </div>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 mb-3">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Hisab.AI (হিসাব.এআই)</h2>
          <p className="text-xs text-slate-400 mt-1">
            দোকানদার টার্মিনাল লগইন ও পাসওয়ার্ড সুরক্ষিত বাকি খাতা
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setLoginError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              mode === 'LOGIN'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন করুন</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setRegError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              mode === 'REGISTER'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন অ্যাকাউন্ট</span>
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl flex items-start gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                মোবাইল নম্বর / ইউজারনেম:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="যেমন: 01711000999"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                পাসওয়ার্ড:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Demo Credentials Assistant */}
            <div className="border-t border-slate-800/80 pt-4 mt-4">
              <label className="text-[11px] font-bold text-slate-400 block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>১-ক্লিক ডেমো দোকান পাসওয়ার্ড টেস্ট (Judges Feature):</span>
              </label>

              <div className="space-y-2">
                {DEFAULT_DOKANDARS.map((shop) => (
                  <button
                    key={shop.terminalId}
                    type="button"
                    onClick={() => handleQuickDemoFill(shop)}
                    className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-2.5 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 block">
                        {shop.shopName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {shop.ownerName} ({shop.phone})
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono">
                      {shop.password}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {regError && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                দোকানের নাম <span className="text-emerald-400">*</span>:
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="যেমন: মা ফাতেমা স্টোর"
                  value={regShop}
                  onChange={(e) => setRegShop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                মালিকের নাম <span className="text-emerald-400">*</span>:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="যেমন: মো: আব্দুর রহিম"
                  value={regOwner}
                  onChange={(e) => setRegOwner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  মোবাইল নম্বর <span className="text-emerald-400">*</span>:
                </label>
                <input
                  type="text"
                  placeholder="017xxxxxxxx"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  জেলা / অবস্থান:
                </label>
                <select
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2 py-2 text-xs text-white outline-none transition-colors"
                >
                  {DISTRICT_PRESETS.map((d, i) => (
                    <option key={i} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পাসওয়ার্ড নির্ধারণ করুন <span className="text-emerald-400">*</span>:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showRegPass ? 'text' : 'password'}
                  placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(!showRegPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পাসওয়ার্ড নিশ্চিত করুন:
              </label>
              <input
                type="password"
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                value={regConfirmPass}
                onChange={(e) => setRegConfirmPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>নিবন্ধন শেষ করে দোকান চালু করুন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
