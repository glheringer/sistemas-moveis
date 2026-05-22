import { Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { colors } from '@/theme/colors'
import { Loading } from '@/components/Loading'
import { initializeDatabase } from '@/database/initializeDatabase'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter'

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <SQLiteProvider databaseName="target.db" onInit={initializeDatabase}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
        }}
      />
    </SQLiteProvider>
  )
}
