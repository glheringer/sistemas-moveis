import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { TransactionTypes } from '@/utils/TransactionTypes'

export type TransactionData = {
  id: string
  title: string
  value: string
  type: TransactionTypes
}

type Props = {
  data: TransactionData
  onRemove?: () => void
}

export function Transaction({ data, onRemove }: Props) {
  const isInput = data.type === TransactionTypes.Input

  return (
    <View
      style={{
        width: '100%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[100],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: isInput ? '#EEF0FF' : '#FEF2F2',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <MaterialIcons
            name={isInput ? 'arrow-upward' : 'arrow-downward'}
            size={18}
            color={isInput ? colors.blue[500] : colors.red[400]}
          />
        </View>

        <View>
          <Text style={{ fontFamily: fontFamily.medium, color: colors.black, fontSize: 14 }}>
            {data.title}
          </Text>
          <Text style={{ marginTop: 2, color: colors.gray[500], fontSize: 13, fontFamily: fontFamily.regular }}>
            {data.value}
          </Text>
        </View>
      </View>

      {!!onRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <MaterialIcons name="delete-outline" size={20} color={colors.gray[500]} />
        </Pressable>
      )}
    </View>
  )
}
