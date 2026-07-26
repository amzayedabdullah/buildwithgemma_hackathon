export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TransactionType = 'BAKI' | 'JAMA' | 'BAKI_JAMA_SPLIT';

export interface Item {
  name: string;
  amount: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  type: TransactionType;
  items: Item[];
  totalAmount: number;
  cashPaid: number;
  netBaki: number;
  date: string;
  dialect?: string;
  rawAudioTranscript?: string;
  riskLevel: RiskLevel;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalBaki: number;
  lastTransactionDate: string;
  riskLevel: RiskLevel;
  transactionCount: number;
}

export interface GemmaIntentResult {
  customerName: string;
  phone?: string;
  type: TransactionType;
  items: Item[];
  totalAmount: number;
  cashPaid: number;
  netBaki: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  reasoningBangla: string;
}

export interface AudioPreset {
  id: string;
  label: string;
  dialect: string;
  transcript: string;
  expectedResult: Partial<GemmaIntentResult>;
}
