import { ScrollView, Text, View, Alert } from 'react-native'
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { Button } from '@/components/Button'
import { Progress } from '@/components/Progress'
import { List } from '@/components/List'
import { Transaction, TransactionData } from '@/components/Transaction'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { useGoalRepository } from '@/database/useGoalRepository'
import { useTransactionRepository } from '@/database/useTransactionRepository'
import { formatCurrency } from '@/utils/formatCurrency'

type Details = {
  name: string
  current: string
  target: string
  percentage: number
}

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>()
  const [details, setDetails] = useState<Details>({
    name: '',
    current: 'R$ 0,00',
    target: 'R$ 0,00',
    percentage: 0,
  })
  const [transactions, setTransactions] = useState<TransactionData[]>([])

  const goalRepository = useGoalRepository()
  const transactionRepository = useTransactionRepository()

  async function fetchDetails() {
    try {
      const goal = await goalRepository.show(Number(params.id))
      const goalTransactions = await transactionRepository.findByGoal(Number(params.id))

      if (!goal) {
        return router.back()
      }

      const current = goalTransactions.reduce((acc, transaction) => {
        return transaction.type === 'input' ? acc + transaction.amount : acc - transaction.amount
      }, 0)

      const percentage = (current / goal.target) * 100

      setDetails({
        name: goal.name,
        current: formatCurrency(current),
        target: formatCurrency(goal.target),
        percentage: percentage > 100 ? 100 : percentage,
      })

      setTransactions(
        goalTransactions.map((transaction) => ({
          id: transaction.id.toString(),
          title: transaction.description,
          value: formatCurrency(transaction.amount),
          type: transaction.type === 'input' ? TransactionTypes.Input : TransactionTypes.Output,
        }))
      )
    } catch (error) {
      console.log(error)
      Alert.alert('Detalhes', 'Não foi possível carregar os detalhes da meta.')
    }
  }

  async function handleRemove() {
    Alert.alert('Remover', 'Deseja remover a meta?', [
      { style: 'cancel', text: 'Não' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await goalRepository.deleteGoal(Number(params.id))
            router.back()
          } catch (error) {
            console.log(error)
            Alert.alert('Remover', 'Não foi possível remover a meta.')
          }
        },
      },
    ])
  }

  useFocusEffect(
    useCallback(() => {
      fetchDetails()
    }, [params.id])
  )

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.blue[500], colors.blue[800]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 28 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </Pressable>

          <Text style={{ fontFamily: fontFamily.bold, fontSize: 18, color: colors.white, flex: 1 }}>
            {details.name}
          </Text>

          <Pressable onPress={handleRemove} hitSlop={8}>
            <MaterialIcons name="delete" size={24} color={colors.white} />
          </Pressable>

          <Pressable onPress={() => router.navigate(`/target?id=${params.id}`)} hitSlop={8}>
            <MaterialIcons name="edit" size={24} color={colors.white} />
          </Pressable>
        </View>

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontFamily: fontFamily.regular, fontSize: 13, color: colors.white, opacity: 0.8 }}>
              Valor guardado
            </Text>
            <Text style={{ fontFamily: fontFamily.regular, fontSize: 13, color: colors.white, opacity: 0.8 }}>
              {details.percentage.toFixed(0)}%
            </Text>
          </View>

          <Text style={{ fontFamily: fontFamily.bold, fontSize: 28, color: colors.white }}>
            {details.current}
          </Text>

          <Progress percentage={details.percentage} />

          <Text style={{ fontFamily: fontFamily.regular, fontSize: 13, color: colors.white, opacity: 0.7, textAlign: 'right' }}>
            Meta: {details.target}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <List
          title="Transações"
          data={transactions}
          renderItem={({ item }) => (
            <Transaction data={item} onRemove={() => {}} />
          )}
          emptyMessage="Nenhuma transação registrada. Toque em 'Nova transação' para começar a guardar dinheiro nesta meta."
          scrollEnabled={false}
        />

        <Button
          title="Nova transação"
          onPress={() => router.navigate(`/transaction/${params.id}`)}
        />
      </ScrollView>
    </View>
  )
}
