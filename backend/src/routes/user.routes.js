const express = require('express');
const { getProfile, updateProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;