// src/controllers/user.controller.js
// ============================================================
//  Controlador de Usuarios
//  Maneja: ver perfil y actualizar datos físicos
// ============================================================

const prisma = require('../prisma/client');

// ------------------------------------------------------------
//  VER PERFIL
//  GET /api/users/profile
//  Requiere: token JWT (usuario logueado)
// ------------------------------------------------------------
const getProfile = async (req, res) => {
  try {
    // req.user viene del authMiddleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        weight:    true,
        height:    true,
        birthDate: true,
        bio:       true,
        createdAt: true,
        // Contar cuántas rutinas y sesiones tiene
        _count: {
          select: {
            routines:        true,
            workoutSessions: true,
            favoriteRoutines: true,
          }
        }
      }
    });

    res.json({ user });

  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// ------------------------------------------------------------
//  ACTUALIZAR PERFIL
//  PUT /api/users/profile
//  Body: { name?, weight?, height?, birthDate?, bio? }
//  Requiere: token JWT
// ------------------------------------------------------------
const updateProfile = async (req, res) => {
  try {
    const { name, weight, height, birthDate, bio } = req.body;

    // Construir objeto solo con los campos que llegaron
    const dataToUpdate = {};
    if (name      !== undefined) dataToUpdate.name      = name;
    if (weight    !== undefined) dataToUpdate.weight    = weight;
    if (height    !== undefined) dataToUpdate.height    = height;
    if (birthDate !== undefined) dataToUpdate.birthDate = new Date(birthDate);
    if (bio       !== undefined) dataToUpdate.bio       = bio;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data:  dataToUpdate,
      select: {
        id:        true,
        name:      true,
        email:     true,
        weight:    true,
        height:    true,
        birthDate: true,
        bio:       true,
      }
    });

    res.json({
      message: '✅ Perfil actualizado',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

module.exports = { getProfile, updateProfile };