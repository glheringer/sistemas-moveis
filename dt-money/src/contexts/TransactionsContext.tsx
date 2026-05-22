import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import uuid from 'react-native-uuid';

import {
  loadTransactions,
  saveTransactions,
} from '../storage/transactions';
import { NewTransactionInput, Transaction } from '../types/transaction';

interface Summary {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsContextValue {
  transactions: Transaction[];
  summary: Summary;
  isLoading: boolean;
  createTransaction: (input: NewTransactionInput) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined,
);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadTransactions();
      setTransactions(stored);
      setIsLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next: Transaction[]) => {
    setTransactions(next);
    await saveTransactions(next);
  }, []);

  const createTransaction = useCallback(
    async (input: NewTransactionInput) => {
      const newTransaction: Transaction = {
        id: String(uuid.v4()),
        createdAt: new Date().toISOString(),
        ...input,
      };
      const next = [newTransaction, ...transactions];
      await persist(next);
    },
    [persist, transactions],
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      const next = transactions.filter((t) => t.id !== id);
      await persist(next);
    },
    [persist, transactions],
  );

  const summary = useMemo<Summary>(() => {
    return transactions.reduce<Summary>(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
          acc.total += transaction.amount;
        } else {
          acc.outcome += transaction.amount;
          acc.total -= transaction.amount;
        }
        return acc;
      },
      { income: 0, outcome: 0, total: 0 },
    );
  }, [transactions]);

  const value = useMemo<TransactionsContextValue>(
    () => ({
      transactions,
      summary,
      isLoading,
      createTransaction,
      removeTransaction,
    }),
    [transactions, summary, isLoading, createTransaction, removeTransaction],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error('useTransactions must be used within TransactionsProvider');
  }
  return ctx;
}
