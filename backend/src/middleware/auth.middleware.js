// src/middleware/auth.middleware.js
// ============================================================
//  Middleware de autenticación JWT
//  Verifica que el usuario esté logueado antes de entrar a rutas privadas
//  Uso: router.get('/ruta', authMiddleware, controller)
// ============================================================

const jwt    = require('jsonwebtoken');
const prisma = require('../prisma/client');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Leer el token del header Authorization
    //    El header llega así: "Bearer eyJhbGci..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Quitar el "Bearer " del inicio

    // 2. Verificar que el token sea válido y no haya expirado
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar el usuario en la DB para confirmar que aún existe
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // 4. Guardar el usuario en req para que los controllers lo usen
    req.user = user;

    next(); // Continuar a la siguiente función (el controller)

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado, vuelve a iniciar sesión' });
    }
    next(error);
  }
};

// Middleware para verificar que el usuario sea ADMIN
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol ADMIN' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };