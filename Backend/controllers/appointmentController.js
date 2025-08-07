const Appointment = require('../models/Appointment');

// Book appointment
exports.bookAppointment = async (req, res) => {
  const { doctorId, appointmentDate, reason } = req.body;

  try {
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      reason,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Booking failed', error: err.message });
  }
};

// Get patient's appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id }).populate('doctorId', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get appointments' });
  }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id }).populate('patientId', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get appointments' });
  }
};

// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { newDate } = req.body;

  try {
    const updated = await Appointment.findByIdAndUpdate(id, { appointmentDate: newDate }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to reschedule' });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const cancelled = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    res.json(cancelled);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to cancel' });
  }
};
