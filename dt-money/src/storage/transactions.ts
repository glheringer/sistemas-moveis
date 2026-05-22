import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/transaction';

const STORAGE_KEY = '@dtmoney:transactions';

export async function loadTransactions(): Promise<Transaction[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export async function clearTransactions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
