import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, radius, spacing } from '../theme';
import { Transaction } from '../types/transaction';
import { formatCurrency, formatDate } from '../utils/format';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionCard({ transaction, onDelete }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.green500 : colors.red500;
  const signedAmount = `${isIncome ? '' : '- '}${formatCurrency(transaction.amount)}`;

  return (
    <View style={styles.card}>
      <Text style={styles.description}>{transaction.description}</Text>
      <Text style={[styles.amount, { color: amountColor }]}>{signedAmount}</Text>
      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Feather name="tag" size={14} color={colors.gray400} />
          <Text style={styles.metaText}>{transaction.category}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={14} color={colors.gray400} />
          <Text style={styles.metaText}>{formatDate(transaction.createdAt)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Excluir transação"
          onPress={() => onDelete(transaction.id)}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
        >
          <Feather name="trash-2" size={16} color={colors.red500} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray700,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  description: {
    color: colors.gray200,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  amount: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    color: colors.gray400,
    fontSize: fontSize.sm,
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
});
