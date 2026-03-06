// src/controllers/auth.controller.js
// ============================================================
//  Controlador de Autenticación
//  Maneja: registro de usuarios y login
// ============================================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const prisma = require('../prisma/client');

// ------------------------------------------------------------
//  REGISTRO
//  POST /api/auth/register
//  Body: { name, email, password }
// ------------------------------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar que llegaron todos los campos
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // 2. Verificar que el email no esté registrado ya
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Ese email ya está registrado' });
    }

    // 3. Encriptar la contraseña (nunca guardar contraseñas en texto plano)
    //    El número 10 es el "salt rounds" - entre más alto, más seguro pero más lento
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Crear el usuario en la DB
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: {           // Solo devolver estos campos, NUNCA el passwordHash
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        createdAt: true,
      }
    });

    // 5. Crear el token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },  // Payload (datos dentro del token)
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: '✅ Usuario registrado exitosamente',
      token,
      user,
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// ------------------------------------------------------------
//  LOGIN
//  POST /api/auth/login
//  Body: { email, password }
// ------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // 2. Buscar el usuario por email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Mensaje genérico para no revelar si el email existe o no
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // 3. Comparar contraseña con el hash guardado
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // 4. Crear el token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: '✅ Login exitoso',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };