import reportModel from "../models/reportModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

// POST /api/reports (doctor only)
const createReport = async (req, res) => {
  try {
    const { profileRole, profileId } = req;
    if (profileRole !== "doctor") {
      return res.json({ success: false, message: "Only doctors can create reports" });
    }

    const { patientId, appointmentId, status = {}, description = "" } = req.body;

    // Basic validation: appointment must belong to doctor and patient
    const appt = await appointmentModel.findById(appointmentId);
    if (!appt || appt.docId !== String(profileId) || appt.userId !== String(patientId)) {
      return res.json({ success: false, message: "Invalid appointment/patient" });
    }

    const report = await reportModel.create({
      patientId,
      doctorId: profileId,
      appointmentId,
      versions: [
        {
          status,
          description,
          version: 1,
        },
      ],
    });

    return res.json({ success: true, report });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// PUT /api/reports/:id (doctor only) → adds new version
const updateReport = async (req, res) => {
  try {
    const { profileRole, profileId } = req;
    if (profileRole !== "doctor") {
      return res.json({ success: false, message: "Only doctors can update reports" });
    }

    const { id } = req.params;
    const { status = {}, description = "" } = req.body;

    const report = await reportModel.findById(id);
    if (!report) return res.json({ success: false, message: "Report not found" });
    if (String(report.doctorId) !== String(profileId)) {
      return res.json({ success: false, message: "Not allowed" });
    }

    const nextVersion = (report.versions.at(-1)?.version || 0) + 1;
    report.versions.push({ status, description, version: nextVersion });
    await report.save();

    return res.json({ success: true, report });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GET /api/reports/patient/:patientId → all reports for a patient
const listReportsForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await reportModel
      .find({ patientId })
      .populate('doctorId', 'name image speciality')
      .sort({ updatedAt: -1 });
    return res.json({ success: true, reports });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GET /api/reports/:id → fetch a specific report with full context
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportModel.findById(id)
      .populate('doctorId', 'name image speciality degree')
      .populate('patientId', 'name email phone dob gender address')
      .populate('appointmentId');
    
    if (!report) return res.json({ success: false, message: "Report not found" });
    
    // Get additional appointment details if populated
    let appointmentData = null;
    if (report.appointmentId) {
      appointmentData = await appointmentModel.findById(report.appointmentId);
    }
    
    return res.json({ 
      success: true, 
      report,
      appointmentData,
      patientData: report.patientId,
      doctorData: report.doctorId
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GET /api/reports/comprehensive/:patientId/:appointmentId → get report with full context for editing
const getReportForEditing = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;
    const { profileRole, profileId } = req;
    
    // Get appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    
    // Get patient data
    const patientData = await userModel.findById(patientId).select('-password');
    if (!patientData) {
      return res.json({ success: false, message: "Patient not found" });
    }
    
    // Get doctor data
    let doctorData = null;
    if (profileRole === 'doctor') {
      doctorData = await doctorModel.findById(profileId).select('-password');
    }
    
    // Get all reports for this patient
    const reports = await reportModel
      .find({ patientId })
      .populate('doctorId', 'name image speciality')
      .sort({ updatedAt: -1 });
    
    // Find the editable report for this doctor/appointment
    let editableReport = null;
    if (profileRole === 'doctor') {
      editableReport = reports.find(r => 
        String(r.appointmentId) === String(appointmentId) && 
        String(r.doctorId._id) === String(profileId)
      );
      
      // If no appointment-specific report, find any by this doctor
      if (!editableReport) {
        editableReport = reports.find(r => String(r.doctorId._id) === String(profileId));
      }
    }
    
    return res.json({ 
      success: true, 
      appointmentData,
      patientData,
      doctorData,
      reports,
      editableReport
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { createReport, updateReport, listReportsForPatient, getReportById, getReportForEditing };
