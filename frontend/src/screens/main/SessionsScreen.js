import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { sessionService } from '../../services/api';

export default function SessionsScreen() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await sessionService.getAll();
        setSessions(res.data.sessions);
      } catch (e) {
        Alert.alert('Error', 'No se pudo cargar el historial');
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDuration = (start, end) => {
    if (!end) return 'En progreso';
    const mins = Math.round((new Date(end) - new Date(start)) / 1000 / 60);
    return `${mins} min`;
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
      <Text style={styles.header}>Historial</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.routine?.name}</Text>
            <Text style={styles.cardDate}>{formatDate(item.startedAt)}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Duración</Text>
                <Text style={styles.statValue}>{formatDuration(item.startedAt, item.finishedAt)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Sets</Text>
                <Text style={styles.statValue}>{item._count?.workoutSets || 0}</Text>
              </View>
            </View>
            {item.notes && <Text style={styles.cardNotes}>{item.notes}</Text>}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Sin entrenamientos</Text>
            <Text style={styles.empty}>Aún no tienes entrenamientos registrados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#000', padding: 16, paddingTop: 60 },
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header:         { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  card:           { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  cardTitle:      { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  cardDate:       { color: '#999', fontSize: 13, marginBottom: 16 },
  cardFooter:     { flexDirection: 'row', gap: 24, marginBottom: 12 },
  stat:           { flex: 1 },
  statLabel:      { color: '#666', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue:      { color: '#FF0000', fontSize: 16, fontWeight: 'bold' },
  cardNotes:      { color: '#999', fontSize: 13, marginTop: 8, fontStyle: 'italic', borderTopWidth: 1, borderTopColor: '#222', paddingTop: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyTitle:     { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  empty:          { color: '#666', textAlign: 'center' },
});