import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, spacing } from '../theme';

interface HeaderProps {
  onNewTransaction: () => void;
}

export function Header({ onNewTransaction }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <Feather name="dollar-sign" size={20} color={colors.white} />
          </View>
          <Text style={styles.brandText}>dt money</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova transação"
          onPress={onNewTransaction}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Nova transação</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray800,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + spacing.xl,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: colors.green700,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 6,
  },
  buttonPressed: {
    backgroundColor: colors.green500,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
});
