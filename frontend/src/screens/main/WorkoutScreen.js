import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, Alert, ScrollView, Modal, ActivityIndicator
} from 'react-native';
import { sessionService } from '../../services/api';

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

export default function WorkoutScreen({ route, navigation }) {
  const { routine } = route.params;
  const [sessionId, setSessionId] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '', rest: '' });
  const [loading, setLoading] = useState(true);
  const [showFinishAlert, setShowFinishAlert] = useState(false);
  const [showCompleteAlert, setShowCompleteAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const currentExercise = routine.routineExercises[currentExerciseIndex];
  const exerciseProgress = completedSets[currentExercise?.id] || [];
  const currentSetNumber = exerciseProgress.length + 1;

  useEffect(() => {
    startSession();
  }, []);

    const startSession = async () => {
    try {
        const res = await sessionService.start({ routineId: routine.id });
        setSessionId(res.data.session.id);
        setCurrentSet({
        reps: routine.routineExercises[0].reps.toString(),
        weight: '',
        rest: routine.routineExercises[0].restSeconds.toString(),
        });
    } catch (e) {
        setErrorMessage('No se pudo iniciar la sesión');
        setShowErrorAlert(true);
        setTimeout(() => navigation.goBack(), 2000);
    } finally {
        setLoading(false);
    }
    };

    const saveSet = async () => {
    if (!currentSet.reps || parseInt(currentSet.reps) <= 0) {
        setErrorMessage('Ingresa las repeticiones realizadas');
        setShowErrorAlert(true);
        return;
    }

    if (!currentSet.weight || parseFloat(currentSet.weight) <= 0) {
        setErrorMessage('Ingresa el peso utilizado');
        setShowErrorAlert(true);
        return;
    }

    try {
        await sessionService.addSet(sessionId, {
        routineExerciseId: currentExercise.id,
        setNumber: currentSetNumber,
        repsActual: parseInt(currentSet.reps),
        weightKg: parseFloat(currentSet.weight),
        restSeconds: currentSet.rest ? parseInt(currentSet.rest) : null,
        });

        const newCompletedSets = {
        ...completedSets,
        [currentExercise.id]: [
            ...(completedSets[currentExercise.id] || []),
            { ...currentSet, setNumber: currentSetNumber }
        ]
        };
        
        setCompletedSets(newCompletedSets);

        if (currentSetNumber >= currentExercise.sets) {
        setTimeout(() => {
            if (currentExerciseIndex < routine.routineExercises.length - 1) {
            nextExercise();
            } else {
            finishWorkout();
            }
        }, 500);
        } else {
        setCurrentSet({
            reps: currentExercise.reps.toString(),
            weight: currentSet.weight,
            rest: currentExercise.restSeconds.toString(),
        });
        }
    } catch (e) {
        setErrorMessage('No se pudo guardar el set');
        setShowErrorAlert(true);
    }
  };

    const nextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    
    if (nextIndex < routine.routineExercises.length) {
        setCurrentExerciseIndex(nextIndex);
        const nextEx = routine.routineExercises[nextIndex];
        setCurrentSet({
        reps: nextEx.reps.toString(),
        weight: '',
        rest: nextEx.restSeconds.toString(),
        });
    } else {
        finishWorkout();
    }
  };

  const cancelWorkout = () => {
    setShowCancelAlert(true);
  };

  const confirmCancel = () => {
    navigation.goBack();
  };

  const finishWorkout = () => {
    setShowFinishAlert(true);
  };

  const confirmFinish = async () => {
    try {
      await sessionService.finish(sessionId, {});
      setShowCompleteAlert(true);
    } catch (e) {
      Alert.alert('Error', 'No se pudo finalizar la sesión');
    }
  };

    if (loading) {
    return (
        <View style={styles.container}>
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF0000" />
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
        </View>
        </View>
    );
    }

    // AGREGAR ESTO:
    if (!currentExercise) {
    return (
        <View style={styles.container}>
        <View style={styles.center}>
            <Text style={styles.loadingText}>Ejercicio no encontrado</Text>
        </View>
        </View>
    );
    }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={cancelWorkout} style={styles.backButton}>
            <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
            Ejercicio {currentExerciseIndex + 1}/{routine.routineExercises.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ejercicio actual */}
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{currentExercise.exercise.name}</Text>
          <Text style={styles.muscleGroup}>{currentExercise.exercise.muscleGroup?.name}</Text>
          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Objetivo:</Text>
            <Text style={styles.targetValue}>
              {currentExercise.sets} series × {currentExercise.reps} reps
            </Text>
          </View>
        </View>

        {/* Sets completados */}
        {exerciseProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Series completadas</Text>
            {exerciseProgress.map((set, idx) => (
              <View key={idx} style={styles.completedSet}>
                <Text style={styles.completedSetNumber}>Set {set.setNumber}</Text>
                <Text style={styles.completedSetInfo}>
                  {set.reps} reps {set.weight && `• ${set.weight} kg`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Registrar set actual */}
        {currentSetNumber <= currentExercise.sets && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Serie {currentSetNumber} de {currentExercise.sets}
            </Text>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Repeticiones</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={currentSet.reps}
                  onChangeText={(v) => setCurrentSet(prev => ({ ...prev, reps: v }))}
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={currentSet.weight}
                  onChangeText={(v) => setCurrentSet(prev => ({ ...prev, weight: v }))}
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveSet}>
              <Text style={styles.saveBtnText}>Guardar serie</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {exerciseProgress.length >= currentExercise.sets ? (
          <TouchableOpacity style={styles.nextBtn} onPress={nextExercise}>
            <Text style={styles.nextBtnText}>
              {currentExerciseIndex < routine.routineExercises.length - 1
                ? 'Siguiente ejercicio →'
                : 'Finalizar entrenamiento'
              }
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.footerHint}>
            Completa {currentExercise.sets - exerciseProgress.length} {currentExercise.sets - exerciseProgress.length === 1 ? 'serie' : 'series'} más
          </Text>
        )}
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

        {/* Alert de cancelar */}
        <CustomAlert
        visible={showCancelAlert}
        title="Cancelar entrenamiento"
        message="¿Seguro que quieres cancelar? No se guardará tu progreso."
        buttons={[
            { text: 'No, continuar', style: 'cancel', onPress: () => {} },
            { text: 'Sí, cancelar', onPress: confirmCancel }
        ]}
        onDismiss={() => setShowCancelAlert(false)}
        />

        {/* Alert de finalizar */}
        <CustomAlert
        visible={showFinishAlert}
        title="Finalizar entrenamiento"
        message="¿Terminaste tu entrenamiento?"
        buttons={[
            { text: 'No', style: 'cancel', onPress: () => {} },
            { text: 'Sí, finalizar', onPress: confirmFinish }
        ]}
        onDismiss={() => setShowFinishAlert(false)}
        />

        {/* Alert de completado */}
        <CustomAlert
        visible={showCompleteAlert}
        title="Entrenamiento completado"
        message="Buen trabajo, sigue así"
        buttons={[
            { text: 'Volver', onPress: () => navigation.navigate('Main') }
        ]}
        onDismiss={() => {}}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#000' },
  center:             { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:        { color: '#999', marginTop: 16, fontSize: 14 },
  header:             { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222', flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  backIcon:           { color: '#FF0000', fontSize: 24, fontWeight: 'bold' },
  headerTitle:        { fontSize: 18, fontWeight: 'bold', color: '#FFF', flex: 1 },
  content:            { flex: 1, padding: 16 },
  exerciseCard:       { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#222' },
  exerciseName:       { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  muscleGroup:        { fontSize: 12, color: '#FF0000', marginBottom: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  targetRow:          { flexDirection: 'row', alignItems: 'center', gap: 8 },
  targetLabel:        { color: '#999', fontSize: 14 },
  targetValue:        { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  section:            { marginBottom: 24 },
  sectionTitle:       { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  completedSet:       { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#222' },
  completedSetNumber: { fontSize: 14, fontWeight: 'bold', color: '#FF0000' },
  completedSetInfo:   { fontSize: 14, color: '#FFF' },
  inputRow:           { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputGroup:         { flex: 1 },
  inputLabel:         { color: '#999', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input:              { backgroundColor: '#111', color: '#FFF', borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', textAlign: 'center', borderWidth: 1, borderColor: '#222' },
  saveBtn:            { backgroundColor: '#FF0000', borderRadius: 12, padding: 16, alignItems: 'center' },
  saveBtnText:        { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footer:             { padding: 16, borderTopWidth: 1, borderTopColor: '#222', backgroundColor: '#000' },
  nextBtn:            { backgroundColor: '#FF0000', borderRadius: 12, padding: 18, alignItems: 'center' },
  nextBtnText:        { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerHint:         { color: '#999', textAlign: 'center', fontSize: 14 },
});