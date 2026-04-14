// src/controllers/session.controller.js
// ============================================================
//  Controlador de Sesiones de Entrenamiento
//  Maneja: iniciar sesión, registrar sets y ver historial
// ============================================================

const prisma = require('../prisma/client');

// ------------------------------------------------------------
//  VER HISTORIAL DE SESIONES
//  GET /api/sessions
//  Query params: ?routineId=1  (opcional, para filtrar por rutina)
//  Requiere: token JWT
// ------------------------------------------------------------
const getSessions = async (req, res) => {
  try {
    const { routineId } = req.query;

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: req.user.id,
        ...(routineId && { routineId: parseInt(routineId) })
      },
      include: {
        routine: { select: { id: true, name: true } },
        _count:  { select: { workoutSets: true } }
      },
      orderBy: { startedAt: 'desc' }
    });

    res.json({ sessions });

  } catch (error) {
    console.error('Error en getSessions:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};

// ------------------------------------------------------------
//  VER UNA SESIÓN CON TODOS SUS SETS
//  GET /api/sessions/:id
// ------------------------------------------------------------
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.workoutSession.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
      include: {
        routine: { select: { id: true, name: true } },
        workoutSets: {
          include: {
            routineExercise: {
              include: {
                exercise: { include: { muscleGroup: true } }
              }
            }
          },
          orderBy: [
            { routineExercise: { order: 'asc' } },
            { setNumber: 'asc' }
          ]
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({ session });

  } catch (error) {
    console.error('Error en getSessionById:', error);
    res.status(500).json({ error: 'Error al obtener la sesión' });
  }
};

// ------------------------------------------------------------
//  INICIAR SESIÓN DE ENTRENAMIENTO
//  POST /api/sessions
//  Body: { routineId }
// ------------------------------------------------------------
const startSession = async (req, res) => {
  try {
    const { routineId } = req.body;

    if (!routineId) {
      return res.status(400).json({ error: 'routineId es requerido' });
    }

    // Verificar que la rutina existe y el usuario tiene acceso
    const routine = await prisma.routine.findFirst({
      where: {
        id: parseInt(routineId),
        OR: [{ isPredefined: true }, { userId: req.user.id }]
      }
    });

    if (!routine) {
      return res.status(404).json({ error: 'Rutina no encontrada' });
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId:    req.user.id,
        routineId: parseInt(routineId),
      },
      include: {
        routine: {
          include: {
            routineExercises: {
              include: { exercise: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    res.status(201).json({ message: 'Sesión iniciada', session });

  } catch (error) {
    console.error('Error en startSession:', error);
    res.status(500).json({ error: 'Error al iniciar la sesión' });
  }
};

// ------------------------------------------------------------
//  REGISTRAR UN SET EN LA SESIÓN
//  POST /api/sessions/:id/sets
//  Body: { routineExerciseId, setNumber, repsActual, weightKg?, restSeconds?, notes? }
// ------------------------------------------------------------
const addSet = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { routineExerciseId, setNumber, repsActual, weightKg, restSeconds, notes } = req.body;

    // Verificar que la sesión pertenece al usuario
    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId: req.user.id }
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    if (session.finishedAt) {
      return res.status(400).json({ error: 'Esta sesión ya fue finalizada' });
    }

    const workoutSet = await prisma.workoutSet.create({
      data: {
        sessionId,
        routineExerciseId: parseInt(routineExerciseId),
        setNumber,
        repsActual,
        weightKg:    weightKg    ?? null,
        restSeconds: restSeconds ?? null,
        notes:       notes       ?? null,
      },
      include: {
        routineExercise: {
          include: { exercise: true }
        }
      }
    });

    res.status(201).json({ message: 'Set registrado', workoutSet });

  } catch (error) {
    console.error('Error en addSet:', error);
    res.status(500).json({ error: 'Error al registrar el set' });
  }
};

// ------------------------------------------------------------
//  FINALIZAR SESIÓN
//  PATCH /api/sessions/:id/finish
//  Body: { notes? }
// ------------------------------------------------------------
const finishSession = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { notes } = req.body;

    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId: req.user.id }
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    if (session.finishedAt) {
      return res.status(400).json({ error: 'Esta sesión ya fue finalizada' });
    }

    const updated = await prisma.workoutSession.update({
      where: { id: sessionId },
      data:  {
        finishedAt: new Date(),
        notes:      notes ?? session.notes,
      },
      include: {
        _count: { select: { workoutSets: true } }
      }
    });

    // Calcular duración
    const durationMin = Math.round(
      (updated.finishedAt - updated.startedAt) / 1000 / 60
    );

    res.json({
      message:     `🏁 Sesión finalizada (${durationMin} minutos)`,
      session:     updated,
      durationMin,
    });

  } catch (error) {
    console.error('Error en finishSession:', error);
    res.status(500).json({ error: 'Error al finalizar la sesión' });
  }
};

module.exports = {
  getSessions,
  getSessionById,
  startSession,
  addSet,
  finishSession,
};