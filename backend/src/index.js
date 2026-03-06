// src/index.js
// ============================================================
//  Punto de entrada del servidor
// ============================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

// Importar rutas
const authRoutes     = require('./routes/auth.routes');
const userRoutes     = require('./routes/user.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const routineRoutes  = require('./routes/routine.routes');
const sessionRoutes  = require('./routes/session.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
//  MIDDLEWARES GLOBALES
// ============================================================

app.use(cors());           // Permite peticiones desde el móvil / frontend
app.use(express.json());   // Parsea el body de las peticiones como JSON

// ============================================================
//  RUTAS
// ============================================================

app.use('/api/auth',      authRoutes);      // Login y registro
app.use('/api/users',     userRoutes);      // Perfil de usuario
app.use('/api/exercises', exerciseRoutes);  // Catálogo de ejercicios
app.use('/api/routines',  routineRoutes);   // Rutinas (propias y predefinidas)
app.use('/api/sessions',  sessionRoutes);   // Historial de entrenamientos

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ message: ' GymApp API funcionando correctamente' });
});

// ============================================================
//  MANEJO GLOBAL DE ERRORES
// ============================================================

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============================================================
//  INICIAR SERVIDOR
// ============================================================

app.listen(PORT, () => {
  console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Rutas disponibles:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/users/profile`);
  console.log(`   GET    /api/exercises`);
  console.log(`   GET    /api/routines`);
  console.log(`   POST   /api/routines`);
  console.log(`   GET    /api/sessions`);
  console.log(`   POST   /api/sessions\n`);
});