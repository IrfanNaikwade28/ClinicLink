const express = require('express');
const router = express.Router();
const {
  addRecord,
  getPatientRecords,
  getPatientRecordsByDoctor
} = require('../controllers/medicalRecordController');

const { protect } = require('../middlewares/authMiddleware');

// Doctor: Add diagnosis/prescription to patient
router.post('/', protect(['doctor']), addRecord);

// Patient: View own records
router.get('/patient', protect(['patient']), getPatientRecords);

// Doctor: View specific patient's records
router.get('/patient/:id', protect(['doctor']), getPatientRecordsByDoctor);

module.exports = router;
