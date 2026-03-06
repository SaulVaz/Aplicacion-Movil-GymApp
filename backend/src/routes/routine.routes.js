// src/routes/routine.routes.js
const express = require('express');
const {
  getRoutines,
  getRoutineById,
  createRoutine,
  deleteRoutine,
  toggleFavorite,
  getFavorites,
} = require('../controllers/routine.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// GET    /api/routines            → Listar predefinidas + propias
router.get('/',             getRoutines);

// GET    /api/routines/favorites  → Mis rutinas favoritas
router.get('/favorites',    getFavorites);

// GET    /api/routines/:id        → Ver una rutina
router.get('/:id',          getRoutineById);

// POST   /api/routines            → Crear rutina propia
router.post('/',            createRoutine);

// DELETE /api/routines/:id        → Eliminar rutina propia
router.delete('/:id',       deleteRoutine);

// POST   /api/routines/:id/favorite  → Toggle favorito
router.post('/:id/favorite', toggleFavorite);

module.exports = router;