const MedicalRecord = require('../models/MedicalRecord');

// Doctor adds new record to a patient
exports.addRecord = async (req, res) => {
  const { patientId, diagnosis, prescription, notes } = req.body;

  try {
    const record = new MedicalRecord({
      patientId,
      doctorId: req.user.id,
      diagnosis,
      prescription,
      notes
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create record', error: err.message });
  }
};

// Patient views own medical history
exports.getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id }).populate('doctorId', 'name email specialization');
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch records' });
  }
};

// Doctor views medical history of a specific patient
exports.getPatientRecordsByDoctor = async (req, res) => {
  const { id } = req.params; // patientId

  try {
    const records = await MedicalRecord.find({ patientId: id }).populate('doctorId', 'name email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch patient records' });
  }
};
