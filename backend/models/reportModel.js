import mongoose from "mongoose";

const reportVersionSchema = new mongoose.Schema(
  {
    status: { type: Object, default: {} }, // e.g., { bp: '120/80', sugar: '90', bmi: '22' }
    description: { type: String, default: "" },
    version: { type: Number, required: true },
  },
  { timestamps: true }
);

const reportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment", required: true },
    versions: { type: [reportVersionSchema], default: [] },
  },
  { timestamps: true }
);

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);

export default reportModel;
