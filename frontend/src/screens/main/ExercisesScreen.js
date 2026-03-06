import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { exerciseService } from '../../services/api';

export default function ExercisesScreen() {
  const [exercises,     setExercises]     = useState([]);
  const [muscleGroups,  setMuscleGroups]  = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exRes, mgRes] = await Promise.all([
          exerciseService.getAll(),
          exerciseService.getMuscleGroups(),
        ]);
        setExercises(exRes.data.exercises);
        setMuscleGroups(mgRes.data.muscleGroups);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los ejercicios');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredExercises = selectedGroup
    ? exercises.filter(e => e.muscleGroupId === selectedGroup)
    : exercises;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  const renderFilter = ({ item }) => {
  // Acortar nombres largos
  let displayName = item.name;
  if (displayName === 'Core / Abdomen') displayName = 'Core';
  
  return (
    <TouchableOpacity
      style={[styles.filterBtn, selectedGroup === item.id && styles.filterBtnActive]}
      onPress={() => setSelectedGroup(item.id)}
    >
      <Text style={[styles.filterText, selectedGroup === item.id && styles.filterTextActive]}>
        {displayName}
      </Text>
    </TouchableOpacity>
  );
};

  const renderExercise = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardGroup}>{item.muscleGroup?.name}</Text>
      {item.description && (
        <Text style={styles.cardDesc}>{item.description}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Ejercicios</Text>

        {/* Filtros horizontales */}
        <FlatList
          horizontal
          data={[{ id: null, name: 'Todos' }, ...muscleGroups]}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderFilter}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersList}
        />
      </View>

      {/* Lista de ejercicios */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExercise}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay ejercicios</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#000' },
  center:            { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  headerContainer:   { paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#000' },
  header:            { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  filtersList:       { marginBottom: 16 },
  filtersContent:    { paddingRight: 16 },
  filterBtn:         { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: '#111', 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: '#222' 
  },
  filterBtnActive:   { backgroundColor: '#FF0000', borderColor: '#FF0000' },
  filterText:        { color: '#999', fontSize: 14, fontWeight: '600' },
  filterTextActive:  { color: '#FFF' },
  listContent:       { paddingHorizontal: 16, paddingBottom: 100 },
  card:              { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  cardTitle:         { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  cardGroup:         { fontSize: 12, color: '#FF0000', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardDesc:          { color: '#999', fontSize: 14, lineHeight: 20 },
  empty:             { color: '#666', textAlign: 'center', marginTop: 40 },
});