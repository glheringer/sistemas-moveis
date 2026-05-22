import { Pressable, Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { Progress } from '@/components/Progress'

export type TargetCardData = {
  id: string
  name: string
  current: string
  target: string
  percentage: number
}

type Props = {
  data: TargetCardData
  onPress: () => void
}

export function TargetCard({ data, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: '100%',
        padding: 16,
        borderRadius: 16,
        backgroundColor: pressed ? colors.gray[100] : colors.white,
        borderWidth: 1,
        borderColor: colors.gray[100],
        gap: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: 16, color: colors.black }}>
            {data.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: colors.blue[500] }}>
              {data.current}
            </Text>
            <Text style={{ fontFamily: fontFamily.regular, fontSize: 13, color: colors.gray[500] }}>
              de {data.target}
            </Text>
          </View>
        </View>

        <View style={{
          backgroundColor: colors.blue[500] + '1A',
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
        }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: 13, color: colors.blue[500] }}>
            {data.percentage}%
          </Text>
        </View>
      </View>

      <Progress percentage={data.percentage} />
    </Pressable>
  )
}
