export type AccountType = 'checking' | 'savings' | 'business';

export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  balance: number;
  type?: string;
  status?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  type: 'deposit' | 'withdraw';
  amount: number;
  balanceAfter: number;
  description?: string;
  createdAt: string;
}

export interface CreateAccountRequest {
  type: string;
  initialDeposit?: number;
  description?: string;
}

export interface TransactionRequest {
  amount: number;
  description?: string;
}

export interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}

export interface TransactionState {
  isProcessing: boolean;
  error: string | null;
}
