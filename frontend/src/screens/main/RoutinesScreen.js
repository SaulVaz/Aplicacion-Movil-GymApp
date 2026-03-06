import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { routineService } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

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

export default function RoutinesScreen({ navigation }) {
  const [routines, setRoutines] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showFavoriteAlert, setShowFavoriteAlert] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const res = await routineService.getAll();
      setRoutines(res.data.routines);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar las rutinas');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRoutines();
    }, [])
  );

    const toggleFavorite = async (id, event) => {
    // Detener la propagación para que no abra el detalle
    if (event) {
      event.stopPropagation();
    }
    
    try {
      // Actualizar UI inmediatamente (optimistic update)
      setRoutines(prev => prev.map(r =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ));
      
      // Llamar al backend en segundo plano
      await routineService.toggleFavorite(id);
    } catch (e) {
      // Si falla, revertir el cambio
      setRoutines(prev => prev.map(r =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ));
      Alert.alert('Error', 'No se pudo actualizar favorito');
    }
  };

  const handleDeleteRoutine = (routine) => {
  if (routine.isPredefined) {
    return; // No hacer nada si es predefinida
  }
  
  if (routine.isFavorite) {
    setRoutineToDelete(routine);
    setShowFavoriteAlert(true);
  } else {
    setRoutineToDelete(routine);
    setShowDeleteAlert(true);
  }
  };

  const confirmDelete = async () => {
    try {
      await routineService.delete(routineToDelete.id);
      setRoutines(prev => prev.filter(r => r.id !== routineToDelete.id));
      setRoutineToDelete(null);
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la rutina');
    }
  };

  const removeFavoriteAndDelete = async () => {
    try {
      await routineService.toggleFavorite(routineToDelete.id);
      await routineService.delete(routineToDelete.id);
      setRoutines(prev => prev.filter(r => r.id !== routineToDelete.id));
      setRoutineToDelete(null);
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la rutina');
    }
  };

    const renderRoutine = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('RoutineDetail', { routineId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          {item.isPredefined && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PREDEFINIDA</Text>
            </View>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id, e);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="heart" 
              size={24} 
              color={item.isFavorite ? '#FF0000' : '#666'} 
            />
          </TouchableOpacity>
          
          {!item.isPredefined && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteRoutine(item);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginLeft: 12 }}
            >
              <Ionicons 
                name="trash-outline" 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {item.description && (
        <Text style={styles.cardDesc}>{item.description}</Text>
      )}
      <Text style={styles.cardInfo}>
        {item.routineExercises?.length || 0} ejercicios
      </Text>
    </TouchableOpacity>
  );

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      );
    }

    return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Rutinas</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => navigation.navigate('CreateRoutine')}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRoutine}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay rutinas disponibles</Text>
        }
      />

      {/* Alert de confirmación de eliminación */}
      <CustomAlert
        visible={showDeleteAlert}
        title="Eliminar rutina"
        message="¿Estás seguro que quieres eliminar esta rutina?"
        buttons={[
          { text: 'Cancelar', style: 'cancel', onPress: () => setRoutineToDelete(null) },
          { text: 'Eliminar', onPress: confirmDelete }
        ]}
        onDismiss={() => setShowDeleteAlert(false)}
      />

      {/* Alert cuando tiene favorito */}
      <CustomAlert
        visible={showFavoriteAlert}
        title="Rutina en favoritos"
        message="Esta rutina está en favoritos. Se quitará de favoritos y se eliminará."
        buttons={[
          { text: 'Cancelar', style: 'cancel', onPress: () => setRoutineToDelete(null) },
          { text: 'Eliminar', onPress: removeFavoriteAndDelete }
        ]}
        onDismiss={() => setShowFavoriteAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#000', paddingTop: 60, paddingHorizontal: 16 },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  headerRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header:           { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  addBtn:           { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FF0000', justifyContent: 'center', alignItems: 'center' },
  addBtnText:       { color: '#FFF', fontSize: 28, lineHeight: 28, marginTop: -2 }, // ajuste para centrar el +
  card:             { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  cardHeader:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle:        { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  badge:            { backgroundColor: '#FF0000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText:        { fontSize: 10, color: '#FFF', fontWeight: 'bold', letterSpacing: 0.5 },
  cardDesc:         { color: '#999', fontSize: 14, marginBottom: 12, lineHeight: 20 },
  cardInfo:         { color: '#666', fontSize: 13 },
  empty:            { color: '#666', textAlign: 'center', marginTop: 40 },
});