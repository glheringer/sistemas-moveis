import { ScrollView, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { HomeHeader, HomeHeaderData } from '@/components/HomeHeader'
import { List } from '@/components/List'
import { Button } from '@/components/Button'
import { TargetCard, TargetCardData } from '@/components/TargetCard'
import { useGoalRepository } from '@/database/useGoalRepository'
import { formatCurrency } from '@/utils/formatCurrency'

export default function Index() {
  const [summary, setSummary] = useState<HomeHeaderData>({
    total: 'R$ 0,00',
    input: { label: 'Entradas', value: 'R$ 0,00' },
    output: { label: 'Saídas', value: 'R$ 0,00' },
  })
  const [targets, setTargets] = useState<TargetCardData[]>([])

  const goalRepository = useGoalRepository()

  async function fetchData() {
    try {
      const response = await goalRepository.getSummary()
      
      const formattedTargets: TargetCardData[] = response.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        current: formatCurrency(item.current),
        target: formatCurrency(item.target),
        percentage: (item.current / item.target) * 100,
      }))

      setTargets(formattedTargets)

      const total = response.reduce((acc, item) => acc + item.current, 0)
      const input = response.reduce((acc, item) => acc + (item.current > 0 ? item.current : 0), 0)
      const output = response.reduce((acc, item) => acc + (item.current < 0 ? Math.abs(item.current) : 0), 0)

      setSummary({
        total: formatCurrency(total),
        input: { label: 'Entradas', value: formatCurrency(input) },
        output: { label: 'Saídas', value: formatCurrency(output) },
      })
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader data={summary} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <List
          title="Minhas metas"
          data={targets}
          renderItem={({ item }) => (
            <TargetCard
              data={item}
              onPress={() => router.navigate(`/in-progress/${item.id}`)}
            />
          )}
          emptyMessage="Nenhuma meta cadastrada. Toque em 'Nova meta' para criar a sua primeira meta."
          scrollEnabled={false}
        />

        <Button
          title="Nova meta"
          onPress={() => router.navigate('/target')}
        />
      </ScrollView>
    </View>
  )
}
