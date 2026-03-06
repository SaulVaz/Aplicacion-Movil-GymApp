import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a GymApp</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
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

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.buttonText}>Crear cuenta</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text>
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