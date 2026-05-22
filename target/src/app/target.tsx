import { ScrollView, Text, View, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { CurrencyInput } from '@/components/CurrencyInput'
import { useGoalRepository } from '@/database/useGoalRepository'

export default function Target() {
  const params = useLocalSearchParams<{ id?: string }>()
  const [name, setName] = useState('')
  const [targetValue, setTargetValue] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const goalRepository = useGoalRepository()

  async function handleSave() {
    if (!name.trim() || !targetValue) {
      return Alert.alert('Meta', 'Preencha todos os campos.')
    }

    try {
      setIsLoading(true)
      
      if (params.id) {
        await goalRepository.update({
          id: Number(params.id),
          name,
          target: targetValue,
        })
        Alert.alert('Meta', 'Meta atualizada com sucesso!')
      } else {
        await goalRepository.create({
          name,
          target: targetValue,
        })
        Alert.alert('Meta', 'Meta criada com sucesso!')
      }

      router.back()
    } catch (error) {
      console.log(error)
      Alert.alert('Meta', 'Não foi possível salvar a meta.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      goalRepository.show(Number(params.id)).then((goal) => {
        if (goal) {
          setName(goal.name)
          setTargetValue(goal.target)
        }
      })
    }
  }, [params.id])

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
          {params.id ? 'Editar meta' : 'Nova meta'}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: fontFamily.regular, fontSize: 14, color: colors.gray[500], lineHeight: 20 }}>
          {params.id ? 'Altere o nome ou o valor alvo da sua meta.' : 'Defina o nome da sua meta e o valor que deseja alcançar.'}
        </Text>

        <Input
          label="Nome da meta"
          placeholder="Ex: Viagem para Europa"
          value={name}
          onChangeText={setName}
        />

        <CurrencyInput
          label="Valor alvo"
          value={targetValue}
          onChangeValue={setTargetValue}
        />

        <Button
          title={params.id ? 'Salvar alterações' : 'Criar meta'}
          onPress={handleSave}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  )
}
