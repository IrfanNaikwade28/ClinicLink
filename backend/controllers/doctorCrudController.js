import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';

export const listDoctorsPublic = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createDoctor = async (req, res) => {
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

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: 'Missing Details' });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = '';
    if (imageFile) {
      const uploaded = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      imageUrl = uploaded.secure_url;
    } else {
      return res.json({ success: false, message: 'Doctor image is required' });
    }

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const created = await doctorModel.create(doctorData);
    res.json({ success: true, doctor: { ...created.toObject(), password: undefined } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.address && typeof updates.address === 'string') {
      try { updates.address = JSON.parse(updates.address); } catch {}
    }

    if (updates.password) {
      // If password provided, hash it
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
      updates.image = uploaded.secure_url;
    }

    const updated = await doctorModel.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!updated) return res.json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await doctorModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default { listDoctorsPublic, createDoctor, updateDoctor, deleteDoctor };