import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAuthErrorMessage, registerWithEmail } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleRegister() {
    if (loading) {
      return;
    }

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      const message = 'Preencha email, senha e confirmacao de senha.';
      setErrorMessage(message);
      Alert.alert('Validacao', message);
      return;
    }

    if (password.length < 6) {
      const message = 'A senha precisa ter pelo menos 6 caracteres.';
      setErrorMessage(message);
      Alert.alert('Validacao', message);
      return;
    }

    if (password !== confirmPassword) {
      const message = 'As senhas nao conferem.';
      setErrorMessage(message);
      Alert.alert('Validacao', message);
      return;
    }

    try {
      setErrorMessage('');
      setLoading(true);
      await registerWithEmail(email.trim(), password);
      Alert.alert('Sucesso', 'Conta criada com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setErrorMessage(message);
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.accentCircle} />
          <View style={styles.accentCircleSoft} />
          <Text style={styles.kicker}>Criacao de conta</Text>
          <Text style={styles.title}>Abra sua conta para organizar suas tarefas</Text>
          <Text style={styles.subtitle}>
            Registre-se com email e senha para salvar suas tarefas no Firestore por usuario.
          </Text>
        </View>

        <View style={styles.card}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Nao foi possivel criar a conta</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errorMessage) {
                setErrorMessage('');
              }
            }}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errorMessage) {
                setErrorMessage('');
              }
            }}
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              if (errorMessage) {
                setErrorMessage('');
              }
            }}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>{loading ? 'Criando conta...' : 'Criar conta'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkButtonText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  hero: {
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#0f172a',
    padding: 24,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  accentCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
    top: -50,
    right: -40,
  },
  accentCircleSoft: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    bottom: -30,
    left: -20,
  },
  kicker: {
    color: '#93c5fd',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorTitle: {
    color: '#b91c1c',
    fontWeight: '800',
    marginBottom: 4,
  },
  errorText: {
    color: '#7f1d1d',
    lineHeight: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    color: '#0f172a',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.75,
  },
});
