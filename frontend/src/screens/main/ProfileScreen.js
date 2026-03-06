import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert
} from 'react-native';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const res = await userService.getProfile();
          setProfile(res.data.user);
        } catch (e) {
          Alert.alert('Error', 'No se pudo cargar el perfil');
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Perfil</Text>

      <View style={styles.card}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{profile?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{profile?.role}</Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile?._count?.routines || 0}</Text>
          <Text style={styles.statLabel}>Rutinas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile?._count?.workoutSessions || 0}</Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile?._count?.favoriteRoutines || 0}</Text>
          <Text style={styles.statLabel}>Favoritas</Text>
        </View>
      </View>

      {/* Datos físicos */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Datos físicos</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Peso</Text>
          <Text style={styles.infoValue}>{profile?.weight ? `${profile.weight} kg` : 'No registrado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Altura</Text>
          <Text style={styles.infoValue}>{profile?.height ? `${profile.height} cm` : 'No registrado'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000', padding: 16, paddingTop: 60 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header:       { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  card:         { backgroundColor: '#111', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF0000', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText:   { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
  name:         { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  email:        { color: '#999', fontSize: 14, marginTop: 4 },
  roleBadge:    { backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12 },
  roleText:     { color: '#FF0000', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  statsRow:     { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard:     { flex: 1, backgroundColor: '#111', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  statNumber:   { fontSize: 32, fontWeight: 'bold', color: '#FF0000', marginBottom: 4 },
  statLabel:    { color: '#999', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoCard:     { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  infoTitle:    { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 16 },
  infoRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoLabel:    { color: '#999', fontSize: 14 },
  infoValue:    { color: '#FFF', fontSize: 14, fontWeight: '600' },
  logoutBtn:    { backgroundColor: '#FF0000', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8 },
  logoutText:   { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});