import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginAdmin } from '../services/auth';

interface Props {
  onAuthenticated: (token: string) => void;
}

export default function LoginScreen({ onAuthenticated }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Informe o e-mail e a senha da conta administradora.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await loginAdmin(email, password);
      onAuthenticated(token);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Não foi possível autenticar no Adan-Stella.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>V</Text>
          </View>

          <Text style={styles.brand}>VENTOL</Text>
          <Text style={styles.title}>Controle remoto</Text>
          <Text style={styles.description}>
            Entre com uma conta administradora do Adan-Stella para acessar o robô.
          </Text>

          <Text style={styles.label}>E-MAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="admin@exemplo.com"
            placeholderTextColor="#7c8798"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            editable={!loading}
            style={styles.input}
          />

          <Text style={styles.label}>SENHA</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha do Adan-Stella"
            placeholderTextColor="#7c8798"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            editable={!loading}
            onSubmitEditing={() => void handleLogin()}
            style={styles.input}
          />

          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => void handleLogin()}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>ENTRAR E CONECTAR</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footer}>
            Acesso restrito a administradores autorizados.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: '#172337',
    borderColor: '#2a3b54',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 28,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    alignSelf: 'center',
    marginBottom: 12,
  },
  brandMarkText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 24,
  },
  brand: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  title: {
    color: '#f8fafc',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
  description: {
    color: '#a7b5c8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  label: {
    color: '#a7b5c8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b4c64',
    backgroundColor: '#101b2c',
    color: '#f8fafc',
    paddingHorizontal: 14,
    fontSize: 14,
  },
  error: {
    color: '#fca5a5',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footer: {
    color: '#718198',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 18,
  },
});
