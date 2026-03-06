const express = require('express');
const { getExercises, getMuscleGroups, createExercise } = require('../controllers/exercise.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExercises);
router.get('/muscle-groups', getMuscleGroups);
router.post('/', adminMiddleware, createExercise);

module.exports = router;