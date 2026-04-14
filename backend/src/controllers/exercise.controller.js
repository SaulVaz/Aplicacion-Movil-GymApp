// src/controllers/exercise.controller.js
// ============================================================
//  Controlador de Ejercicios
//  Maneja: listar ejercicios y grupos musculares
// ============================================================

const prisma = require('../prisma/client');

// ------------------------------------------------------------
//  LISTAR TODOS LOS EJERCICIOS
//  GET /api/exercises
//  Query params: ?muscleGroupId=1  (opcional, para filtrar)
//  Requiere: token JWT
// ------------------------------------------------------------
const getExercises = async (req, res) => {
  try {
    const { muscleGroupId } = req.query;

    const exercises = await prisma.exercise.findMany({
      where: muscleGroupId ? { muscleGroupId: parseInt(muscleGroupId) } : undefined,
      include: {
        muscleGroup: { select: { id: true, name: true } }
      },
      orderBy: [
        { muscleGroup: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    res.json({ exercises });

  } catch (error) {
    console.error('Error en getExercises:', error);
    res.status(500).json({ error: 'Error al obtener los ejercicios' });
  }
};

// ------------------------------------------------------------
//  LISTAR GRUPOS MUSCULARES
//  GET /api/exercises/muscle-groups
//  Requiere: token JWT
// ------------------------------------------------------------
const getMuscleGroups = async (req, res) => {
  try {
    const muscleGroups = await prisma.muscleGroup.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { exercises: true } } // cuántos ejercicios tiene cada grupo
      }
    });

    res.json({ muscleGroups });

  } catch (error) {
    console.error('Error en getMuscleGroups:', error);
    res.status(500).json({ error: 'Error al obtener los grupos musculares' });
  }
};

// ------------------------------------------------------------
//  CREAR EJERCICIO  (solo ADMIN)
//  POST /api/exercises
//  Body: { name, description?, muscleGroupId }
// ------------------------------------------------------------
const createExercise = async (req, res) => {
  try {
    const { name, description, muscleGroupId } = req.body;

    if (!name || !muscleGroupId) {
      return res.status(400).json({ error: 'Nombre y grupo muscular son requeridos' });
    }

    const exercise = await prisma.exercise.create({
      data: { name, description, muscleGroupId: parseInt(muscleGroupId) },
      include: { muscleGroup: true }
    });

    res.status(201).json({ message: 'Ejercicio creado', exercise });

  } catch (error) {
    console.error('Error en createExercise:', error);
    res.status(500).json({ error: 'Error al crear el ejercicio' });
  }
};

module.exports = { getExercises, getMuscleGroups, createExercise };