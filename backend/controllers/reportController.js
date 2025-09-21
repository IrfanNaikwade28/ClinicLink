import reportModel from "../models/reportModel.js";
import appointmentModel from "../models/appointmentModel.js";

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
      .sort({ updatedAt: -1 });
    return res.json({ success: true, reports });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GET /api/reports/:id → fetch a specific report
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportModel.findById(id);
    if (!report) return res.json({ success: false, message: "Report not found" });
    return res.json({ success: true, report });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { createReport, updateReport, listReportsForPatient, getReportById };
