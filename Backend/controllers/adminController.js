const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Get all unverified doctors
exports.getUnverifiedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', verified: false });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch unverified doctors' });
  }
};

// Approve a doctor
exports.verifyDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await User.findByIdAndUpdate(id, { verified: true }, { new: true });
    res.json({ msg: 'Doctor verified', doctor });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to verify doctor' });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch doctors' });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch patients' });
  }
};

// Delete any user (doctor or patient)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete user' });
  }
};

// View all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch appointments' });
  }
};
