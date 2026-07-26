'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Printer, CheckCircle2, DollarSign } from 'lucide-react';
import { Customer, GemmaIntentResult } from '../types/ledger';

interface POSItem {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
}

const COMMON_POS_ITEMS: { name: string; unitPrice: number }[] = [
  { name: 'সয়াবিন তেল (১ লিটার)', unitPrice: 190 },
  { name: 'মিনিকেট চাল (১ কেজি)', unitPrice: 75 },
  { name: 'মসুর ডাল (১ কেজি)', unitPrice: 140 },
  { name: 'চিনি (১ কেজি)', unitPrice: 130 },
  { name: 'আটা (২ কেজি ಪ್ಯಾকেট)', unitPrice: 110 },
  { name: 'গুঁড়ো দুধ (৫০০ গ্রাম)', unitPrice: 480 },
  { name: 'চা পাতা (২০০ গ্রাম)', unitPrice: 120 },
  { name: 'ডিম (১ হালি)', unitPrice: 52 },
];

interface POSBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onAddTransaction: (result: GemmaIntentResult, dialect?: string, transcript?: string) => void;
}

export const POSBillingModal: React.FC<POSBillingModalProps> = ({
  isOpen,
  onClose,
  customers,
  onAddTransaction,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.name || 'রহিম সাহেব');
  const [cart, setCart] = useState<POSItem[]>([]);
  const [cashPaid, setCashPaid] = useState<number>(0);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  if (!isOpen) return null;

  const handleAddItemToCart = (item: { name: string; unitPrice: number }) => {
    const existing = cart.find((i) => i.name === item.name);
    if (existing) {
      setCart(cart.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { id: `pos-${Date.now()}-${Math.random()}`, name: item.name, unitPrice: item.unitPrice, qty: 1 }]);
    }
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName || !customItemPrice) return;
    const price = parseFloat(customItemPrice) || 0;
    handleAddItemToCart({ name: customItemName, unitPrice: price });
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
  const netBaki = Math.max(0, subtotal - cashPaid);

  const handleSavePOSBill = () => {
    if (cart.length === 0) return;

    const result: GemmaIntentResult = {
      customerName: selectedCustomer,
      type: cashPaid >= subtotal ? 'JAMA' : cashPaid > 0 ? 'BAKI_JAMA_SPLIT' : 'BAKI',
      items: cart.map((i) => ({ name: `${i.name} (x${i.qty})`, amount: i.unitPrice * i.qty })),
      totalAmount: subtotal,
      cashPaid,
      netBaki,
      riskLevel: netBaki > 1000 ? 'HIGH' : netBaki > 300 ? 'MEDIUM' : 'LOW',
      confidenceScore: 1.0,
      reasoningBangla: `POS টার্মিনাল বিল: মোট ৳${subtotal}, ক্যাশ জমা ৳${cashPaid}, বাকি ৳${netBaki}`,
    };

    onAddTransaction(result, 'POS Terminal Billing', 'দোকানদার POS সফ্টওয়্যার ক্যাশমেমো বিল');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">POS স্মার্ট ক্যাশমেমো ও বিলিং</h3>
              <p className="text-xs text-slate-400">১-ক্লিকে মুদি মালামালের বিল ও বাকি খাতা এন্ট্রি করুন</p>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Item Selector Column */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                কাস্টমার সিলেক্ট করুন:
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.phone}) - বর্তমান বাকি: ৳{c.totalBaki}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                🛍️ দ্রুত আইটেম ক্যাটাগরি যোগ করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_POS_ITEMS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddItemToCart(item)}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-left flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{item.name}</span>
                    <span className="text-[11px] text-emerald-400 font-extrabold mt-1">৳ {item.unitPrice}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Item Form */}
            <form onSubmit={handleAddCustomItem} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="অন্যান্য আইটেমের নাম"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <input
                type="number"
                placeholder="দাম (৳)"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 rounded-xl"
              >
                <Plus className="w-4 h-4 font-bold" />
              </button>
            </form>
          </div>

          {/* Cart & Billing Summary Column */}
          <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                ক্যাশমেমো রসিদ (মেমো আইটেমস):
              </h4>

              {cart.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-8">কোনো আইটেম যোগ করা হয়নি</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-xl border border-slate-800"
                    >
                      <div className="flex-1 pr-2">
                        <span className="font-semibold text-slate-200 block line-clamp-1">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ৳{item.unitPrice} x {item.qty} = ৳{item.unitPrice * item.qty}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-emerald-400 px-1">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations & Payment Input */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span>মোট মালামাল বিল:</span>
                <span className="text-white font-extrabold text-sm">৳ {subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">ক্যাশ জমা দিল:</span>
                <input
                  type="number"
                  value={cashPaid || ''}
                  onChange={(e) => setCashPaid(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-24 text-right bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">খাতায় নতুন বাকি:</span>
                <span className="text-amber-400 text-sm">৳ {netBaki}</span>
              </div>

              <button
                onClick={handleSavePOSBill}
                disabled={cart.length === 0}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>বিল সেভ & বাকি খাতায় যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
