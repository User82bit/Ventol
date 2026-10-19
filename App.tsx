import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    // Hide Android's navigation controls; swipe from the edge to reveal them temporarily.
    NavigationBar.setPositionAsync('absolute').catch(() => {});
    NavigationBar.setBackgroundColorAsync('#00000000').catch(() => {});
    NavigationBar.setBehaviorAsync('inset-swipe').catch(() => {});
    NavigationBar.setVisibilityAsync('hidden').catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar hidden />
        <DashboardScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
