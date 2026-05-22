import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useTransactions } from '../contexts/TransactionsContext';
import { colors, fontSize, radius, spacing } from '../theme';
import { TransactionType } from '../types/transaction';
import { parseCurrencyInput } from '../utils/format';

interface NewTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ visible, onClose }: NewTransactionModalProps) {
  const { createTransaction } = useTransactions();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<TransactionType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setDescription('');
    setAmount('');
    setCategory('');
    setType(null);
    setSubmitting(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!description.trim() || !amount.trim() || !category.trim() || !type) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos antes de cadastrar.');
      return;
    }
    const numericAmount = parseCurrencyInput(amount);
    if (numericAmount <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }
    setSubmitting(true);
    try {
      await createTransaction({
        description: description.trim(),
        category: category.trim(),
        amount: numericAmount,
        type,
      });
      handleClose();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
      setSubmitting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Nova transação</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              onPress={handleClose}
              hitSlop={10}
            >
              <Feather name="x" size={22} color={colors.gray400} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
          >
            <Field
              label="Descrição"
              value={description}
              onChange={setDescription}
              placeholder="Salário, almoço, transporte..."
            />
            <Field
              label="Preço"
              value={amount}
              onChange={setAmount}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
            <Field
              label="Categoria"
              value={category}
              onChange={setCategory}
              placeholder="Alimentação, lazer, trabalho..."
            />

            <View style={styles.typeRow}>
              <TypeButton
                label="Entrada"
                icon="arrow-up-circle"
                active={type === 'income'}
                color={colors.green500}
                onPress={() => setType('income')}
              />
              <TypeButton
                label="Saída"
                icon="arrow-down-circle"
                active={type === 'outcome'}
                color={colors.red500}
                onPress={() => setType('outcome')}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cadastrar transação"
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.submitBtn,
                (pressed || submitting) && styles.submitBtnPressed,
              ]}
            >
              <Text style={styles.submitText}>
                {submitting ? 'Salvando...' : 'Cadastrar'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
}

function Field({ label, value, onChange, placeholder, keyboardType = 'default' }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.gray500}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

interface TypeButtonProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active: boolean;
  color: string;
  onPress: () => void;
}

function TypeButton({ label, icon, active, color, onPress }: TypeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.typeBtn,
        active && { backgroundColor: color, borderColor: color },
        pressed && !active && styles.typeBtnPressed,
      ]}
    >
      <Feather name={icon} size={20} color={active ? colors.white : color} />
      <Text style={[styles.typeText, active && styles.typeTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.gray800,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    maxHeight: '92%',
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray600,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.gray200,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  form: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.gray300,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.gray700,
    color: colors.gray200,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.md,
    fontSize: fontSize.md,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    backgroundColor: colors.gray700,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  typeBtnPressed: {
    backgroundColor: colors.gray600,
  },
  typeText: {
    color: colors.gray200,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  typeTextActive: {
    color: colors.white,
  },
  submitBtn: {
    marginTop: spacing.lg,
    height: 56,
    backgroundColor: colors.green700,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
});
