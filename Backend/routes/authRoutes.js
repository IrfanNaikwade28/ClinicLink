const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Only doctors
router.get('/doctor-data', protect(['doctor']), (req, res) => {
  res.json()
});

// Register - use `role` field to differentiate
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
