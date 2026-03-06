import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.buttonText}>Iniciar sesión</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  inner:     { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  header:    { marginBottom: 48 },
  title:     { fontSize: 36, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  subtitle:  { fontSize: 16, color: '#999' },
  form:      { gap: 16 },
  input:     { 
    backgroundColor: '#111', 
    color: '#FFF', 
    borderRadius: 12, 
    padding: 18, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  button:       { backgroundColor: '#FF0000', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8 },
  buttonText:   { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  link:         { color: '#666', textAlign: 'center', fontSize: 15, marginTop: 32 },
  linkBold:     { color: '#FF0000', fontWeight: 'bold' },
});