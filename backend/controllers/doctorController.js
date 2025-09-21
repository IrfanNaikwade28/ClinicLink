import doctorModel from "../models/doctorModel.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const formatDisplayName = (raw) => {
  if (!raw || typeof raw !== "string") return raw;
  let s = raw.trim();
  s = s.replace(/[._-]+/g, " ");
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2");
  s = s.replace(/\s+/g, " ");
  s = s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
  return s;
};
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bycrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const { search } = req.query;
  let appointments = await appointmentModel.find({ docId }).lean();

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

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    // Sort by most recent first
    let appointments = await appointmentModel
      .find({ docId })
      .sort({ date: -1 })
      .lean();

    let earnings = 0;

    for (const item of appointments) {
      if (item.isCompleted || item.payment) earnings += item.amount;
    }

    let patients = [];

    for (const item of appointments) {
      if (!patients.includes(item.userId)) patients.push(item.userId);
    }

    // Refresh embedded userData with latest profile info for latest bookings
    const top = appointments.slice(0, 5);
    if (top.length) {
      const userIds = [...new Set(top.map((a) => a.userId))];
      const users = await userModel
        .find({ _id: { $in: userIds } })
        .select("name email image dob")
        .lean();
      const uMap = new Map(users.map((u) => [String(u._id), u]));
      top.forEach((a) => {
        const u = uMap.get(String(a.userId));
        if (u) {
          const prev = a.userData || {};
          const emailName = (u.email && String(u.email).split('@')[0]) || '';
          const profileName = (u.name && String(u.name).trim()) || undefined;
          a.userData = {
            ...prev,
            name: profileName ?? ((prev.name && String(prev.name).trim()) || (emailName && emailName.trim()) || prev.name),
            email: (u.email && String(u.email).trim()) || prev.email,
            image: (u.image && String(u.image).trim()) || prev.image,
            dob: u.dob || prev.dob,
          };
        }
      });
    }

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: top,
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for Doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from Doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
