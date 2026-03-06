// src/controllers/routine.controller.js
// ============================================================
//  Controlador de Rutinas
//  Maneja: ver rutinas, crear, actualizar, eliminar y favoritos
// ============================================================

const prisma = require('../prisma/client');

// ------------------------------------------------------------
//  LISTAR RUTINAS
//  GET /api/routines
//  Devuelve: rutinas predefinidas + las propias del usuario logueado
//  Requiere: token JWT
// ------------------------------------------------------------
const getRoutines = async (req, res) => {
  try {
    const routines = await prisma.routine.findMany({
      where: {
        OR: [
          { isPredefined: true },          // Todas las predefinidas
          { userId: req.user.id },         // Solo las propias del usuario
        ]
      },
      include: {
        routineExercises: {
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          },
          orderBy: { order: 'asc' }
        },
        user: { select: { id: true, name: true } },
        // Saber si esta rutina está en favoritos del usuario actual
        favoritedBy: {
          where:  { userId: req.user.id },
          select: { userId: true }
        },
        _count: {
          select: { workoutSessions: true }
        }
      },
      orderBy: [
        { isPredefined: 'desc' }, // Predefinidas primero
        { createdAt: 'desc' }
      ]
    });

    // Agregar campo isFavorite para facilitar el uso en el frontend
    const routinesWithFavorite = routines.map(r => ({
      ...r,
      isFavorite:  r.favoritedBy.length > 0,
      favoritedBy: undefined, // No enviar el array completo
    }));

    res.json({ routines: routinesWithFavorite });

  } catch (error) {
    console.error('Error en getRoutines:', error);
    res.status(500).json({ error: 'Error al obtener las rutinas' });
  }
};

// ------------------------------------------------------------
//  VER UNA RUTINA
//  GET /api/routines/:id
// ------------------------------------------------------------
const getRoutineById = async (req, res) => {
  try {
    const { id } = req.params;

    const routine = await prisma.routine.findFirst({
      where: {
        id: parseInt(id),
        OR: [
          { isPredefined: true },
          { userId: req.user.id },
        ]
      },
      include: {
        routineExercises: {
          include: {
            exercise: { include: { muscleGroup: true } }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!routine) {
      return res.status(404).json({ error: 'Rutina no encontrada' });
    }

    res.json({ routine });

  } catch (error) {
    console.error('Error en getRoutineById:', error);
    res.status(500).json({ error: 'Error al obtener la rutina' });
  }
};

// ------------------------------------------------------------
//  CREAR RUTINA PROPIA
//  POST /api/routines
//  Body: {
//    name, description?,
//    exercises: [{ exerciseId, sets, reps, restSeconds, notes?, order }]
//  }
// ------------------------------------------------------------
const createRoutine = async (req, res) => {
  try {
    const { name, description, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre de la rutina es requerido' });
    }
    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ error: 'La rutina debe tener al menos un ejercicio' });
    }

    const routine = await prisma.routine.create({
      data: {
        name,
        description,
        isPredefined: false,
        userId:       req.user.id,
        routineExercises: {
          create: exercises.map((ex, index) => ({
            exerciseId:  ex.exerciseId,
            sets:        ex.sets,
            reps:        ex.reps,
            restSeconds: ex.restSeconds,
            notes:       ex.notes,
            order:       ex.order ?? index + 1,
          }))
        }
      },
      include: {
        routineExercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json({ message: '✅ Rutina creada', routine });

  } catch (error) {
    console.error('Error en createRoutine:', error);
    res.status(500).json({ error: 'Error al crear la rutina' });
  }
};

// ------------------------------------------------------------
//  ELIMINAR RUTINA
//  DELETE /api/routines/:id
//  Solo puede eliminar sus propias rutinas
// ------------------------------------------------------------
const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    const routine = await prisma.routine.findFirst({
      where: { id: parseInt(id), userId: req.user.id, isPredefined: false }
    });

    if (!routine) {
      return res.status(404).json({ error: 'Rutina no encontrada o no tienes permiso para eliminarla' });
    }

    await prisma.routine.delete({ where: { id: parseInt(id) } });

    res.json({ message: '✅ Rutina eliminada' });

  } catch (error) {
    console.error('Error en deleteRoutine:', error);
    res.status(500).json({ error: 'Error al eliminar la rutina' });
  }
};

// ------------------------------------------------------------
//  MARCAR / DESMARCAR FAVORITO
//  POST /api/routines/:id/favorite
//  Si ya es favorita la quita, si no la agrega (toggle)
// ------------------------------------------------------------
const toggleFavorite = async (req, res) => {
  try {
    const routineId = parseInt(req.params.id);
    const userId    = req.user.id;

    // Ver si ya está en favoritos
    const existing = await prisma.favoriteRoutine.findUnique({
      where: { userId_routineId: { userId, routineId } }
    });

    if (existing) {
      // Quitar de favoritos
      await prisma.favoriteRoutine.delete({
        where: { userId_routineId: { userId, routineId } }
      });
      return res.json({ message: '💔 Rutina quitada de favoritos', isFavorite: false });
    } else {
      // Agregar a favoritos
      await prisma.favoriteRoutine.create({ data: { userId, routineId } });
      return res.json({ message: '⭐ Rutina agregada a favoritos', isFavorite: true });
    }

  } catch (error) {
    console.error('Error en toggleFavorite:', error);
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
};

// ------------------------------------------------------------
//  VER FAVORITOS DEL USUARIO
//  GET /api/routines/favorites
// ------------------------------------------------------------
const getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favoriteRoutine.findMany({
      where: { userId: req.user.id },
      include: {
        routine: {
          include: {
            routineExercises: {
              include: { exercise: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    });

    const routines = favorites.map(f => f.routine);
    res.json({ routines });

  } catch (error) {
    console.error('Error en getFavorites:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

module.exports = {
  getRoutines,
  getRoutineById,
  createRoutine,
  deleteRoutine,
  toggleFavorite,
  getFavorites,
};