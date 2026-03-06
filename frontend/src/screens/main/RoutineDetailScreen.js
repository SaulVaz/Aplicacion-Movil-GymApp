import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { routineService } from '../../services/api';

export default function RoutineDetailScreen({ route, navigation }) {
  const { routineId } = route.params;
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoutine = async () => {
      try {
        const res = await routineService.getById(routineId);
        setRoutine(res.data.routine);
      } catch (e) {
        Alert.alert('Error', 'No se pudo cargar la rutina');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadRoutine();
  }, [routineId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  const renderExercise = ({ item, index }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseNumber}>{index + 1}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{item.exercise.name}</Text>
          <Text style={styles.muscleGroup}>{item.exercise.muscleGroup?.name}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.sets}</Text>
          <Text style={styles.statLabel}>SERIES</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.reps}</Text>
          <Text style={styles.statLabel}>REPS</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.restSeconds}s</Text>
          <Text style={styles.statLabel}>DESCANSO</Text>
        </View>
      </View>
      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{routine.name}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        {routine.description && (
          <Text style={styles.description}>{routine.description}</Text>
        )}
        {routine.isPredefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RUTINA PREDEFINIDA</Text>
          </View>
        )}
      </View>

      {/* Ejercicios */}
      <Text style={styles.sectionTitle}>
        Ejercicios ({routine.routineExercises?.length || 0})
      </Text>

      <FlatList
        data={routine.routineExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExercise}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay ejercicios en esta rutina</Text>
        }
      />

      {/* Botón iniciar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startBtn}
          onPress={() => navigation.navigate('Workout', { routine })}
        >
          <Text style={styles.startBtnText}>Iniciar entrenamiento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#000' },
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header:         { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222', flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton:     { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  backIcon:       { color: '#FF0000', fontSize: 24, fontWeight: 'bold', marginLeft: -2 },
  title:          { fontSize: 24, fontWeight: 'bold', color: '#FFF', flex: 1 },
  infoSection:    { padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  description:    { color: '#999', fontSize: 15, lineHeight: 22, marginBottom: 12 },
  badge:          { backgroundColor: '#FF0000', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start' },
  badgeText:      { fontSize: 11, color: '#FFF', fontWeight: 'bold', letterSpacing: 0.5 },
  sectionTitle:   { fontSize: 18, fontWeight: 'bold', color: '#FFF', paddingHorizontal: 16, marginTop: 24, marginBottom: 16 },
  exerciseCard:   { backgroundColor: '#111', borderRadius: 16, padding: 20, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  exerciseNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF0000', color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center', lineHeight: 32 },
  exerciseName:   { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  muscleGroup:    { fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  statsRow:       { flexDirection: 'row', gap: 16 },
  stat:           { flex: 1, alignItems: 'center' },
  statValue:      { fontSize: 24, fontWeight: 'bold', color: '#FF0000', marginBottom: 4 },
  statLabel:      { fontSize: 10, color: '#666', letterSpacing: 0.5 },
  notes:          { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#222', color: '#999', fontSize: 13, fontStyle: 'italic' },
  empty:          { color: '#666', textAlign: 'center', marginTop: 40 },
  footer:         { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1, borderTopColor: '#222', backgroundColor: '#000' },
  startBtn:       { backgroundColor: '#FF0000', borderRadius: 12, padding: 18, alignItems: 'center' },
  startBtnText:   { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});