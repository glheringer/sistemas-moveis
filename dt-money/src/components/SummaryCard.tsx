import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

type Variant = 'income' | 'outcome' | 'total';

interface SummaryCardProps {
  variant: Variant;
  label: string;
  amount: number;
}

const variantConfig: Record<
  Variant,
  { icon: keyof typeof Feather.glyphMap; iconColor: string; bg: string }
> = {
  income: {
    icon: 'arrow-up-circle',
    iconColor: colors.green500,
    bg: colors.gray700,
  },
  outcome: {
    icon: 'arrow-down-circle',
    iconColor: colors.red500,
    bg: colors.gray700,
  },
  total: {
    icon: 'dollar-sign',
    iconColor: colors.white,
    bg: colors.green700,
  },
};

export function SummaryCard({ variant, label, amount }: SummaryCardProps) {
  const cfg = variantConfig[variant];
  return (
    <View style={[styles.card, { backgroundColor: cfg.bg }]}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Feather name={cfg.icon} size={28} color={cfg.iconColor} />
      </View>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    padding: spacing.xl,
    borderRadius: radius.md,
    marginRight: spacing.lg,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: colors.gray200,
    fontSize: fontSize.md,
  },
  amount: {
    color: colors.white,
    fontSize: fontSize.display,
    fontWeight: '700',
  },
});
