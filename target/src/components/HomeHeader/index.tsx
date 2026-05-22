import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { Separator } from '@/components/Separator'
import { Summary, SummaryData } from '@/components/Summary'

export type HomeHeaderData = {
  total: string
  input: SummaryData
  output: SummaryData
}

type Props = {
  data: HomeHeaderData
}

export function HomeHeader({ data }: Props) {
  return (
    <LinearGradient
      colors={[colors.blue[500], colors.blue[800]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 28 }}
    >
      <Text style={{ color: colors.white, fontSize: 13, fontFamily: fontFamily.regular, opacity: 0.8 }}>
        Total que você possui
      </Text>

      <Text style={{ color: colors.white, fontSize: 36, fontFamily: fontFamily.bold, marginTop: 8 }}>
        {data.total}
      </Text>

      <View style={{ height: 1, backgroundColor: colors.blue[400], marginVertical: 18, opacity: 0.5 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Summary
          data={data.input}
          icon={{ name: 'arrow-upward', color: colors.green[500] }}
        />

        <Separator color={colors.blue[400]} height={40} />

        <Summary
          alignRight
          data={data.output}
          icon={{ name: 'arrow-downward', color: colors.red[400] }}
        />
      </View>
    </LinearGradient>
  )
}
