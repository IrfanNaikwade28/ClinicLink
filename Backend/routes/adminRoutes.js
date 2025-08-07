const express = require('express');
const router = express.Router();
const {
  getUnverifiedDoctors,
  verifyDoctor,
  getAllDoctors,
  getAllPatients,
  deleteUser,
  getAllAppointments
} = require('../controllers/adminController');

const { protect } = require('../middlewares/authMiddleware');

// Protect all admin routes
router.use(protect(['admin']));

// Get all unverified doctors
router.get('/doctors/pending', getUnverifiedDoctors);

// Verify a doctor
router.put('/doctors/verify/:id', verifyDoctor);

// Get all doctors
router.get('/doctors', getAllDoctors);

// Get all patients
router.get('/patients', getAllPatients);

// Delete a user
router.delete('/user/:id', deleteUser);

// View all appointments
router.get('/appointments', getAllAppointments);

module.exports = router;
