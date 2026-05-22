import { ScrollView, Text, View, Alert } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { TransactionType } from '@/components/TransactionType'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useTransactionRepository } from '@/database/useTransactionRepository'

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>()
  const [type, setType] = useState(TransactionTypes.Input)
  const [value, setValue] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const transactionRepository = useTransactionRepository()

  async function handleSave() {
    if (!value || !reason.trim()) {
      return Alert.alert('Transação', 'Preencha todos os campos.')
    }

    try {
      setIsLoading(true)

      await transactionRepository.create({
        goal_id: Number(params.id),
        amount: value,
        type: type === TransactionTypes.Input ? 'input' : 'output',
        description: reason,
      })

      Alert.alert('Transação', 'Transação registrada com sucesso!')
      router.back()
    } catch (error) {
      console.log(error)
      Alert.alert('Transação', 'Não foi possível salvar a transação.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        paddingTop: 56,
        paddingHorizontal: 24,
        paddingBottom: 24,
        backgroundColor: colors.blue[500],
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </Pressable>

        <Text style={{ fontFamily: fontFamily.bold, fontSize: 18, color: colors.white }}>
          Nova transação
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: fontFamily.medium, fontSize: 14, color: colors.gray[500] }}>
          Tipo de transação
        </Text>

        <TransactionType selected={type} onChange={setType} />

        <CurrencyInput
          label="Valor (R$)"
          value={value}
          onChangeValue={setValue}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Salário de novembro"
          value={reason}
          onChangeText={setReason}
        />

        <Button
          title={type === TransactionTypes.Input ? 'Guardar na meta' : 'Resgatar da meta'}
          onPress={handleSave}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  )
}
