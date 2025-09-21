import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// Helper: filter allowed fields based on role
const pickAllowedFields = (role, payload) => {
  const blocked = new Set(["_id", "id", "role", "isAdmin", "email", "date", "slots_booked"]);
  const allowedUser = ["name", "phone", "address", "dob", "gender"]; // email not updatable here
  const allowedDoctor = [
    "name",
    "speciality",
    "fees",
    "available",
    "phone",
    "about",
    "degree",
    "experience",
    "address",
  ];

  const allowed = role === "doctor" ? allowedDoctor : allowedUser;
  const out = {};
  for (const key of allowed) {
    if (payload[key] !== undefined && !blocked.has(key)) {
      out[key] = payload[key];
    }
  }
  return out;
};

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const { profileRole, profileId } = req;
    const Model = profileRole === "doctor" ? doctorModel : userModel;
    const doc = await Model.findById(profileId).select("-password");
    if (!doc) return res.json({ success: false, message: "Profile not found" });
    return res.json({ success: true, profile: doc, role: profileRole });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// PUT /api/profile
// Supports JSON or multipart (image)
const updateProfile = async (req, res) => {
  try {
    const { profileRole, profileId } = req;
    const Model = profileRole === "doctor" ? doctorModel : userModel;

    const updateRaw = { ...req.body };

    // If address comes as JSON string
    if (typeof updateRaw.address === "string") {
      try {
        updateRaw.address = JSON.parse(updateRaw.address);
      } catch (_) {}
    }

    // Handle password change
    const { currentPassword, newPassword } = updateRaw;
    delete updateRaw.currentPassword;
    delete updateRaw.newPassword;

    const toSet = pickAllowedFields(profileRole, updateRaw);

    // Image upload if provided
    const imageFile = req.file;
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      toSet.image = upload.secure_url;
    }

    // Unique email check would go here if we allowed email change (we block it by default).

    // Persist field updates first
    if (Object.keys(toSet).length) {
      await Model.findByIdAndUpdate(profileId, toSet);
    }

    // Password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.json({ success: false, message: "Current password required" });
      }
      const existing = await Model.findById(profileId);
      const ok = await bcrypt.compare(currentPassword, existing.password);
      if (!ok) {
        return res.json({ success: false, message: "Current password is incorrect" });
      }
      if (String(newPassword).length < 8) {
        return res.json({ success: false, message: "Password too short" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await Model.findByIdAndUpdate(profileId, { password: hashed });
    }

    const fresh = await Model.findById(profileId).select("-password");
    return res.json({ success: true, message: "Profile Updated", profile: fresh });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { getProfile, updateProfile };
