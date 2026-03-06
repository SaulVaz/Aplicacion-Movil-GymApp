import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert, ScrollView, Modal
} from 'react-native';
import { exerciseService, routineService } from '../../services/api';

const CustomAlert = ({ visible, title, message, buttons, onDismiss }) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onDismiss}
  >
    <View style={alertStyles.overlay}>
      <View style={alertStyles.container}>
        <Text style={alertStyles.title}>{title}</Text>
        {message && <Text style={alertStyles.message}>{message}</Text>}
        <View style={alertStyles.buttonRow}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                alertStyles.button,
                btn.style === 'cancel' && alertStyles.buttonCancel
              ]}
              onPress={() => {
                onDismiss();
                btn.onPress?.();
              }}
            >
              <Text style={[
                alertStyles.buttonText,
                btn.style === 'cancel' && alertStyles.buttonTextCancel
              ]}>
                {btn.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  </Modal>
);

const alertStyles = StyleSheet.create({
  overlay:           { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container:         { backgroundColor: '#111', borderRadius: 16, padding: 24, width: '100%', maxWidth: 340, borderWidth: 1, borderColor: '#222' },
  title:             { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  message:           { fontSize: 15, color: '#999', marginBottom: 24, lineHeight: 22 },
  buttonRow:         { flexDirection: 'row', gap: 12 },
  button:            { flex: 1, backgroundColor: '#FF0000', borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonCancel:      { backgroundColor: '#222' },
  buttonText:        { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  buttonTextCancel:  { color: '#999' },
});

export default function CreateRoutineScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNoDescAlert, setShowNoDescAlert] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const res = await exerciseService.getAll();
        setExercises(res.data.exercises);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los ejercicios');
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, []);

  const toggleExercise = (exercise) => {
    const exists = selectedExercises.find(e => e.exerciseId === exercise.id);
    if (exists) {
      setSelectedExercises(prev => prev.filter(e => e.exerciseId !== exercise.id));
    } else {
      setSelectedExercises(prev => [...prev, {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: 3,
        reps: 10,
        restSeconds: 60,
      }]);
    }
  };

  const updateExercise = (exerciseId, field, value) => {
    setSelectedExercises(prev => prev.map(e =>
      e.exerciseId === exerciseId ? { ...e, [field]: parseInt(value) || 0 } : e
    ));
  };

  const handleCreate = async () => {
    if (!name) {
      setErrorMessage('Ingresa un nombre para la rutina');
      setShowErrorAlert(true);
      return;
    }
    
    if (selectedExercises.length === 0) {
      setErrorMessage('Selecciona al menos un ejercicio');
      setShowErrorAlert(true);
      return;
    }

    // Si no tiene descripción, preguntar
    if (!description || description.trim() === '') {
      setShowNoDescAlert(true);
      return;
    }

    createRoutine();
  };

  const createRoutine = async () => {
    try {
      setCreating(true);
      await routineService.create({
        name,
        description,
        exercises: selectedExercises.map((e, index) => ({
          exerciseId: e.exerciseId,
          sets: e.sets,
          reps: e.reps,
          restSeconds: e.restSeconds,
          order: index + 1,
        }))
      });
      navigation.goBack();
    } catch (e) {
      setErrorMessage(e.response?.data?.error || 'No se pudo crear la rutina');
      setShowErrorAlert(true);
    } finally {
      setCreating(false);
    }
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
      {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crear rutina</Text>
        </View>

        <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        >
        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Nombre de la rutina"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción (opcional)"
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
        />

        {/* Ejercicios seleccionados */}
        {selectedExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ejercicios ({selectedExercises.length})</Text>
            {selectedExercises.map((ex) => (
              <View key={ex.exerciseId} style={styles.selectedCard}>
                <Text style={styles.selectedName}>{ex.name}</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Series</Text>
                    <TextInput
                      style={styles.smallInput}
                      keyboardType="number-pad"
                      value={String(ex.sets)}
                      onChangeText={(v) => updateExercise(ex.exerciseId, 'sets', v)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={styles.smallInput}
                      keyboardType="number-pad"
                      value={String(ex.reps)}
                      onChangeText={(v) => updateExercise(ex.exerciseId, 'reps', v)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Descanso (s)</Text>
                    <TextInput
                      style={styles.smallInput}
                      keyboardType="number-pad"
                      value={String(ex.restSeconds)}
                      onChangeText={(v) => updateExercise(ex.exerciseId, 'restSeconds', v)}
                    />
                  </View>
                </View>
                <TouchableOpacity onPress={() => toggleExercise({ id: ex.exerciseId })}>
                  <Text style={styles.removeBtn}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Lista de ejercicios disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agregar ejercicios</Text>
          {exercises.map((exercise) => {
            const isSelected = selectedExercises.some(e => e.exerciseId === exercise.id);
            return (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseCard, isSelected && styles.exerciseCardSelected]}
                onPress={() => toggleExercise(exercise)}
              >
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseGroup}>{exercise.muscleGroup?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Botón crear */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={creating}>
          {creating
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.createBtnText}>Crear rutina</Text>
          }
        </TouchableOpacity>
      </View>
      {/* Alert de error */}
      <CustomAlert
        visible={showErrorAlert}
        title="Error"
        message={errorMessage}
        buttons={[
          { text: 'OK', onPress: () => {} }
        ]}
        onDismiss={() => setShowErrorAlert(false)}
      />

      {/* Alert sin descripción */}
      <CustomAlert
        visible={showNoDescAlert}
        title="Sin descripción"
        message="¿Seguro que quieres crear una rutina sin descripción?"
        buttons={[
          { text: 'Cancelar', style: 'cancel', onPress: () => {} },
          { text: 'Crear', onPress: createRoutine }
        ]}
        onDismiss={() => setShowNoDescAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: '#000' },
  center:               { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header:               { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222', flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton:           { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  backIcon:             { color: '#FF0000', fontSize: 24, fontWeight: 'bold',marginLeft: -2 },
  title:                { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  content:              { flex: 1, paddingHorizontal: 16 },
  input:                { backgroundColor: '#111', color: '#FFF', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#222', marginTop: 16 },
  section:              { marginTop: 24, marginBottom: 24 },
  sectionTitle:         { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  selectedCard:         { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  selectedName:         { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  inputRow:             { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputGroup:           { flex: 1 },
  inputLabel:           { color: '#666', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  smallInput:           { backgroundColor: '#000', color: '#FFF', borderRadius: 8, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#333', textAlign: 'center' },
  removeBtn:            { color: '#FF0000', fontSize: 14, fontWeight: '600' },
  exerciseCard:         { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#222' },
  exerciseCardSelected: { borderColor: '#FF0000', backgroundColor: '#1a0000' },
  exerciseName:         { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  exerciseGroup:        { fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  footer:               { padding: 16, borderTopWidth: 1, borderTopColor: '#222' },
  createBtn:            { backgroundColor: '#FF0000', borderRadius: 12, padding: 18, alignItems: 'center' },
  createBtnText:        { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});