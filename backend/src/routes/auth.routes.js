// src/routes/auth.routes.js
const express = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register  → Crear cuenta
router.post('/register', register);

// POST /api/auth/login     → Iniciar sesión
router.post('/login', login);

module.exports = router;