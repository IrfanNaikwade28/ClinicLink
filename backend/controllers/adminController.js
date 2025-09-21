import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import reportModel from "../models/reportModel.js";

// Format a human-friendly display name from profile or email
const formatDisplayName = (raw) => {
  if (!raw || typeof raw !== "string") return raw;
  let s = raw.trim();
  // Replace separators with spaces
  s = s.replace(/[._-]+/g, " ");
  // Add spaces between camelCase boundaries
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Collapse spaces
  s = s.replace(/\s+/g, " ");
  // Title case each word
  s = s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
  return s;
};

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const { search } = req.query;
    let appointments = await appointmentModel.find({}).lean();

    // Refresh embedded userData with latest profile info
    const userIds = [...new Set(appointments.map((a) => a.userId))];
    if (userIds.length) {
      const users = await userModel
        .find({ _id: { $in: userIds } })
        .select("name email image dob")
        .lean();
      const uMap = new Map(users.map((u) => [String(u._id), u]));
      appointments = appointments.map((a) => {
        const u = uMap.get(String(a.userId));
        if (u) {
          const prev = a.userData || {};
          const emailName = (u.email && String(u.email).split('@')[0]) || '';
          const profileName = (u.name && String(u.name).trim()) || undefined;
          a.userData = {
            ...prev,
            // Exact as profile: use profile name verbatim if present; else keep previous; else derive from email
            name: profileName ?? ((prev.name && String(prev.name).trim()) || (emailName && emailName.trim()) || prev.name),
            email: (u.email && String(u.email).trim()) || prev.email,
            image: (u.image && String(u.image).trim()) || prev.image,
            dob: u.dob || prev.dob,
          };
        }
        return a;
      });
    }

    if (search && String(search).trim()) {
      const s = String(search).trim().toLowerCase();
      appointments = appointments.filter((a) => {
        const name = (a.userData?.name || "").toLowerCase();
        const email = (a.userData?.email || "").toLowerCase();
        return name.includes(s) || email.includes(s);
      });
    }
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to list all users (patients) for admin panel
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to delete a user (and optionally their appointments)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Clean up user's appointments
    await appointmentModel.deleteMany({ userId: id });

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to delete a doctor and their related appointments
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await doctorModel.findByIdAndDelete(id);
    if (!doc) return res.json({ success: false, message: "Doctor not found" });

    await appointmentModel.deleteMany({ docId: id });

    res.json({ success: true, message: "Doctor deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for admin to fetch all reports
const allReports = async (req, res) => {
  try {
    const reports = await reportModel
      .find({})
      .populate('doctorId', 'name speciality image')
      .populate('patientId', 'name email phone dob')
      .sort({ updatedAt: -1 });
    
    res.json({ success: true, reports });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get report by id for admin
const getReportByIdAdmin = async (req, res) => {
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

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  listUsers,
  deleteUser,
  deleteDoctor,
  allReports,
  getReportByIdAdmin,
};
