export type TransactionType = 'income' | 'outcome';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  createdAt: string;
}

export type NewTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
