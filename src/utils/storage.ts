import { Customer, Transaction } from '../types/ledger';
import { INITIAL_CUSTOMERS, INITIAL_TRANSACTIONS } from '../data/mockData';

const CUSTOMERS_KEY = 'dokankhata_customers_v1';
const TRANSACTIONS_KEY = 'dokankhata_transactions_v1';

export function getStoredCustomers(): Customer[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load stored customers:', err);
    return INITIAL_CUSTOMERS;
  }
}

export function saveStoredCustomers(customers: Customer[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Failed to save customers to storage:', err);
  }
}

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load stored transactions:', err);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to storage:', err);
  }
}

export function exportLedgerToCSV(transactions: Transaction[]): void {
  const headers = ['কাস্টমার নাম', 'ফোন নম্বর', 'ধরন', 'মোট টাকা', 'ক্যাশ শোধ', 'নিট বাকি', 'তারিখ', 'আঞ্চলিক ডায়ালেক্ট'];
  const rows = transactions.map((t) => [
    t.customerName,
    t.customerPhone || '',
    t.type,
    t.totalAmount,
    t.cashPaid,
    t.netBaki,
    t.date,
    t.dialect || 'Standard',
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Hisab.AI_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
