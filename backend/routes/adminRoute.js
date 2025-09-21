import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  listUsers,
  deleteUser,
  deleteDoctor,
  allReports,
  getReportByIdAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
// Users management
adminRouter.get("/users", authAdmin, listUsers);
adminRouter.delete("/users/:id", authAdmin, deleteUser);
// Doctors management
adminRouter.delete("/doctor/:id", authAdmin, deleteDoctor);
// Reports management
adminRouter.get("/reports", authAdmin, allReports);
adminRouter.get("/reports/:id", authAdmin, getReportByIdAdmin);

export default adminRouter;
