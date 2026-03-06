// src/routes/session.routes.js
const express = require('express');
const {
  getSessions,
  getSessionById,
  startSession,
  addSet,
  finishSession,
} = require('../controllers/session.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// GET   /api/sessions            → Ver historial (con filtro opcional ?routineId=)
router.get('/',              getSessions);

// GET   /api/sessions/:id        → Ver sesión con todos sus sets
router.get('/:id',           getSessionById);

// POST  /api/sessions            → Iniciar nueva sesión
router.post('/',             startSession);

// POST  /api/sessions/:id/sets   → Registrar un set en la sesión
router.post('/:id/sets',     addSet);

// PATCH /api/sessions/:id/finish → Finalizar sesión
router.patch('/:id/finish',  finishSession);

module.exports = router;