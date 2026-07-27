'use client';

import { DokandarProfile } from '../components/DokandarLoginModal';
import { Customer, Transaction } from '../types/ledger';

export interface DokandarUser extends DokandarProfile {
  username?: string;
  password?: string;
  createdAt: string;
  lastLoginAt: string;
}

const STORAGE_USERS_KEY = 'hisab_ai_dokandar_users';
const STORAGE_CURRENT_USER_KEY = 'hisab_ai_active_dokandar';
const STORAGE_DB_VERSION = '1.3';

// Pre-seeded demo accounts with passwords
export const DEFAULT_DOKANDARS: DokandarUser[] = [
  {
    shopName: 'বিসমিল্লাহ মুদি স্টোর',
    ownerName: 'প্রো: রাজীব চৌধুরী',
    phone: '01711000999',
    username: 'rajib017',
    password: 'gemma2026',
    location: 'ধানমন্ডি, ঢাকা',
    terminalId: 'POS-DHAKA-01',
    createdAt: '2026-01-10T10:00:00Z',
    lastLoginAt: '2026-07-27T09:00:00Z',
  },
  {
    shopName: 'আল-মদিনা জেনারেল স্টোর',
    ownerName: 'প্রো: হাজি সালাউদ্দিন',
    phone: '01899112233',
    username: 'salauddin018',
    password: 'gemma2026',
    location: 'চৌমুহনী, নোয়াখালী',
    terminalId: 'POS-NOAKHALI-02',
    createdAt: '2026-02-15T12:00:00Z',
    lastLoginAt: '2026-07-26T16:30:00Z',
  },
  {
    shopName: 'চৌধুরী ট্রেডার্স & ডিপার্টমেন্টাল',
    ownerName: 'প্রো: করিম চৌধুরী',
    phone: '01955887766',
    username: 'karim019',
    password: 'gemma2026',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    terminalId: 'POS-CTG-03',
    createdAt: '2026-03-01T08:00:00Z',
    lastLoginAt: '2026-07-25T14:10:00Z',
  },
];

/**
 * Initialize and get stored users list
 */
export function getStoredDokandars(): DokandarUser[] {
  if (typeof window === 'undefined') return DEFAULT_DOKANDARS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_DOKANDARS));
      return DEFAULT_DOKANDARS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DOKANDARS;
  } catch (err) {
    console.error('Error loading dokandars DB:', err);
    return DEFAULT_DOKANDARS;
  }
}

/**
 * Save updated dokandars list to database
 */
export function saveStoredDokandars(users: DokandarUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving dokandars DB:', err);
  }
}

/**
 * Get active logged-in Dokandar user session or null if unauthenticated
 */
export function getActiveDokandarSession(): DokandarUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.shopName && parsed.terminalId) return parsed;
    }
  } catch (err) {
    console.error('Error loading active dokandar session:', err);
  }
  return null;
}

/**
 * Set active logged-in Dokandar user session
 */
export function setActiveDokandarSession(user: DokandarUser): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = { ...user, lastLoginAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updated));

    // Update in users list as well
    const users = getStoredDokandars();
    const idx = users.findIndex((u) => u.terminalId === user.terminalId || u.phone === user.phone);
    if (idx !== -1) {
      users[idx] = updated;
      saveStoredDokandars(users);
    }
  } catch (err) {
    console.error('Error saving active session:', err);
  }
}

/**
 * Logout active dokandar session
 */
export function logoutDokandarSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } catch (err) {
    console.error('Error logging out session:', err);
  }
}

/**
 * Authenticate Dokandar with Mobile/Username & Password
 */
export function authenticateDokandar(
  identifier: string,
  pass: string
): { success: boolean; user?: DokandarUser; error?: string } {
  const users = getStoredDokandars();
  const cleanId = identifier.trim().toLowerCase();

  const found = users.find(
    (u) =>
      u.phone === cleanId ||
      u.phone.replace(/^0/, '+880') === cleanId ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      u.ownerName.toLowerCase().includes(cleanId)
  );

  if (!found) {
    return { success: false, error: 'উক্ত মোবাইল নম্বর বা ইউজারনেম দিয়ে কোনো দোকান খুঁজে পাওয়া যায়নি!' };
  }

  if (found.password && found.password !== pass) {
    return { success: false, error: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন।' };
  }

  setActiveDokandarSession(found);
  return { success: true, user: found };
}

/**
 * Register a new Dokandar Shopkeeper account
 */
export function registerNewDokandar(data: {
  shopName: string;
  ownerName: string;
  phone: string;
  location: string;
  password: string;
}): { success: boolean; user?: DokandarUser; error?: string } {
  if (!data.shopName || !data.ownerName || !data.phone || !data.password) {
    return { success: false, error: 'অনুগ্রহ করে সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।' };
  }

  const users = getStoredDokandars();
  const exists = users.some((u) => u.phone === data.phone.trim());
  if (exists) {
    return { success: false, error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যেই একটি দোকান অ্যাকাউন্ট বিদ্যমান!' };
  }

  const districtTag = data.location.split(',').pop()?.trim().toUpperCase() || 'BD';
  const newTerminalId = `POS-${districtTag.slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newUser: DokandarUser = {
    shopName: data.shopName.trim(),
    ownerName: data.ownerName.trim(),
    phone: data.phone.trim(),
    password: data.password,
    username: data.ownerName.trim().toLowerCase().replace(/\s+/g, '') + Math.floor(10 + Math.random() * 90),
    location: data.location.trim() || 'বাংলাদেশ',
    terminalId: newTerminalId,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...users];
  saveStoredDokandars(updatedUsers);
  setActiveDokandarSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Database Inspector & Statistics
 */
export interface DatabaseStats {
  version: string;
  totalDokandars: number;
  totalCustomers: number;
  totalTransactions: number;
  totalBakiAmount: number;
  estimatedStorageKB: number;
  status: 'ONLINE' | 'SYNCHRONIZED';
}

export function getDatabaseStats(customers: Customer[], transactions: Transaction[]): DatabaseStats {
  const users = getStoredDokandars();
  const totalBaki = customers.reduce((sum, c) => sum + c.totalBaki, 0);

  let rawSize = 0;
  if (typeof window !== 'undefined') {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        rawSize += ((localStorage[key] || '').length + key.length) * 2;
      }
    }
  }

  return {
    version: STORAGE_DB_VERSION,
    totalDokandars: users.length,
    totalCustomers: customers.length,
    totalTransactions: transactions.length,
    totalBakiAmount: totalBaki,
    estimatedStorageKB: Math.round((rawSize / 1024) * 10) / 10,
    status: 'SYNCHRONIZED',
  };
}

/**
 * Export full database JSON backup
 */
export function exportFullDatabaseBackup(customers: Customer[], transactions: Transaction[]): void {
  const users = getStoredDokandars();
  const activeUser = getActiveDokandarSession();

  const backupData = {
    exportDate: new Date().toISOString(),
    version: STORAGE_DB_VERSION,
    activeUser,
    dokandars: users,
    customers,
    transactions,
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hisab_ai_full_db_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
