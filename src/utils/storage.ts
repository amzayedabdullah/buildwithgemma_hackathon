import { Customer, Transaction } from '../types/ledger';
import { INITIAL_CUSTOMERS, INITIAL_TRANSACTIONS } from '../data/mockData';

// Demo initial dataset mapped per terminal ID
const DEMO_TERMINAL_DATA: Record<string, { customers: Customer[]; transactions: Transaction[] }> = {
  'POS-DHAKA-01': {
    customers: [INITIAL_CUSTOMERS[0], INITIAL_CUSTOMERS[3]], // Rahim Saheb, Rafik Hossain
    transactions: [INITIAL_TRANSACTIONS[0]],
  },
  'POS-NOAKHALI-02': {
    customers: [INITIAL_CUSTOMERS[1]], // Salauddin Bhai (Noakhali)
    transactions: [INITIAL_TRANSACTIONS[1]],
  },
  'POS-CTG-03': {
    customers: [INITIAL_CUSTOMERS[2]], // Karim Chowdhury (Chittagong)
    transactions: [INITIAL_TRANSACTIONS[2]],
  },
};

/**
 * Get customers for a specific shop terminal ID
 */
export function getStoredCustomersForTerminal(terminalId: string): Customer[] {
  if (typeof window === 'undefined' || !terminalId) return INITIAL_CUSTOMERS;
  const key = `hisab_ai_customers_${terminalId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = DEMO_TERMINAL_DATA[terminalId]?.customers || [];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load stored customers for terminal ${terminalId}:`, err);
    return [];
  }
}

/**
 * Save customers for a specific shop terminal ID
 */
export function saveStoredCustomersForTerminal(terminalId: string, customers: Customer[]): void {
  if (typeof window === 'undefined' || !terminalId) return;
  const key = `hisab_ai_customers_${terminalId}`;
  try {
    localStorage.setItem(key, JSON.stringify(customers));
  } catch (err) {
    console.error(`Failed to save customers for terminal ${terminalId}:`, err);
  }
}

/**
 * Get transactions for a specific shop terminal ID
 */
export function getStoredTransactionsForTerminal(terminalId: string): Transaction[] {
  if (typeof window === 'undefined' || !terminalId) return INITIAL_TRANSACTIONS;
  const key = `hisab_ai_transactions_${terminalId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = DEMO_TERMINAL_DATA[terminalId]?.transactions || [];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load stored transactions for terminal ${terminalId}:`, err);
    return [];
  }
}

/**
 * Save transactions for a specific shop terminal ID
 */
export function saveStoredTransactionsForTerminal(terminalId: string, transactions: Transaction[]): void {
  if (typeof window === 'undefined' || !terminalId) return;
  const key = `hisab_ai_transactions_${terminalId}`;
  try {
    localStorage.setItem(key, JSON.stringify(transactions));
  } catch (err) {
    console.error(`Failed to save transactions for terminal ${terminalId}:`, err);
  }
}

/**
 * Reset database for active terminal
 */
export function resetDatabaseForTerminal(terminalId: string): { customers: Customer[]; transactions: Transaction[] } {
  if (typeof window !== 'undefined' && terminalId) {
    const initialCust = DEMO_TERMINAL_DATA[terminalId]?.customers || [];
    const initialTx = DEMO_TERMINAL_DATA[terminalId]?.transactions || [];
    localStorage.setItem(`hisab_ai_customers_${terminalId}`, JSON.stringify(initialCust));
    localStorage.setItem(`hisab_ai_transactions_${terminalId}`, JSON.stringify(initialTx));
    return { customers: initialCust, transactions: initialTx };
  }
  return { customers: [], transactions: [] };
}

/**
 * Export CSV format
 */
export function exportLedgerToCSV(transactions: Transaction[], shopName: string = 'Shop'): void {
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
  link.setAttribute('download', `Hisab.AI_${shopName}_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
