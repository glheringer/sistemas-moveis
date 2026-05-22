import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTransactions } from '../contexts/TransactionsContext';
import { spacing } from '../theme';
import { SummaryCard } from './SummaryCard';

export function Summary() {
  const { summary } = useTransactions();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SummaryCard variant="income" label="Entradas" amount={summary.income} />
        <SummaryCard variant="outcome" label="Saídas" amount={summary.outcome} />
        <SummaryCard variant="total" label="Total" amount={summary.total} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: -spacing.xxl - spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
});
