import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import { sendControl, setRobotAccessToken } from './src/services/robotConnection';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setHidden(true);
    }
  }, []);

  const handleAuthenticated = (token: string) => {
    // O token permanece somente na memória durante esta execução do aplicativo.
    // Ao fechar o app, será necessário autenticar novamente.
    setRobotAccessToken(token);
    setAccessToken(token);
  };

  const handleLogout = () => {
    // Envia STOP antes de encerrar os hubs e descartar a sessão.
    void sendControl(0, 0);
    setRobotAccessToken(null);
    setAccessToken(null);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar hidden />
        {accessToken ? (
          <DashboardScreen onLogout={handleLogout} />
        ) : (
          <LoginScreen onAuthenticated={handleAuthenticated} />
        )}
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
