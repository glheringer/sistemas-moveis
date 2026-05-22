import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, radius, spacing } from '../theme';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={colors.gray400} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Busque por transações"
        placeholderTextColor={colors.gray400}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  input: {
    flex: 1,
    color: colors.gray200,
    fontSize: fontSize.md,
    paddingVertical: 0,
  },
});
