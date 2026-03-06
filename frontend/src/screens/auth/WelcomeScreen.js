import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo minimalista */}
      <View style={styles.logoContainer}>
        {/* Icono de barra simple */}
        <View style={styles.logoIcon}>
          <View style={styles.bar} />
          <View style={[styles.bar, styles.barShort]} />
          <View style={styles.bar} />
        </View>
        <Text style={styles.appName}>GYMAPP</Text>
        <Text style={styles.tagline}>Tu compañero de entrenamiento</Text>
      </View>

      {/* Botón Empezar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.startButtonText}>Empezar</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>
          Lleva el control de tus rutinas y progreso
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
    alignItems: 'flex-end',
  },
  bar: {
    width: 8,
    height: 60,
    backgroundColor: '#FF0000',
    borderRadius: 4,
  },
  barShort: {
    height: 40,
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  buttonContainer: {
    gap: 16,
  },
  startButton: {
    backgroundColor: '#FF0000',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});