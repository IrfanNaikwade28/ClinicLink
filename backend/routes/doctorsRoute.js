import express from 'express';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js';
import {
  listDoctorsPublic,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorCrudController.js';

const router = express.Router();

// Public list for patient-side
router.get('/', listDoctorsPublic);

// Admin-only CRUD
router.post('/', authAdmin, upload.single('image'), createDoctor);
router.put('/:id', authAdmin, upload.single('image'), updateDoctor);
router.delete('/:id', authAdmin, deleteDoctor);

export default router;