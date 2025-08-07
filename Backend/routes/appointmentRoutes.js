const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  rescheduleAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');

const { protect } = require('../middlewares/authMiddleware');

// PATIENT: Book appointment
router.post('/', protect(['patient']), bookAppointment);

// PATIENT: View own appointments
router.get('/patient', protect(['patient']), getPatientAppointments);

// DOCTOR: View own appointments
router.get('/doctor', protect(['doctor']), getDoctorAppointments);

// DOCTOR: Reschedule appointment
router.put('/reschedule/:id', protect(['doctor']), rescheduleAppointment);

// Patient/Doctor: Cancel
router.put('/cancel/:id', protect(['patient', 'doctor']), cancelAppointment);

module.exports = router;
