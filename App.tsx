import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <DashboardScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});