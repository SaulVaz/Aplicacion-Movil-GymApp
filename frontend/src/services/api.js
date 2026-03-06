import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 es la IP especial que usa el emulador de Android para referirse a localhost de tu PC. 
// Es el equivalente al 127.0.0.1 pero para el emulador.
const API_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({ baseURL: API_URL });

// Interceptor: agrega el token automáticamente a cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

export const userService = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const exerciseService = {
  getAll:         (muscleGroupId) => api.get('/exercises', { params: { muscleGroupId } }),
  getMuscleGroups: ()             => api.get('/exercises/muscle-groups'),
};

export const routineService = {
  getAll:        ()   => api.get('/routines'),
  getById:       (id) => api.get(`/routines/${id}`),
  getFavorites:  ()   => api.get('/routines/favorites'),
  create:        (data) => api.post('/routines', data),
  delete:        (id)   => api.delete(`/routines/${id}`),
  toggleFavorite:(id)   => api.post(`/routines/${id}/favorite`),
};

export const sessionService = {
  getAll:    ()         => api.get('/sessions'),
  getById:   (id)       => api.get(`/sessions/${id}`),
  start:     (data)     => api.post('/sessions', data),
  addSet:    (id, data) => api.post(`/sessions/${id}/sets`, data),
  finish:    (id, data) => api.patch(`/sessions/${id}/finish`, data),
};