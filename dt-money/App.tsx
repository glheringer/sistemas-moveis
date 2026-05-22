import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TransactionsProvider } from './src/contexts/TransactionsContext';
import { Home } from './src/screens/Home';
import { NewTransactionModal } from './src/screens/NewTransactionModal';
import { colors } from './src/theme';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SafeAreaProvider>
      <TransactionsProvider>
        <View style={styles.root}>
          <StatusBar style="light" />
          <Home onOpenNewTransaction={() => setModalOpen(true)} />
          <NewTransactionModal
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </View>
      </TransactionsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
