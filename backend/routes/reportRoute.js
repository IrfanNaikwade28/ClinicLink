import express from "express";
import authProfile from "../middlewares/authProfile.js";
import {
  createReport,
  updateReport,
  listReportsForPatient,
  getReportById,
} from "../controllers/reportController.js";

const reportRouter = express.Router();

// Creation and update (doctor only via controller check)
reportRouter.post("/reports", authProfile, createReport);
reportRouter.put("/reports/:id", authProfile, updateReport);

// Fetch
reportRouter.get("/reports/patient/:patientId", authProfile, listReportsForPatient);
reportRouter.get("/reports/:id", authProfile, getReportById);

export default reportRouter;
