import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { Summary } from '../components/Summary';
import { TransactionCard } from '../components/TransactionCard';
import { useTransactions } from '../contexts/TransactionsContext';
import { colors, fontSize, spacing } from '../theme';

interface HomeProps {
  onOpenNewTransaction: () => void;
}

export function Home({ onOpenNewTransaction }: HomeProps) {
  const { transactions, removeTransaction, isLoading } = useTransactions();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [transactions, query]);

  return (
    <View style={styles.container}>
      <Header onNewTransaction={onOpenNewTransaction} />
      <Summary />

      <View style={styles.body}>
        <SearchBar value={query} onChange={setQuery} />

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.green500} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionCard transaction={item} onDelete={removeTransaction} />
            )}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Feather name="inbox" size={48} color={colors.gray500} />
                <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
                <Text style={styles.emptySub}>
                  {query
                    ? 'Tente outra busca.'
                    : 'Cadastre sua primeira transação tocando em "Nova transação".'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.gray200,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  emptySub: {
    color: colors.gray400,
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
